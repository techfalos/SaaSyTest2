'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const CartManagementView = function ShoppingCartComponent() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [dressDetails, setDressDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showPromoMessage, setShowPromoMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  useEffect(() => {
    loadCartItems();
  }, []);
  const loadCartItems = async () => {
    try {
      const cartData = typeof localStorage === 'undefined' ? '' : localStorage.getItem('cart');
      const items = cartData ? JSON.parse(cartData) : [];
      setCartItems(items);
      const dressDetailsMap = {};
      for (const item of items) {
        try {
          const response = await fetch(`/api/dressesget?id=${item.dressesid}`);
          if (response.ok) {
            const dress = await response.json();
            dressDetailsMap[item.dressesid] = dress;
          }
        } catch (error) {
          console.error('Error fetching dress details:', error);
        }
      }
      setDressDetails(dressDetailsMap);
      setLoading(false);
    } catch (error) {
      console.error('Error loading cart:', error);
      setLoading(false);
    }
  };
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(cartItemId);
      return;
    }
    const updatedItems = cartItems.map(item => item.id === cartItemId ? {
      ...item,
      quantity: newQuantity
    } : item);
    setCartItems(updatedItems);
    if (typeof localStorage !== 'undefined') localStorage.setItem('cart', JSON.stringify(updatedItems));
  };
  const removeItem = cartItemId => {
    const updatedItems = cartItems.filter(item => item.id !== cartItemId);
    setCartItems(updatedItems);
    if (typeof localStorage !== 'undefined') localStorage.setItem('cart', JSON.stringify(updatedItems));
    setModalMessage("Item removed from cart");
    setShowModal(true);
  };
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setPromoDiscount(0.10);
      setModalMessage("Promo code applied! 20% discount");
    } else if (promoCode.toLowerCase() === 'welcome20') {
      setPromoDiscount(0.20);
      setModalMessage("Promo code applied! 20% discount");
    } else {
      setModalMessage("Invalid promo code");
    }
    setShowModal(true);
  };
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const dress = dressDetails[item.dressesid];
      if (dress) {
        return total + dress.price * item.quantity;
      }
      return total;
    }, 0);
  };
  const subtotal = calculateSubtotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const discountAmount = subtotal * promoDiscount;
  const taxAmount = (subtotal - discountAmount + shipping) * 0.08;
  const total = subtotal - discountAmount + shipping + taxAmount;
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      setModalMessage("Your cart is empty");
      setShowModal(true);
      return;
    }
    router.push('/checkout');
  };
  const closeModal = () => {
    setShowModal(false);
  };
  if (loading) {
    return <div className='w-full flex justify-center items-center p-8'>Loading featured dresses...</div>;
  }
  return <div className='w-full'><div className='max-w-6xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12'><h1 className='text-2xl lg:text-3xl mb-8'>Shopping Cart</h1>{cartItems.length === 0 ? <div className='text-center p-8'><p className='m-4'>Your cart is empty</p><button onClick={() => router.push('/dress_collection')} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-4'>Continue Shopping</button></div> : <div className='flex flex-col lg:flex-row gap-8'><div className='flex-1'><div className='space-y-6'>{cartItems.map(item => {
              const dress = dressDetails[item.dressesid];
              if (!dress) return null;
              const itemTotal = dress.price * item.quantity;
              return <div key={item.id} className='border border-gray-300 p-4 sm:p-6'><div className='flex flex-col md:flex-row gap-4'>{dress.images && dress.images.length > 0 && <img src={`${dress.images[0].image_url}`} alt={dress.images[0].alt_text || dress.name} className='w-full md:w-32 h-auto max-h-full object-cover' />}<div className='flex-1'><h3 className='font-semibold text-lg m-2'>{dress.name}</h3><p className='text-gray-600 m-2'>{`${"Size"}: ${item.size}`}</p><p className='text-gray-600 m-2'>{`${"Color"}: ${item.color}`}</p><p className='font-bold text-lg text-blue-600 m-2'>{new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(dress.price)}</p></div><div className='flex flex-col items-end gap-3'><div className='flex items-center gap-2'><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className='border !text-gray-800 border-gray-300 !bg-transparent p-2'>-</button><span className='px-3 py-1 border border-gray-300 min-w-12 text-center'>{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className='border !text-gray-800 border-gray-300 !bg-transparent p-2'>+</button></div><p className='font-bold text-lg'>{new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(itemTotal)}</p><button onClick={() => removeItem(item.id)} className='!bg-red-700 !text-white p-3'>Remove</button></div></div></div>;
            })}</div></div><div className='w-full lg:w-96'><div className='border border-gray-300 p-6 sticky top-4'><h2 className='text-xl font-semibold m-4'>Order Summary</h2><div className='border-b border-gray-200 pb-4 mb-4'><h3 className='font-medium m-2'>Promo Code</h3><div className='flex gap-2 m-2'><input type='text' value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder='Enter code' className='flex-1 p-2 border border-gray-300' /><button onClick={applyPromoCode} className='border !text-gray-800 border-gray-300 !bg-transparent p-2'>Apply</button></div></div><div className='space-y-3 mb-6'><div className='flex justify-between m-2'><span>Subtotal</span><span>{new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(subtotal)}</span></div>{promoDiscount > 0 && <div className='flex justify-between m-2 text-green-600'><span>Discount</span><span>{`-${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(discountAmount)}`}</span></div>}<div className='flex justify-between m-2'><span>Shipping</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? "Free" : new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(shipping)}</span></div><div className='flex justify-between m-2'><span>Tax</span><span>{new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(taxAmount)}</span></div><div className='flex justify-between font-bold text-lg border-t border-gray-200 pt-3 m-2'><span>Total</span><span className='text-blue-600'>{new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(total)}</span></div></div><button onClick={proceedToCheckout} className='w-full !bg-blue-600 !text-white p-4 text-lg font-semibold m-2'>Proceed to Checkout</button><p className='text-sm text-gray-600 text-center m-2'>{subtotal < 100 ? "Free shipping on orders over $100" : "Free shipping applied!"}</p></div></div></div>}</div>{showModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' onClick={closeModal}><div className='bg-white p-6 max-w-md w-full m-4' onClick={e => e.stopPropagation()}><p className='m-4 text-center'>{modalMessage}</p><div className='flex justify-center'><button onClick={closeModal} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Close</button></div></div></div>}</div>;
};
CartManagementView.displayName = 'CartManagementView';
export default CartManagementView;