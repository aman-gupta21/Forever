import crypto from "node:crypto";
import Razorpay from "razorpay";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import { products as catalogProducts } from "../../frontend/src/assets/assets.js";

const deliveryFee = 10;
const catalogById = new Map(catalogProducts.map((product) => [product._id, product]));

const resolveOrderItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Your cart is empty");
  }

  const databaseIds = items
    .map((item) => item?._id)
    .filter((id) => typeof id === "string" && /^[a-f\d]{24}$/i.test(id));
  const databaseProducts = databaseIds.length
    ? await productModel.find({ _id: { $in: databaseIds } })
    : [];
  const productsById = new Map(databaseProducts.map((product) => [String(product._id), product]));

  let subtotal = 0;
  const verifiedItems = items.map((item) => {
    const product = productsById.get(String(item?._id)) ?? catalogById.get(item?._id);
    const quantity = Number(item?.quantity);
    const size = item?.size;

    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new Error("The cart contains an invalid product or quantity");
    }
    if (!Array.isArray(product.sizes) || !product.sizes.includes(size)) {
      throw new Error(`The selected size is unavailable for ${product.name}`);
    }

    subtotal += product.price * quantity;
    return {
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      subCategory: product.subCategory ?? product.subcategory,
      sizes: product.sizes,
      size,
      quantity,
    };
  });

  return { items: verifiedItems, amount: subtotal + deliveryFee };
};

const getRazorpayClient = () => {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env");
  }

  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
};

const placeOrder = async (req, res) => {
  try {
    const { items, address } = req.body;
    const verifiedOrder = await resolveOrderItems(items);
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: verifiedOrder.items,
      address,
      amount: verifiedOrder.amount,
      paymentMethod: "Cash On Delivery",
      payment: false,
      date: Date.now(),
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error("Unable to place cash-on-delivery order:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

const createRazorpayOrder = async (req, res) => {
  let verifiedOrder;
  try {
    verifiedOrder = await resolveOrderItems(req.body.items);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  const amountInPaise = Math.round(verifiedOrder.amount * 100);
  if (amountInPaise < 100) {
    return res.status(400).json({ success: false, message: "Payment amount must be at least INR 1.00" });
  }

  try {
    const razorpay = getRazorpayClient();
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: crypto.randomUUID(),
      notes: { userId: req.body.userId },
    });

    res.json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      order: razorpayOrder,
      amount: verifiedOrder.amount,
    });
  } catch (error) {
    console.error("Unable to create Razorpay order:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
      address,
    } = req.body;
    if (
      typeof razorpayOrderId !== "string" ||
      typeof razorpayPaymentId !== "string" ||
      typeof razorpaySignature !== "string"
    ) {
      return res.status(400).json({ success: false, message: "Payment verification details are incomplete" });
    }

    const existingOrder = await orderModel.findOne({ paymentId: razorpayPaymentId });
    if (existingOrder) {
      if (existingOrder.userId !== req.body.userId) {
        return res.status(403).json({ success: false, message: "This payment belongs to another account" });
      }
      return res.json({ success: true, message: "Payment already verified" });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!process.env.RAZORPAY_KEY_ID || !secret) {
      throw new Error("Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env");
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");
    const receivedSignature = Buffer.from(razorpaySignature, "hex");
    const expectedSignatureBuffer = Buffer.from(expectedSignature, "hex");

    if (
      receivedSignature.length !== expectedSignatureBuffer.length ||
      !crypto.timingSafeEqual(receivedSignature, expectedSignatureBuffer)
    ) {
      return res.status(400).json({ success: false, message: "Payment signature verification failed" });
    }

    const razorpay = getRazorpayClient();
    const razorpayOrder = await razorpay.orders.fetch(razorpayOrderId);
    let payment = await razorpay.payments.fetch(razorpayPaymentId);
    if (
      razorpayOrder.notes?.userId !== req.body.userId ||
      payment.order_id !== razorpayOrderId
    ) {
      return res.status(400).json({ success: false, message: "Payment has not been captured for this account and order" });
    }

    if (payment.status === "authorized") {
      payment = await razorpay.payments.capture(payment.id, payment.amount, payment.currency);
    }
    if (payment.status !== "captured") {
      return res.status(400).json({ success: false, message: "Payment has not been captured for this order" });
    }

    const verifiedOrder = await resolveOrderItems(items);
    if (
      payment.amount !== Math.round(verifiedOrder.amount * 100) ||
      payment.currency !== "INR" ||
      razorpayOrder.amount !== Math.round(verifiedOrder.amount * 100)
    ) {
      return res.status(400).json({ success: false, message: "Paid amount does not match the order total" });
    }

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: verifiedOrder.items,
      address,
      amount: verifiedOrder.amount,
      paymentMethod: "Razorpay",
      payment: true,
      paymentId: razorpayPaymentId,
      status: "Order Placed",
      date: Date.now(),
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    res.json({ success: true, message: "Payment verified and order placed" });
  } catch (error) {
    console.error("Unable to verify Razorpay payment:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};


// All Orders data for Admin panel

const allOrders = async (req,res) => {
  try {     
    const orders = await orderModel.find({})
    res.json({success: true, orders})

  } catch (error) {
      console.log(error)
      res.json({success:false, message:error.message})
  }
}



// User Order Data for Frontend
const userOrders = async (req,res) => {
  try {
    const { userId } = req.body
    const orders = await orderModel.find({ userId })
    res.json({success: true, orders})
  } catch (error) {
      console.log(error)
      res.json({success:false, message:error.message})
  }
}



// update order status from Admin Panel
const updateStatus = async (req, res) => {
  try{
    const {orderId, status} = req.body
    await orderModel.findByIdAndUpdate(orderId, {status})
    res.json({success: true, message: "Order Status Updated"})
  } catch (error){
    console.log(error)
    res.json({success:false, message:error.message})
  }
}


export { placeOrder, createRazorpayOrder, verifyRazorpayPayment, allOrders, userOrders, updateStatus };