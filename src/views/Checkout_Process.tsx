'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const CheckoutProcessView = function CheckoutComponent() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    first_name: '',
    last_name: '',
    company: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state_province: '',
    postal_code: '',
    country: '',
    phone: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    first_name: '',
    last_name: '',
    company: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state_province: '',
    postal_code: '',
    country: '',
    phone: ''
  });
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [cartItems, setCartItems] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingAmount, setShippingAmount] = useState(10.00);
  const [taxAmount, setTaxAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  useEffect(() => {
    const cartData = typeof localStorage === 'undefined' ? '' : localStorage.getItem('cart');
    if (cartData) {
      try {
        const items = JSON.parse(cartData);
        setCartItems(Array.isArray(items) ? items : []);
      } catch (e) {
        setCartItems([]);
      }
    }
  }, []);
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const response = await fetch('/api/addresseslist?type=&page=1&limit=100');
        if (response.status === 401) {
          setIsAuthenticated(false);
          return;
        }
        if (response.ok) {
          const data = await response.json();
          setSavedAddresses(data.data || []);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    loadAddresses();
  }, []);
  useEffect(() => {
    const baseSubtotal = cartItems.length * 75.00;
    const shipping = deliveryOption === 'express' ? 25.00 : deliveryOption === 'overnight' ? 45.00 : 10.00;
    const tax = baseSubtotal * 0.08;
    setSubtotal(baseSubtotal);
    setShippingAmount(shipping);
    setTaxAmount(tax);
  }, [cartItems, deliveryOption]);
  const validateAddress = address => {
    const errors = {};
    if (!address.first_name.trim()) errors.first_name = 'First name is required';
    if (!address.last_name.trim()) errors.last_name = 'Last name is required';
    if (!address.address_line_1.trim()) errors.address_line_1 = 'Address is required';
    if (!address.city.trim()) errors.city = 'City is required';
    if (!address.state_province.trim()) errors.state_province = 'State/Province is required';
    if (!address.postal_code.trim()) errors.postal_code = 'Postal code is required';
    if (!address.country.trim()) errors.country = 'Country is required';
    return errors;
  };
  const handleNextStep = () => {
    let validationErrors = {};
    if (currentStep === 1) {
      validationErrors = validateAddress(shippingAddress);
      if (Object.keys(validationErrors).length === 0) {
        if (useSameAddress) {
          setBillingAddress({
            ...shippingAddress
          });
        }
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (!useSameAddress) {
        validationErrors = validateAddress(billingAddress);
      }
      if (Object.keys(validationErrors).length === 0) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
    setErrors(validationErrors);
  };
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      setModalMessage('Your cart is empty');
      setShowModal(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const orderData = {
        order_items: cartItems.map(item => ({
          dressesid: item.dressesid,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        })),
        shipping_address: shippingAddress,
        billing_address: useSameAddress ? shippingAddress : billingAddress,
        payment_method: 'credit_card',
        notes: ''
      };
      const response = await fetch('/api/orderscreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      if (response.status === 401) {
        setModalMessage('Authorization required. Please log in to complete your order.');
        setShowModal(true);
        return;
      }
      if (response.ok) {
        const orderResult = await response.json();
        if (typeof localStorage !== 'undefined') localStorage.setItem('cart', JSON.stringify([]));
        setCartItems([]);
        router.push(`/order_confirmation?ordersid=${orderResult.id}`);
      } else {
        setModalMessage('There was an error processing your order. Please try again.');
        setShowModal(true);
      }
    } catch (error) {
      setModalMessage('There was an error processing your order. Please try again.');
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleAddressSelect = (address, type) => {
    if (type === 'shipping') {
      setShippingAddress({
        ...address
      });
    } else {
      setBillingAddress({
        ...address
      });
    }
  };
  const renderAddressForm = (address, setAddress, type, errors) => {
    return <div className='w-full'><h3 className='text-lg font-semibold m-5'>{type === 'shipping' ? "Shipping Address" : "Billing Address"}</h3>{isAuthenticated && savedAddresses.length > 0 && <div className='w-full m-5'><p className='m-3'>Select from saved addresses:</p><div className='grid grid-cols-1 md:grid-cols-2 gap-4'>{savedAddresses.filter(addr => addr.type === type || addr.type === 'both').map(addr => <div key={addr.id} className='border border-gray-300 p-3 cursor-pointer hover:border-gray-400' onClick={() => handleAddressSelect(addr, type)}><p className='font-semibold'>{`${addr.first_name} ${addr.last_name}`}</p><p>{addr.address_line_1}</p>{addr.address_line_2 && <p>{addr.address_line_2}</p>}<p>{`${addr.city}, ${addr.state_province} ${addr.postal_code}`}</p><p>{addr.country}</p></div>)}</div></div>}<div className='grid grid-cols-1 md:grid-cols-2 gap-4'><div className='w-full'><label className='block m-2'>First Name</label><input type='text' className='w-full p-3 border border-gray-300 m-5' value={address.first_name} onChange={e => setAddress({
            ...address,
            first_name: e.target.value
          })} />{errors.first_name && <p className='text-red-600 text-sm m-2'>{errors.first_name}</p>}</div><div className='w-full'><label className='block m-2'>Last Name</label><input type='text' className='w-full p-3 border border-gray-300 m-5' value={address.last_name} onChange={e => setAddress({
            ...address,
            last_name: e.target.value
          })} />{errors.last_name && <p className='text-red-600 text-sm m-2'>{errors.last_name}</p>}</div></div><div className='w-full'><label className='block m-2'>Company (Optional)</label><input type='text' className='w-full p-3 border border-gray-300 m-5' value={address.company || ''} onChange={e => setAddress({
          ...address,
          company: e.target.value
        })} /></div><div className='w-full'><label className='block m-2'>Address Line 1</label><input type='text' className='w-full p-3 border border-gray-300 m-5' value={address.address_line_1} onChange={e => setAddress({
          ...address,
          address_line_1: e.target.value
        })} />{errors.address_line_1 && <p className='text-red-600 text-sm m-2'>{errors.address_line_1}</p>}</div><div className='w-full'><label className='block m-2'>Address Line 2 (Optional)</label><input type='text' className='w-full p-3 border border-gray-300 m-5' value={address.address_line_2 || ''} onChange={e => setAddress({
          ...address,
          address_line_2: e.target.value
        })} /></div><div className='grid grid-cols-1 md:grid-cols-3 gap-4'><div className='w-full'><label className='block m-2'>City</label><input type='text' className='w-full p-3 border border-gray-300 m-5' value={address.city} onChange={e => setAddress({
            ...address,
            city: e.target.value
          })} />{errors.city && <p className='text-red-600 text-sm m-2'>{errors.city}</p>}</div><div className='w-full'><label className='block m-2'>State/Province</label><input type='text' className='w-full p-3 border border-gray-300 m-5' value={address.state_province} onChange={e => setAddress({
            ...address,
            state_province: e.target.value
          })} />{errors.state_province && <p className='text-red-600 text-sm m-2'>{errors.state_province}</p>}</div><div className='w-full'><label className='block m-2'>Postal Code</label><input type='text' className='w-full p-3 border border-gray-300 m-5' value={address.postal_code} onChange={e => setAddress({
            ...address,
            postal_code: e.target.value
          })} />{errors.postal_code && <p className='text-red-600 text-sm m-2'>{errors.postal_code}</p>}</div></div><div className='w-full'><label className='block m-2'>Country</label><input type='text' className='w-full p-3 border border-gray-300 m-5' value={address.country} onChange={e => setAddress({
          ...address,
          country: e.target.value
        })} />{errors.country && <p className='text-red-600 text-sm m-2'>{errors.country}</p>}</div><div className='w-full'><label className='block m-2'>Phone (Optional)</label><input type='text' className='w-full p-3 border border-gray-300 m-5' value={address.phone || ''} onChange={e => setAddress({
          ...address,
          phone: e.target.value
        })} /></div></div>;
  };
  const renderStep1 = () => {
    return <div className='w-full'>{renderAddressForm(shippingAddress, setShippingAddress, 'shipping', errors)}</div>;
  };
  const renderStep2 = () => {
    return <div className='w-full'><div className='w-full m-5'><label className='flex items-center'><input type='checkbox' checked={useSameAddress} onChange={e => setUseSameAddress(e.target.checked)} className='m-3' /><span>Use same address for billing</span></label></div>{!useSameAddress && renderAddressForm(billingAddress, setBillingAddress, 'billing', errors)}</div>;
  };
  const renderStep3 = () => {
    return <div className='w-full'><h3 className='text-lg font-semibold m-5'>Delivery Options</h3><div className='w-full m-5'><div className='border border-gray-300 p-4 m-3'><label className='flex items-center cursor-pointer'><input type='radio' name='delivery' value='standard' checked={deliveryOption === 'standard'} onChange={e => setDeliveryOption(e.target.value)} className='m-3' /><div><p className='font-semibold'>Standard Shipping</p><p className='text-sm'>5-7 business days</p><p className='font-semibold text-green-600'>{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(10.00)}</p></div></label></div><div className='border border-gray-300 p-4 m-3'><label className='flex items-center cursor-pointer'><input type='radio' name='delivery' value='express' checked={deliveryOption === 'express'} onChange={e => setDeliveryOption(e.target.value)} className='m-3' /><div><p className='font-semibold'>Express Shipping</p><p className='text-sm'>2-3 business days</p><p className='font-semibold text-blue-600'>{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(25.00)}</p></div></label></div><div className='border border-gray-300 p-4 m-3'><label className='flex items-center cursor-pointer'><input type='radio' name='delivery' value='overnight' checked={deliveryOption === 'overnight'} onChange={e => setDeliveryOption(e.target.value)} className='m-3' /><div><p className='font-semibold'>Overnight Shipping</p><p className='text-sm'>Next business day</p><p className='font-semibold text-red-600'>{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(45.00)}</p></div></label></div></div></div>;
  };
  const renderStep4 = () => {
    const totalAmount = subtotal + shippingAmount + taxAmount;
    return <div className='w-full'><h3 className='text-lg font-semibold m-5'>Order Review</h3><div className='w-full m-5'><h4 className='font-semibold m-3'>Order Items</h4>{cartItems.length === 0 ? <p className='m-3'>No items in cart</p> : <div>{cartItems.map((item, index) => <div key={`${item.dressesid}-${item.size}-${item.color}-${index}`} className='border border-gray-300 p-4 m-3 flex justify-between items-center'><div><p className='font-semibold'>Dress</p><p className='text-sm'>{`Size: ${item.size}, Color: ${item.color}`}</p><p className='text-sm'>{`Quantity: ${item.quantity}`}</p></div><p className='font-semibold text-green-600'>{new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(75.00 * item.quantity)}</p></div>)}</div>}</div><div className='w-full m-5 border border-gray-300 p-4'><h4 className='font-semibold m-3'>Order Summary</h4><div className='flex justify-between m-2'><span>Subtotal</span><span>{new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(subtotal)}</span></div><div className='flex justify-between m-2'><span>Shipping</span><span>{new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(shippingAmount)}</span></div><div className='flex justify-between m-2'><span>Tax</span><span>{new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(taxAmount)}</span></div><div className='flex justify-between m-2 font-bold text-lg border-t pt-2'><span>Total</span><span className='text-green-600'>{new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(totalAmount)}</span></div></div><div className='grid grid-cols-1 md:grid-cols-2 gap-4 m-5'><div className='w-full'><h4 className='font-semibold m-3'>Shipping Address</h4><div className='border border-gray-300 p-3 m-3'><p>{`${shippingAddress.first_name} ${shippingAddress.last_name}`}</p>{shippingAddress.company && <p>{shippingAddress.company}</p>}<p>{shippingAddress.address_line_1}</p>{shippingAddress.address_line_2 && <p>{shippingAddress.address_line_2}</p>}<p>{`${shippingAddress.city}, ${shippingAddress.state_province} ${shippingAddress.postal_code}`}</p><p>{shippingAddress.country}</p>{shippingAddress.phone && <p>{shippingAddress.phone}</p>}</div></div><div className='w-full'><h4 className='font-semibold m-3'>Billing Address</h4><div className='border border-gray-300 p-3 m-3'>{useSameAddress ? <p className='text-sm'>Same as shipping address</p> : <div><p>{`${billingAddress.first_name} ${billingAddress.last_name}`}</p>{billingAddress.company && <p>{billingAddress.company}</p>}<p>{billingAddress.address_line_1}</p>{billingAddress.address_line_2 && <p>{billingAddress.address_line_2}</p>}<p>{`${billingAddress.city}, ${billingAddress.state_province} ${billingAddress.postal_code}`}</p><p>{billingAddress.country}</p>{billingAddress.phone && <p>{billingAddress.phone}</p>}</div>}</div></div></div></div>;
  };
  const renderStepIndicator = () => {
    const steps = ["Shipping", "Billing", "Delivery", "Review"];
    return <div className='w-full flex justify-center m-5'><div className='flex flex-col sm:flex-row items-center'>{steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          return <div key={stepNumber} className='flex items-center m-2'><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${isActive ? 'bg-blue-600 text-white' : isCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>{stepNumber}</div><span className={`ml-2 text-sm ${isActive ? 'font-semibold' : 'text-gray-600'}`}>{step}</span>{stepNumber < steps.length && <div className='w-8 h-0.5 bg-gray-300 mx-4 hidden sm:block' />}</div>;
        })}</div></div>;
  };
  const renderModal = () => {
    if (!showModal) return null;
    return <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 max-w-md w-full mx-4'><p className='m-3'>{modalMessage}</p><button onClick={() => setShowModal(false)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-3'>Close</button></div></div>;
  };
  return <div className='w-full h-full flex flex-col'>{renderStepIndicator()}<div className='flex-1 flex flex-col justify-between p-5'><div className='flex-1'>{currentStep === 1 && renderStep1()}{currentStep === 2 && renderStep2()}{currentStep === 3 && renderStep3()}{currentStep === 4 && renderStep4()}</div><div className='flex justify-between items-center m-5'>{currentStep > 1 && <button onClick={handlePreviousStep} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Previous</button>}{currentStep === 1 && <div />}{currentStep < 4 ? <button onClick={handleNextStep} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Next</button> : <button onClick={handleSubmitOrder} disabled={isSubmitting || cartItems.length === 0} className={`p-3 ${isSubmitting || cartItems.length === 0 ? '!bg-gray-300 !text-gray-500' : 'border !text-gray-800 border-gray-300 !bg-transparent'}`}>{isSubmitting ? "Processing..." : "Place Order"}</button>}</div></div>{renderModal()}</div>;
};
CheckoutProcessView.displayName = 'CheckoutProcessView';
export default CheckoutProcessView;