'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [newAddress, setNewAddress] = useState({
    shipping_name: '',
    shipping_address_line1: '',
    shipping_address_line2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: 'United Kingdom'
  });
  useEffect(() => {
    const loadData = async () => {
      try {
        const cartData = typeof localStorage === 'undefined' ? '' : localStorage.getItem('shoppingcart');
        const cart = cartData ? JSON.parse(cartData) : [];
        setCartItems(cart);
        const response = await fetch('/api/shippingaddresseslist');
        if (response.ok) {
          const data = await response.json();
          setSavedAddresses(data.data || []);
          const defaultAddr = data.data?.find(addr => addr.is_default);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
          }
        }
      } catch (err) {
        setModalMessage(err.message);
        setShowModal(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const shippingCost = shippingMethod === 'express' ? 15.00 : 5.00;
  const tax = subtotal * 0.20;
  const total = subtotal + shippingCost + tax;
  const handleAddressChange = (field, value) => {
    setNewAddress({
      ...newAddress,
      [field]: value
    });
  };
  const handlePlaceOrder = async () => {
    let selectedAddress = null;
    if (selectedAddressId) {
      selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);
    }
    if (!selectedAddressId && (!newAddress.shipping_name || !newAddress.shipping_address_line1 || !newAddress.shipping_city || !newAddress.shipping_state || !newAddress.shipping_postal_code)) {
      setModalMessage("Please provide a complete shipping address");
      setShowModal(true);
      return;
    }
    if (cartItems.length === 0) {
      setModalMessage("Your cart is empty");
      setShowModal(true);
      return;
    }
    try {
      setIsLoading(true);
      const orderData = {
        items: cartItems.map(item => ({
          productsid: item.productsid,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        })),
        shipping_name: selectedAddress ? selectedAddress.recipient_name : newAddress.shipping_name,
        shipping_address_line1: selectedAddress ? selectedAddress.address_line1 : newAddress.shipping_address_line1,
        shipping_address_line2: selectedAddress ? selectedAddress.address_line2 : newAddress.shipping_address_line2,
        shipping_city: selectedAddress ? selectedAddress.city : newAddress.shipping_city,
        shipping_state: selectedAddress ? selectedAddress.state : newAddress.shipping_state,
        shipping_postal_code: selectedAddress ? selectedAddress.postal_code : newAddress.shipping_postal_code,
        shipping_country: selectedAddress ? selectedAddress.country : newAddress.shipping_country,
        subtotal: subtotal,
        tax: tax,
        shipping_cost: shippingCost,
        total: total,
        payment_method: 'stripe'
      };
      const response = await fetch('/api/orderscreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      if (response.status === 401) {
        setModalMessage("Please log in to complete your order");
        setShowModal(true);
        setIsLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error('Order creation failed');
      }
      const order = await response.json();
      if (typeof localStorage !== 'undefined') localStorage.setItem('shoppingcart', JSON.stringify([]));
      router.push(`/payment?ordersid=${order.id}`);
    } catch (err) {
      setModalMessage("Failed to place order. Please try again.");
      setShowModal(true);
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <div className='w-full flex items-center justify-center p-8'>Loading checkout...</div>;
  }
  if (cartItems.length === 0) {
    return <div className='w-full p-8 text-center'><p className='m-5'>Your cart is empty</p></div>;
  }
  return <div className='w-full p-4 sm:p-6 md:p-6 lg:p-8'>{showModal && <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-50' onClick={() => setShowModal(false)} /><div className='relative bg-white p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto text-gray-900'><button onClick={() => setShowModal(false)} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold'>×</button><p className='m-5'>{modalMessage}</p></div></div>}<div className='mb-8 flex items-center justify-center gap-4'><div className='flex items-center gap-2'><div className='w-8 h-8 flex items-center justify-center border-2'>{currentStep === 1 ? '1' : '✓'}</div><span>Shipping Details</span></div><div className='w-16 h-0.5 border-t' /><div className='flex items-center gap-2'><div className='w-8 h-8 flex items-center justify-center border-2'>2</div><span>Review</span></div></div>{currentStep === 1 && <div className='flex flex-col lg:flex-row gap-8'><div className='flex-1'><h1 className='mb-6'>Shipping Address</h1>{savedAddresses.length > 0 && <div className='mb-6'><label className='m-5'>Saved Addresses</label>{savedAddresses.map(addr => <button key={addr.id} onClick={() => setSelectedAddressId(addr.id)} className='w-full p-3 m-2 border-2 text-left'>{`${addr.recipient_name}, ${addr.address_line1}, ${addr.city}`}</button>)}<button onClick={() => setSelectedAddressId(null)} className='p-3 m-5'>New Address</button></div>}{(!selectedAddressId || savedAddresses.length === 0) && <div><input type='text' placeholder='Full Name' value={newAddress.shipping_name} onChange={e => handleAddressChange('shipping_name', e.target.value)} className='w-full p-3 m-5 border' /><input type='text' placeholder='Address Line 1' value={newAddress.shipping_address_line1} onChange={e => handleAddressChange('shipping_address_line1', e.target.value)} className='w-full p-3 m-5 border' /><input type='text' placeholder='Address Line 2' value={newAddress.shipping_address_line2} onChange={e => handleAddressChange('shipping_address_line2', e.target.value)} className='w-full p-3 m-5 border' /><input type='text' placeholder='City' value={newAddress.shipping_city} onChange={e => handleAddressChange('shipping_city', e.target.value)} className='w-full p-3 m-5 border' /><input type='text' placeholder='County' value={newAddress.shipping_state} onChange={e => handleAddressChange('shipping_state', e.target.value)} className='w-full p-3 m-5 border' /><input type='text' placeholder='Postal Code' value={newAddress.shipping_postal_code} onChange={e => handleAddressChange('shipping_postal_code', e.target.value)} className='w-full p-3 m-5 border' /><input type='text' placeholder='Country' value={newAddress.shipping_country} onChange={e => handleAddressChange('shipping_country', e.target.value)} className='w-full p-3 m-5 border' /></div>}<div className='mt-8'><h2 className='mb-4'>Shipping Method</h2><button onClick={() => setShippingMethod('standard')} className={`w-full p-3 m-2 border-2 text-left ${shippingMethod === 'standard' ? 'border-solid' : 'border-dashed'}`}>Standard Shipping - £5.00</button><button onClick={() => setShippingMethod('express')} className={`w-full p-3 m-2 border-2 text-left ${shippingMethod === 'express' ? 'border-solid' : 'border-dashed'}`}>Express Shipping - £15.00</button></div><button onClick={() => setCurrentStep(2)} className='p-3 mt-8'>Continue to Review</button></div><div className='w-full lg:w-1/3'><h2 className='mb-4'>Order Summary</h2><div className='border p-4 sm:p-5 md:p-5 lg:p-6'>{cartItems.map(item => <div key={item.id} className='flex justify-between mb-2'><span>{`${item.name || 'Item'} x ${item.quantity}`}</span><span>{new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: 'GBP'
              }).format((item.price || 0) * item.quantity)}</span></div>)}<div className='border-t mt-4 pt-4'><div className='flex justify-between mb-2'><span>Subtotal</span><span>{new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: 'GBP'
                }).format(subtotal)}</span></div><div className='flex justify-between mb-2'><span>Shipping</span><span>{new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: 'GBP'
                }).format(shippingCost)}</span></div><div className='flex justify-between mb-2'><span>Tax</span><span>{new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: 'GBP'
                }).format(tax)}</span></div><div className='flex justify-between font-bold mt-4 pt-4 border-t'><span>Total</span><span className='text-green-600'>{new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: 'GBP'
                }).format(total)}</span></div></div></div></div></div>}{currentStep === 2 && <div><div className='mb-8 flex justify-between items-center'><h1>Review Your Order</h1><button onClick={() => setCurrentStep(1)} className='p-3'>Back</button></div><div className='grid grid-cols-1 lg:grid-cols-2 gap-8'><div><h2 className='mb-4'>Shipping Information</h2><div className='border p-4 sm:p-5 md:p-5 lg:p-6'>{selectedAddressId && savedAddresses.find(a => a.id === selectedAddressId) ? (() => {
              const addr = savedAddresses.find(a => a.id === selectedAddressId);
              return <div><p className='mb-2'>{addr.recipient_name}</p><p className='mb-2'>{addr.address_line1}</p>{addr.address_line2 && <p className='mb-2'>{addr.address_line2}</p>}<p className='mb-2'>{`${addr.city}, ${addr.state} ${addr.postal_code}`}</p><p>{addr.country}</p></div>;
            })() : <div><p className='mb-2'>{newAddress.shipping_name}</p><p className='mb-2'>{newAddress.shipping_address_line1}</p>{newAddress.shipping_address_line2 && <p className='mb-2'>{newAddress.shipping_address_line2}</p>}<p className='mb-2'>{`${newAddress.shipping_city}, ${newAddress.shipping_state} ${newAddress.shipping_postal_code}`}</p><p>{newAddress.shipping_country}</p></div>}</div><div className='mt-6'><h3 className='mb-2'>Shipping Method</h3><p>{shippingMethod === 'express' ? "Express Shipping - £15.00" : "Standard Shipping - £5.00"}</p></div></div><div><h2 className='mb-4'>Order Items</h2>{cartItems.map(item => <div key={item.id} className='border p-4 sm:p-5 md:p-5 lg:p-6 mb-4'><div className='flex justify-between'><div><p className='font-semibold mb-2'>{item.name || 'Product'}</p>{item.size && <p className='mb-1'>{`${"Size"}: ${item.size}`}</p>}{item.color && <p className='mb-1'>{`${"Color"}: ${item.color}`}</p>}<p>{`${"Quantity"}: ${item.quantity}`}</p></div><span className='font-semibold'>{new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: 'GBP'
                }).format((item.price || 0) * item.quantity)}</span></div></div>)}<div className='border-t pt-4 mt-4'><div className='flex justify-between mb-2'><span>Subtotal</span><span>{new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: 'GBP'
                }).format(subtotal)}</span></div><div className='flex justify-between mb-2'><span>Shipping</span><span>{new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: 'GBP'
                }).format(shippingCost)}</span></div><div className='flex justify-between mb-2'><span>Tax (VAT)</span><span>{new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: 'GBP'
                }).format(tax)}</span></div><div className='flex justify-between font-bold mt-4 pt-4 border-t'><span>Total</span><span className='text-green-600'>{new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: 'GBP'
                }).format(total)}</span></div></div></div></div><div className='mt-8 text-center'><button onClick={handlePlaceOrder} disabled={isLoading} className='p-3 !bg-green-700 !text-white'>{isLoading ? "Processing..." : "Place Order"}</button></div></div>}</div>;
}