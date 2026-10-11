import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const PlaceOrder = () => {

  const [method,setMethod] = useState('Cash On Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:''
  })

  const onChangeHandler  = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData( data => ({...data,[name]:value }))
  }

  const onSubmitHandler = async (event) => {
     event.preventDefault()
     if (!token) {
      toast.error('Please log in before placing your order');
      navigate('/login');
      return;
     }

     setIsSubmitting(true);
     try {
      let orderItems = []

      for(const items in cartItems){
        for(const item in cartItems[items]){
          if(cartItems[items][item] > 0){
             const itemInfo = structuredClone(products.find(product => product._id === items))
             if(itemInfo){
                itemInfo.size = item
                itemInfo.quantity = cartItems[items][item]
                orderItems.push(itemInfo)
             }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      switch(method) {
       case 'Cash On Delivery': {
       const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers: {token}})
       if(response.data.success){
         setCartItems({})
         navigate('/orders')
       } else {
         toast.error(response.data.message || 'Unable to place order');
         setIsSubmitting(false);
       }
       break;
       }

       case 'Razorpay': {
        const scriptLoaded = await new Promise((resolve) => {
          const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
          if (existingScript) {
            resolve(true);
            return;
          }

          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
        if (!scriptLoaded) {
          throw new Error('Unable to load Razorpay checkout. Check your internet connection and try again.');
        }

        const { data: paymentOrder } = await axios.post(
          backendUrl + '/api/order/razorpay/create',
          orderData,
          { headers: { token } }
        );
        if (!paymentOrder.success) {
          throw new Error(paymentOrder.message || 'Unable to start payment');
        }

        const checkout = new window.Razorpay({
          key: paymentOrder.keyId,
          amount: paymentOrder.order.amount,
          currency: paymentOrder.order.currency,
          name: 'Forever',
          description: 'Order payment',
          order_id: paymentOrder.order.id,
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            contact: formData.phone,
          },
          handler: async (paymentResponse) => {
            try {
              const { data: verification } = await axios.post(
                backendUrl + '/api/order/razorpay/verify',
                {
                  ...orderData,
                  razorpayOrderId: paymentResponse.razorpay_order_id,
                  razorpayPaymentId: paymentResponse.razorpay_payment_id,
                  razorpaySignature: paymentResponse.razorpay_signature,
                },
                { headers: { token } }
              );
              if (!verification.success) {
                throw new Error(verification.message || 'Payment verification failed');
              }

              setCartItems({});
              toast.success('Payment successful. Your order has been placed.');
              navigate('/orders');
            } catch (error) {
              toast.error(error.response?.data?.message || error.message || 'Payment verification failed');
            } finally {
              setIsSubmitting(false);
            }
          },
          modal: {
            ondismiss: () => setIsSubmitting(false),
          },
          theme: { color: '#000000' },
        });
        checkout.on('payment.failed', (paymentFailure) => {
          toast.error(paymentFailure.error?.description || 'Payment failed. Please try again.');
          setIsSubmitting(false);
        });
        checkout.open();
        return;
       }

        default:
        break;

      }
     } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to place order');
      setIsSubmitting(false);
     }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t' >
      {/* -------------- left Side ----------------- */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]' >

        <div className='text-xl sm:text-2xl my-3'>
            <Title  text1={'DELIVERY'} text2={'INFORMATION'}/>
        </div>
        <div className='flex gap-3' >
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='First Name'/>
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Last name'/>
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='email' placeholder='Email Address'/>
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Street'/>
        <div className='flex gap-3' >
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='City'/>
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='State'/>
        </div>
        <div className='flex gap-3' >
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='number' placeholder='Zip Code'/>
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Country'/>
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='number' placeholder='Phone'/>
      </div>



      {/* -------------- Right Side ----------------- */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        
        <div className='mt-12' >
           <Title text1={'PAYMENT'} text2={'METHOD'}  />
           {/* ----------------- Payment Method Selection ---------------- */}
           <div className='flex gap-3 flex-col lg:flex-row'> 
              <button type='button' onClick={() => setMethod('Cash On Delivery')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer' >
                <span className={`min-w-3.5 h-3.5 border rounded-full ${method === 'Cash On Delivery' ? 'bg-green-400' : '' } `} />
                <p className='text-gray-500 text-sm font-medium mx-4' >CASH ON DELIVERY</p>
              </button>
              <button type='button' onClick={() => setMethod('Razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer' >
                <span className={`min-w-3.5 h-3.5 border rounded-full ${method === 'Razorpay' ? 'bg-green-400' : '' } `} />
                <img src={assets.razorpay_logo} alt='' className='h-5 w-auto' />
                <p className='text-gray-500 text-sm font-medium' >RAZORPAY</p>
              </button>
           </div>

           <div className='w-full text-end mt-8 ' >
              <button type='submit' disabled={isSubmitting} className='bg-black text-white px-16 py-3 disabled:opacity-50'>
                {isSubmitting ? 'PROCESSING...' : method === 'Razorpay' ? 'PAY NOW' : 'PLACE ORDER'}
              </button>
           </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
