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
    const orderId = urlParams.get('ordersid');
    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }
    fetch(`/api/ordersget?id=${orderId}`).then(response => {
      if (response.status === 401) {
        setError("You are not authorized to view this order");
        setLoading(false);
        return null;
      }
      if (!response.ok) {
        throw new Error("Failed to load order details");
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
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };
  const handleContactSupport = () => {
    router.push('/contact');
  };
  const handleReorder = productId => {
    router.push(`/item_detail?productsid=${productId}`);
  };
  if (loading) {
    return <div className='w-full flex items-center justify-center p-8'>Loading order details...</div>;
  }
  if (error) {
    return <div className='w-full flex items-center justify-center p-8'><div className='text-red-600'>{error}</div></div>;
  }
  if (!order) {
    return <div className='w-full flex items-center justify-center p-8'>Order not found</div>;
  }
  const getStatusColor = status => {
    if (status === 'delivered' || status === 'completed') return 'text-green-600';
    if (status === 'shipped' || status === 'processing') return 'text-blue-600';
    if (status === 'cancelled') return 'text-red-600';
    return 'text-gray-600';
  };
  return <div className='w-full'><div className='p-4 sm:p-6 md:p-8 lg:p-10'><div className='mb-6 lg:mb-8'><h1 className='mb-2'>Order Details</h1><div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4'><div><div className='font-bold'>Order Number: {order.order_number}</div><div className='text-gray-600'>Order Date: {new Date(order.order_date).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</div></div><div className={`font-semibold ${getStatusColor(order.status)}`}>Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div></div></div><div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'><div className='lg:col-span-2'><div className='mb-6 lg:mb-8'><h2 className='mb-4'>Order Items</h2><div className='flex flex-col gap-4'>{order.items.map(item => <div key={item.id} className='flex flex-col sm:flex-row gap-4 p-4 border border-solid'>{item.product_image_url && <div className='w-full sm:w-32 h-32'><img src={`data:image/jpeg;base64,${item.product_image_url}`} alt={item.product_name} className='w-full h-full object-cover' /></div>}<div className='flex-1'><div className='font-semibold mb-2'>{item.product_name}</div><div className='flex flex-col gap-1'>{item.size && <div className='text-gray-600'>Size: {item.size}</div>}{item.color && <div className='text-gray-600'>Color: {item.color}</div>}<div className='text-gray-600'>Quantity: {item.quantity}</div><div className='font-semibold mt-2'>{formatCurrency(item.total_price)}</div></div></div><div className='flex sm:flex-col gap-2'><button onClick={() => handleReorder(item.productsid)} className='p-3'>Reorder</button></div></div>)}</div></div>{order.tracking_number && <div className='mb-6 lg:mb-8'><h2 className='mb-4'>Tracking Information</h2><div className='p-4 border border-solid'><div className='font-semibold mb-2'>Tracking Number:</div><div className='font-bold text-blue-600'>{order.tracking_number}</div></div></div>}{order.notes && <div className='mb-6 lg:mb-8'><h2 className='mb-4'>Order Notes</h2><div className='p-4 border border-solid'>{order.notes}</div></div>}</div><div className='lg:col-span-1'><div className='mb-6 lg:mb-8'><h2 className='mb-4'>Order Summary</h2><div className='p-4 border border-solid'><div className='flex justify-between mb-3'><span>Subtotal:</span><span>{formatCurrency(order.subtotal)}</span></div><div className='flex justify-between mb-3'><span>Tax:</span><span>{formatCurrency(order.tax)}</span></div><div className='flex justify-between mb-4'><span>Shipping:</span><span>{formatCurrency(order.shipping_cost)}</span></div><div className='flex justify-between font-bold border-t border-solid pt-4'><span>Total:</span><span>{formatCurrency(order.total)}</span></div></div></div><div className='mb-6 lg:mb-8'><h2 className='mb-4'>Shipping Address</h2><div className='p-4 border border-solid'><div className='mb-1'>{order.shipping_name}</div><div className='mb-1'>{order.shipping_address_line1}</div>{order.shipping_address_line2 && <div className='mb-1'>{order.shipping_address_line2}</div>}<div className='mb-1'>{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</div><div>{order.shipping_country}</div></div></div><div className='mb-6 lg:mb-8'><h2 className='mb-4'>Payment Information</h2><div className='p-4 border border-solid'>{order.payment_method && <div className='mb-2'><span className='font-semibold'>Payment Method: </span>{order.payment_method}</div>}<div className='mb-2'><span className='font-semibold'>Payment Status: </span><span className={order.payment_status === 'paid' ? 'text-green-600' : 'text-gray-600'}>{order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}</span></div>{order.transaction_id && <div><span className='font-semibold'>Transaction ID: </span>{order.transaction_id}</div>}</div></div><div className='flex flex-col gap-3'><button onClick={handleContactSupport} className='p-3 w-full'>Contact Support</button></div></div></div></div></div>;
}