import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';

const orderStages = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered'];

const TrackOrder = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Unable to load order details');
      }

      const matchingOrder = response.data.orders.find((item) => item._id === orderId);
      setOrder(matchingOrder || null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to load order details');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, orderId, token]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  if (!token) {
    return (
      <section className='border-t pt-16 pb-20 max-w-3xl mx-auto text-center'>
        <Title text1='TRACK' text2='ORDER' />
        <p className='mt-6 text-gray-600'>Please log in to view your order tracking details.</p>
        <button onClick={() => navigate('/login')} className='mt-5 bg-black text-white px-6 py-3 text-sm'>
          Log in
        </button>
      </section>
    );
  }

  if (loading) {
    return (
      <section className='border-t pt-16 pb-20 max-w-3xl mx-auto'>
        <Title text1='TRACK' text2='ORDER' />
        <p className='py-12 text-center text-gray-500'>Loading order tracking...</p>
      </section>
    );
  }

  if (!order) {
    return (
      <section className='border-t pt-16 pb-20 max-w-3xl mx-auto text-center'>
        <Title text1='TRACK' text2='ORDER' />
        <p className='mt-6 text-gray-600'>We couldn’t find that order in your account.</p>
        <Link to='/orders' className='inline-block mt-5 border border-black px-6 py-3 text-sm'>
          View my orders
        </Link>
      </section>
    );
  }

  const activeStage = orderStages.indexOf(order.status);

  return (
    <section className='border-t pt-16 pb-20 max-w-4xl mx-auto'>
      <div className='text-2xl'>
        <Title text1='TRACK' text2='ORDER' />
      </div>

      <div className='mt-8 border border-gray-200 p-5 sm:p-7'>
        <div className='flex flex-col sm:flex-row sm:justify-between gap-3'>
          <div>
            <p className='font-medium text-gray-800'>Order #{order._id}</p>
            <p className='mt-1 text-sm text-gray-500'>
              Placed on {new Date(order.date).toLocaleDateString()}
            </p>
          </div>
          <div className='sm:text-right'>
            <p className='text-sm text-gray-500'>Current status</p>
            <p className='mt-1 font-medium text-gray-800'>{order.status}</p>
          </div>
        </div>

        <ol className='mt-10 grid grid-cols-5'>
          {orderStages.map((stage, index) => {
            const isComplete = activeStage >= index;
            return (
              <li key={stage} className='relative flex flex-col items-center text-center'>
                {index > 0 && (
                  <span
                    aria-hidden='true'
                    className={`absolute right-1/2 top-3 h-0.5 w-full ${activeStage >= index ? 'bg-black' : 'bg-gray-200'}`}
                  />
                )}
                <span className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border text-xs ${isComplete ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
                  {isComplete ? '✓' : index + 1}
                </span>
                <span className={`mt-3 px-1 text-[10px] sm:text-xs ${isComplete ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                  {stage}
                </span>
              </li>
            );
          })}
        </ol>

        {!orderStages.includes(order.status) && (
          <p className='mt-6 text-sm text-gray-600'>
            The latest status from the store is <span className='font-medium'>{order.status}</span>.
          </p>
        )}
      </div>

      <div className='mt-6 border border-gray-200 p-5 sm:p-7'>
        <h2 className='font-medium text-gray-800'>Items in this order</h2>
        <div className='mt-4 divide-y divide-gray-100'>
          {order.items.map((item, index) => (
            <div key={`${item._id || item.name}-${index}`} className='flex items-center gap-4 py-4 first:pt-0 last:pb-0'>
              <img src={item.image?.[0]} alt={item.name} className='h-16 w-14 object-cover bg-gray-50' />
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium text-gray-800'>{item.name}</p>
                <p className='mt-1 text-sm text-gray-500'>Size: {item.size} · Quantity: {item.quantity}</p>
              </div>
              <p className='text-sm text-gray-700'>{currency}{item.price}</p>
            </div>
          ))}
        </div>
        <div className='mt-5 border-t pt-4 flex flex-wrap justify-between gap-2 text-sm'>
          <span className='text-gray-500'>Payment method: {order.paymentMethod}</span>
          <span className='font-medium'>Order total: {currency}{order.amount}</span>
        </div>
      </div>

      <Link to='/orders' className='inline-block mt-6 text-sm underline underline-offset-4'>
        Back to my orders
      </Link>
    </section>
  );
};

export default TrackOrder;
