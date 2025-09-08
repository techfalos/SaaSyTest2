'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const OrderDetailInformationView = function () {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reorderLoading, setReorderLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const orderId = urlParams.get('ordersid');
  useEffect(() => {
    if (!orderId) {
      setError('Order ID is required');
      setLoading(false);
      return;
    }
    const fetchOrderData = async () => {
      try {
        const orderResponse = await fetch(`/api/ordersget?id=${orderId}`);
        if (orderResponse.status === 401) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }
        if (!orderResponse.ok) {
          throw new Error('Failed to fetch order details');
        }
        const orderData = await orderResponse.json();
        setOrder(orderData);
        const itemsResponse = await fetch(`/api/orderitemslist?order_id=${orderId}&page=1&limit=100`);
        if (itemsResponse.status === 401) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }
        if (!itemsResponse.ok) {
          throw new Error('Failed to fetch order items');
        }
        const itemsData = await itemsResponse.json();
        setOrderItems(itemsData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderData();
  }, [orderId]);
  const handleReorder = async () => {
    setReorderLoading(true);
    try {
      const existingCart = JSON.parse(typeof localStorage === 'undefined' ? '' : localStorage.getItem('cart') || '[]');
      orderItems.forEach(item => {
        const cartItem = {
          id: crypto.randomUUID(),
          dressesid: item.dressesid,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          added_at: new Date().toISOString()
        };
        existingCart.push(cartItem);
      });
      if (typeof localStorage !== 'undefined') localStorage.setItem('cart', JSON.stringify(existingCart));
      setShowSuccessModal(true);
    } catch (err) {
      setError('Failed to add items to cart');
    } finally {
      setReorderLoading(false);
    }
  };
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  const closeModal = () => {
    setShowSuccessModal(false);
  };
  const goToCart = () => {
    router.push('/shopping_cart');
  };
  if (loading) {
    return <div className='w-full p-6'>Loading featured dresses...</div>;
  }
  if (error) {
    return <div className='w-full p-6'><div className='text-red-600 font-semibold'>{"Error: " + error}</div></div>;
  }
  if (unauthorized) {
    return <div className='w-full p-6'><div className='text-center'><h2 className='m-4'>Access Required</h2><p className='m-4'>Please log in to view dresses.</p></div></div>;
  }
  if (!order) {
    return <div className='w-full p-6'>Order not found</div>;
  }
  return <div className='w-full'><div className='p-4 lg:p-8'><div className='m-6'><h1>Order Details</h1><p className='m-2 text-lg font-semibold'>{"Order Number: " + order.order_number}</p><p className='m-2'>{"Order Date: " + new Date(order.created_at).toLocaleDateString()}</p></div><div className='flex flex-col lg:flex-row justify-between items-start lg:items-center m-6 p-4 border border-gray-300'><div><p className='m-2'><span className='font-semibold'>Status</span><span className={order.status === 'delivered' ? 'text-green-600 font-semibold' : order.status === 'shipped' ? 'text-blue-600 font-semibold' : order.status === 'cancelled' ? 'text-red-600 font-semibold' : 'text-orange-600 font-semibold'}>{order.status}</span></p><p className='m-2'><span className='font-semibold'>Payment Status: </span><span className={order.payment_status === 'paid' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{order.payment_status}</span></p></div><div className='flex flex-col sm:flex-row'><button className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-2' onClick={handleReorder} disabled={reorderLoading}>{reorderLoading ? "Adding..." : "Reorder"}</button>{order.tracking_number && <button className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-2'>Track Order</button>}</div></div><div className='m-6'><h2>Order Items</h2><div className='border border-gray-300 m-4'>{orderItems.map(item => <div key={item.id} className='flex flex-col lg:flex-row p-4 border-b border-gray-200'>{item.dress_image && <div className='m-2'><img src={`${item.dress_image}`} className='w-full max-w-full h-auto max-h-full' style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover'
              }} /></div>}<div className='flex-1 m-2'><h3>{item.dress_name || "Dress"}</h3><p className='m-1'>{"Size" + item.size}</p><p className='m-1'>{"Color" + item.color}</p><p className='m-1'>{"Quantity" + item.quantity}</p></div><div className='m-2 text-right'><p className='font-semibold text-lg'>{formatCurrency(item.line_total)}</p><p className='text-sm'>{formatCurrency(item.price_at_time) + " each"}</p></div></div>)}</div></div><div className='flex flex-col lg:flex-row m-6'><div className='flex-1 lg:w-1/2 m-4'><h2>Shipping Address</h2><div className='border border-gray-300 p-4 m-2'><pre className='whitespace-pre-wrap'>{order.shipping_address}</pre></div>{order.billing_address && <div><h2 className='m-4 mt-6'>Billing Address</h2><div className='border border-gray-300 p-4 m-2'><pre className='whitespace-pre-wrap'>{order.billing_address}</pre></div></div>}</div><div className='flex-1 lg:w-1/2 m-4'><h2>Order Summary</h2><div className='border border-gray-300 p-4 m-2'><div className='flex justify-between p-2'><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div><div className='flex justify-between p-2'><span>Tax</span><span>{formatCurrency(order.tax_amount)}</span></div><div className='flex justify-between p-2'><span>Shipping</span><span>{formatCurrency(order.shipping_amount)}</span></div><hr className='m-2' /><div className='flex justify-between p-2 font-bold text-lg'><span>Total</span><span>{formatCurrency(order.total_amount)}</span></div>{order.payment_method && <div className='p-2 mt-4 border-t border-gray-200'><p><span className='font-semibold'>Payment Method: </span>{order.payment_method}</p></div>}</div></div></div>{order.tracking_number && <div className='m-6'><h2>Tracking Information</h2><div className='border border-gray-300 p-4 m-4'><p className='m-2'><span className='font-semibold'>Tracking Number: </span>{order.tracking_number}</p>{order.shipped_at && <p className='m-2'><span className='font-semibold'>Shipped: </span>{new Date(order.shipped_at).toLocaleDateString()}</p>}{order.delivered_at && <p className='m-2'><span className='font-semibold'>Delivered: </span>{new Date(order.delivered_at).toLocaleDateString()}</p>}</div></div>}<div className='m-6'><h2>Need Help?</h2><div className='border border-gray-300 p-4 m-4'><p className='m-2'>If you have questions about your order, please contact our customer support team.</p><button className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-2' onClick={() => router.push('/contact_us')}>Contact Support</button></div></div>{order.notes && <div className='m-6'><h2>Order Notes</h2><div className='border border-gray-300 p-4 m-4'><p>{order.notes}</p></div></div>}</div>{showSuccessModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 max-w-md w-full mx-4'><h2 className='m-4'>Items Added to Cart</h2><p className='m-4'>All items from this order have been added to your cart.</p><div className='flex flex-col sm:flex-row justify-end'><button className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-2' onClick={closeModal}>Continue Shopping</button><button className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-2' onClick={goToCart}>View Cart</button></div></div></div>}</div>;
};
OrderDetailInformationView.displayName = 'OrderDetailInformationView';
export default OrderDetailInformationView;