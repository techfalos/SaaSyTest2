'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const ordersid = urlParams.get('ordersid');
    if (!ordersid) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }
    fetch(`/api/ordersget?id=${ordersid}`).then(response => {
      if (response.status === 401) {
        setError('Unauthorized access');
        setLoading(false);
        return null;
      }
      if (!response.ok) {
        throw new Error('Failed to load order');
      }
      return response.json();
    }).then(data => {
      if (data) {
        setOrder(data);
      }
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []);
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  const handleViewOrderHistory = () => {
    router.push('/orders');
  };
  const handleContinueShopping = () => {
    router.push('/collections');
  };
  if (loading) {
    return <div className='w-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12'><p>Loading order details...</p></div>;
  }
  if (error) {
    return <div className='w-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12'><p className='text-red-600'>{error}</p></div>;
  }
  if (!order) {
    return <div className='w-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12'><p>Order not found</p></div>;
  }
  const estimatedDeliveryDate = new Date(order.order_date);
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);
  return <div className='w-full p-4 sm:p-6 md:p-8 lg:p-12'><div className='max-w-4xl m-auto'><div className='text-center m-5 sm:m-6 md:m-8 lg:m-10'><h1 className='m-5'>Thank You for Your Order!</h1><p className='m-5'>Your order has been successfully placed.</p><p className='font-bold m-5'>Order Number: {order.order_number}</p></div><div className='m-5 sm:m-6 md:m-8 lg:m-10'><h2 className='m-5'>Order Items</h2><div className='flex flex-col gap-4'>{order.items.map(item => <div key={item.id} className='flex flex-col sm:flex-row gap-4 p-4 sm:p-5 md:p-6 lg:p-7 border border-solid'>{item.product_image_url && <div className='w-full sm:w-32 h-32'><img src={`data:image/jpeg;base64,${item.product_image_url}`} alt={item.product_name} className='w-full h-full object-cover' /></div>}<div className='flex-1'><p className='font-bold m-5'>{item.product_name}</p>{item.size && <p className='m-5'>Size: {item.size}</p>}{item.color && <p className='m-5'>Color: {item.color}</p>}<p className='m-5'>Quantity: {item.quantity.toString()}</p><p className='font-bold m-5'>Price: {formatCurrency(item.total_price)}</p></div></div>)}</div></div><div className='m-5 sm:m-6 md:m-8 lg:m-10 border border-solid p-4 sm:p-5 md:p-6 lg:p-7'><h2 className='m-5'>Order Summary</h2><div className='flex flex-col gap-2'><div className='flex justify-between m-5'><span>Subtotal:</span><span>{formatCurrency(order.subtotal)}</span></div><div className='flex justify-between m-5'><span>Tax:</span><span>{formatCurrency(order.tax)}</span></div><div className='flex justify-between m-5'><span>Shipping Details</span><span>{formatCurrency(order.shipping_cost)}</span></div><div className='flex justify-between font-bold m-5 pt-4 border-t border-solid'><span>Total</span><span>{formatCurrency(order.total)}</span></div></div></div><div className='m-5 sm:m-6 md:m-8 lg:m-10'><h2 className='m-5'>Shipping Address</h2><div className='m-5'><p className='m-5'>{order.shipping_name}</p><p className='m-5'>{order.shipping_address_line1}</p>{order.shipping_address_line2 && <p className='m-5'>{order.shipping_address_line2}</p>}<p className='m-5'>{`${order.shipping_city}, ${order.shipping_state} ${order.shipping_postal_code}`}</p><p className='m-5'>{order.shipping_country}</p></div></div><div className='m-5 sm:m-6 md:m-8 lg:m-10'><h2 className='m-5'>Delivery Information</h2><p className='m-5'>Estimated Delivery{estimatedDeliveryDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>{order.tracking_number && <p className='m-5'>Tracking Number: {order.tracking_number}</p>}</div><div className='flex flex-col sm:flex-row gap-4 justify-center m-5 sm:m-6 md:m-8 lg:m-10'><button onClick={handleViewOrderHistory} className='p-3'>View Order History</button><button onClick={handleContinueShopping} className='p-3'>Continue Shopping</button></div></div></div>;
}