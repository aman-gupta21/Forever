import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Orders = () => {

  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([])

  const loadOrderData = useCallback(async () => {
    if (!token) {
      setOrderData([]);
      return;
    }

    try {
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, {headers: {token}})
      if(response.data.success){
        setOrderData([...response.data.orders].reverse());
      } else {
        toast.error(response.data.message || 'Unable to load your orders');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to load your orders');
    }
  }, [backendUrl, token]);

  useEffect(() => {
      loadOrderData()
  },[loadOrderData])


  return (
    <div className='border-t pt-16'>
       <div className='text-2xl'>
         <Title text1={'MY'} text2={'ORDERS'} />
       </div>

       <div>
         {
          orderData.map((order) => (
            <div key={order._id} className='py-5 border-t border-b text-gray-700'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4'>
                <div>
                  <p className='font-medium'>Order placed {new Date(order.date).toLocaleDateString()}</p>
                  <p className='text-sm text-gray-500'>Order #{order._id}</p>
                </div>
                <Link to={`/track-order/${order._id}`} className='self-start border px-4 py-2 text-sm font-medium rounded-sm hover:bg-black hover:text-white'>
                  Track Order
                </Link>
              </div>
              <div className='flex flex-col gap-4'>
                {order.items.map((item, index) => (
                  <div key={`${order._id}-${item._id || item.name}-${index}`} className='flex items-start gap-4 text-sm'>
                    <img className='w-16 sm:w-20 object-cover' src={item.image?.[0]} alt={item.name} />
                    <div>
                      <p className='sm:text-base font-medium'>{item.name}</p>
                      <div className='flex flex-wrap items-center gap-x-3 mt-1 text-gray-600'>
                        <p>{currency}{item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Size: {item.size}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className='mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500'>
                <p>Status: <span className='text-gray-800'>{order.status}</span></p>
                <p>Payment: {order.paymentMethod}</p>
                <p>Total: {currency}{order.amount}</p>
              </div>
            </div>
          ))
         }
         {orderData.length === 0 && (
          <p className='py-10 text-center text-gray-500'>
            {token ? 'You have no orders yet.' : 'Log in to see and track your orders.'}
          </p>
         )}
       </div>
    </div>
  )
}

export default Orders
