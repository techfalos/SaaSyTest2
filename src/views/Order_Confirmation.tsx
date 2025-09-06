'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const OrderConfirmationView = function OrderConfirmation() {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const ordersid = urlParams.get('ordersid');
    if (ordersid) {
      fetchOrder(ordersid);
    }
  }, []);
  const fetchOrder = async ordersid => {
    try {
      const response = await fetch(`/api/ordersget?id=${ordersid}`);
      if (response.status === 401) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  const handleViewOrderHistory = () => {
    router.push('/order_history');
  };
  const handleTrackOrder = () => {
    if (order?.tracking_number) {
      router.push(`/order_details?ordersid=${order.id}`);
    }
  };
  const handleContactSupport = () => {
    router.push('/contact_us');
  };
  if (loading) {
    return <div className='w-full flex items-center justify-center p-8'>Loading your order confirmation...</div>;
  }
  if (unauthorized) {
    return <div className='w-full flex items-center justify-center p-8'>Please log in to view featured dresses</div>;
  }
  if (!order) {
    return <div className='w-full flex items-center justify-center p-8'>Order not found.</div>;
  }
  return <div className='w-full p-4 sm:p-6 md:p-8 lg:p-12'><div className='max-w-4xl mx-auto'><div className='text-center m-5'><div className='w-16 h-16 mx-auto m-5 flex items-center justify-center border-2 border-green-500 bg-green-100'><svg className='w-8 h-8 text-green-600' fill='currentColor' viewBox='0 0 24 24'><path d='M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z' /></svg></div><h1 className='m-3'>Order Confirmed!</h1><p className='m-3 text-green-600 font-semibold'>Thank you for your purchase!</p></div><div className='bg-gray-50 p-6 m-5'><div className='flex flex-col md:flex-row justify-between items-start md:items-center'><div><p className='m-2 font-bold'>Order Number: <span className='text-blue-600'>{order.order_number}</span></p><p className='m-2'>Order Date: {new Date(order.created_at).toLocaleDateString()}</p><p className='m-2'>Payment Status: <span className={order.payment_status === 'completed' ? 'text-green-600 font-semibold' : 'text-orange-600 font-semibold'}>{order.payment_status}</span></p></div><div className='mt-4 md:mt-0'><p className='m-2 font-bold text-lg'>Total<span className='text-blue-600'>{formatCurrency(order.total_amount, order.currency)}</span></p></div></div></div><div className='m-5'><h2 className='m-3'>Order Items</h2><div className='border border-gray-200'>{order.order_items.map(item => <div key={item.id} className='p-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between'><div className='flex items-center flex-1'>{item.dress_image && <img src={`${item.dress_image}`} alt={item.dress_name || 'Dress'} className='w-16 h-16 object-cover m-3' />}<div className='m-3'><p className='font-semibold m-1'>{item.dress_name || "Dress"}</p><p className='m-1'>Size{item.size}</p><p className='m-1'>Color{item.color}</p><p className='m-1'>Quantity{item.quantity}</p></div></div><div className='text-right m-3'><p className='font-semibold'>{formatCurrency(item.line_total, order.currency)}</p></div></div>)}</div></div><div className='m-5'><div className='bg-gray-50 p-6'><h3 className='m-3'>Order Summary</h3><div className='flex justify-between m-2'><span>Subtotal</span><span>{formatCurrency(order.subtotal, order.currency)}</span></div><div className='flex justify-between m-2'><span>Shipping</span><span>{formatCurrency(order.shipping_amount, order.currency)}</span></div><div className='flex justify-between m-2'><span>Tax</span><span>{formatCurrency(order.tax_amount, order.currency)}</span></div><div className='border-t border-gray-300 pt-2 mt-3'><div className='flex justify-between font-bold text-lg'><span>Total:</span><span className='text-blue-600'>{formatCurrency(order.total_amount, order.currency)}</span></div></div></div></div><div className='flex flex-col lg:flex-row gap-6 m-5'><div className='flex-1'><h3 className='m-3'>Shipping Address</h3><div className='bg-gray-50 p-4 m-2'><p className='whitespace-pre-line'>{order.shipping_address}</p></div></div><div className='flex-1'><h3 className='m-3'>Delivery Information</h3><div className='bg-gray-50 p-4 m-2'><p className='m-1'>Estimated Delivery: <span className='font-semibold'>{order.delivered_at ? new Date(order.delivered_at).toLocaleDateString() : "5-7 business days"}</span></p>{order.tracking_number && <p className='m-1'>Tracking Number: <span className='font-semibold text-blue-600'>{order.tracking_number}</span></p>}<p className='m-1'>Status: <span className={order.status === 'completed' ? 'text-green-600 font-semibold' : order.status === 'processing' ? 'text-blue-600 font-semibold' : 'text-orange-600 font-semibold'}>{order.status}</span></p></div></div></div><div className='m-5'><h3 className='m-3'>What's Next?</h3><div className='bg-blue-50 p-6 m-2'><ul className='space-y-2'><li className='flex items-start'><span className='text-blue-600 mr-2'>•</span>You will receive an email confirmation shortly</li><li className='flex items-start'><span className='text-blue-600 mr-2'>•</span>Your order will be processed within 1-2 business days</li><li className='flex items-start'><span className='text-blue-600 mr-2'>•</span>You'll receive a tracking notification when your order ships</li><li className='flex items-start'><span className='text-blue-600 mr-2'>•</span>Your order should arrive within 5-7 business days</li></ul></div></div><div className='flex flex-col sm:flex-row gap-4 justify-center m-5'>{order.tracking_number && <button onClick={handleTrackOrder} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Track Your Order</button>}<button onClick={handleViewOrderHistory} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>View Order History</button><button onClick={handleContactSupport} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Contact Support</button></div><div className='m-5 text-center'><p className='m-2'>Questions about your order? <span className='text-blue-600 font-semibold'>Contact our customer service team</span></p><p className='m-2'>Email: support@example.com | Phone: 1-800-DRESSES</p></div></div></div>;
};
OrderConfirmationView.displayName = 'OrderConfirmationView';
export default OrderConfirmationView;