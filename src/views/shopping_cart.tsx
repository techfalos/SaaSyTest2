'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  useEffect(() => {
    const storedCart = typeof localStorage === 'undefined' ? '' : localStorage.getItem('shoppingcart');
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        setCartItems(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setCartItems([]);
      }
    }
  }, []);
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedItems = cartItems.map(item => item.id === itemId ? {
      ...item,
      quantity: newQuantity
    } : item);
    setCartItems(updatedItems);
    if (typeof localStorage !== 'undefined') localStorage.setItem('shoppingcart', JSON.stringify(updatedItems));
  };
  const confirmRemove = itemId => {
    setItemToRemove(itemId);
    setShowRemoveModal(true);
  };
  const removeItem = () => {
    const updatedItems = cartItems.filter(item => item.id !== itemToRemove);
    setCartItems(updatedItems);
    if (typeof localStorage !== 'undefined') localStorage.setItem('shoppingcart', JSON.stringify(updatedItems));
    setShowRemoveModal(false);
    setItemToRemove(null);
  };
  const handleContinueShopping = () => {
    router.push('/collections');
  };
  const handleCheckout = () => {
    router.push('/checkout');
  };
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const shipping = subtotal > 0 ? 10.00 : 0;
  const total = subtotal + shipping;
  if (cartItems.length === 0) {
    return <div className='w-full flex flex-col items-center justify-center p-8'><h1 className='mb-6'>Your Cart is Empty</h1><p className='mb-6'>Browse our collections to find the perfect Victorian dress</p><button onClick={handleContinueShopping} className='p-3'>Browse Collections</button></div>;
  }
  return <div className='w-full p-4 lg:p-8'><h1 className='mb-6'>Shopping Cart</h1><div className='flex flex-col lg:flex-row gap-8'><div className='flex-1'>{cartItems.map(item => <div key={item.id} className='flex flex-col sm:flex-row gap-4 p-4 mb-4 border border-solid'>{item.image ? <div className='w-full sm:w-24 h-24'><img src={`data:image/jpeg;base64,${item.image}`} alt='Product image' className='w-full h-full object-cover' /></div> : null}<div className='flex-1'><h2 className='mb-2'>{item.name || "Product"}</h2>{item.size ? <p className='m-2'>{`${"Size"}: ${item.size}`}</p> : null}{item.color ? <p className='m-2'>{`${"Color"}: ${item.color}`}</p> : null}<div className='flex items-center gap-2 m-5'><span className='mr-2'>Quantity</span><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className='p-2'>-</button><span className='p-2'>{item.quantity.toString()}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className='p-2'>+</button></div><button onClick={() => confirmRemove(item.id)} className='p-3 m-5'>Remove</button></div><div className='text-right'><p className='font-bold'>{formatCurrency((item.price || 0) * item.quantity)}</p></div></div>)}</div><div className='w-full lg:w-1/3'><div className='border border-solid p-6'><h2 className='mb-4'>Order Summary</h2><div className='flex justify-between m-5'><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div><div className='flex justify-between m-5'><span>Estimated Shipping</span><span>{formatCurrency(shipping)}</span></div><div className='flex justify-between m-5 font-bold'><span>Total</span><span>{formatCurrency(total)}</span></div><button onClick={handleCheckout} className='w-full p-3 m-5'>Proceed to Checkout</button><button onClick={handleContinueShopping} className='w-full p-3 m-5'>Continue Shopping</button></div></div></div>{showRemoveModal ? <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-50' onClick={() => setShowRemoveModal(false)} /><div className='relative bg-white p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto text-gray-900'><button onClick={() => setShowRemoveModal(false)} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold'>×</button><h2 className='mb-4'>Remove Item</h2><p className='mb-6'>Are you sure you want to remove this item from your cart?</p><div className='flex gap-4'><button onClick={removeItem} className='p-3 flex-1'>Yes, Remove</button><button onClick={() => setShowRemoveModal(false)} className='p-3 flex-1'>Cancel</button></div></div></div> : null}</div>;
}