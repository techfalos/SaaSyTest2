'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const DressDetailViewView = function () {
  const [dress, setDress] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addToCartMessage, setAddToCartMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const dressId = urlParams.get('dressesid');
    if (dressId) {
      fetchDressDetails(dressId);
      fetchDressImages(dressId);
    }
  }, []);
  const fetchDressDetails = async dressId => {
    try {
      const response = await fetch(`/api/dressesget?id=${dressId}`);
      if (response.status === 401) {
        setError('Unauthorized access');
        return;
      }
      const data = await response.json();
      setDress(data);
      if (data.available_sizes && data.available_sizes.length > 0) {
        setSelectedSize(data.available_sizes[0]);
      }
      if (data.available_colors && data.available_colors.length > 0) {
        setSelectedColor(data.available_colors[0]);
      }
    } catch (err) {
      setError('Failed to load dress details');
    }
  };
  const fetchDressImages = async dressId => {
    try {
      const response = await fetch(`/api/dressimageslist?dress_id=${dressId}&sort=display_order&page=1&limit=20`);
      if (response.status === 401) {
        setError('Unauthorized access');
        return;
      }
      const data = await response.json();
      setImages(data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dress images');
      setLoading(false);
    }
  };
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setAddToCartMessage('Please select size and color');
      setShowModal(true);
      return;
    }
    const cartItems = JSON.parse(typeof localStorage === 'undefined' ? '' : localStorage.getItem('cart') || '[]');
    const newCartItem = {
      id: Date.now().toString(),
      dressesid: dress.id,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      added_at: new Date().toISOString()
    };
    cartItems.push(newCartItem);
    if (typeof localStorage !== 'undefined') localStorage.setItem('cart', JSON.stringify(cartItems));
    setAddToCartMessage('Added to cart successfully!');
    setShowModal(true);
  };
  const handleSizeSelect = size => {
    setSelectedSize(size);
  };
  const handleColorSelect = color => {
    setSelectedColor(color);
  };
  const handleImageSelect = index => {
    setSelectedImageIndex(index);
  };
  const handleQuantityChange = newQuantity => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  const formatPrice = price => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  const closeModal = () => {
    setShowModal(false);
    setAddToCartMessage('');
  };
  if (loading) {
    return <div className='w-full flex items-center justify-center p-10'><div className='text-lg'>Loading dress details...</div></div>;
  }
  if (error) {
    return <div className='w-full flex items-center justify-center p-10'><div className='text-red-600 text-lg'>{error}</div></div>;
  }
  if (!dress) {
    return <div className='w-full flex items-center justify-center p-10'><div className='text-lg'>Dress not found</div></div>;
  }
  const primaryImages = images.filter(img => img.is_primary);
  const allImages = primaryImages.length > 0 ? [...primaryImages, ...images.filter(img => !img.is_primary)] : images;
  const currentImage = allImages[selectedImageIndex];
  return <div className='w-full'><div className='flex flex-col lg:flex-row p-4 sm:p-6 md:p-8 lg:p-10'><div className='flex-1 m-2'><div className='flex flex-col'><div className='mb-4'>{currentImage ? <img src={`${currentImage.image_url}`} alt={currentImage.alt_text || dress.name} className='w-full h-auto max-h-full object-cover' /> : <div className='w-full h-96 bg-gray-200 flex items-center justify-center'><span className='text-gray-500'>No image available</span></div>}</div>{allImages.length > 1 && <div className='flex flex-wrap gap-2'>{allImages.map((image, index) => <button key={image.id} onClick={() => handleImageSelect(index)} className={`border-2 ${selectedImageIndex === index ? 'border-blue-500' : 'border-gray-300'} p-1`}><img src={`${image.image_url}`} alt={image.alt_text || dress.name} className='w-16 h-16 object-cover' /></button>)}</div>}</div></div><div className='flex-1 m-2'><div className='flex flex-col'><h1 className='text-3xl mb-4'>{dress.name}</h1><div className='mb-6'><div className='flex items-center gap-4'><span className='text-2xl font-bold text-green-600'>{formatPrice(dress.price)}</span>{dress.compare_at_price && dress.compare_at_price > dress.price && <span className='text-lg line-through text-gray-500'>{formatPrice(dress.compare_at_price)}</span>}</div></div>{dress.description && <div className='mb-6'><p className='text-base leading-6'>{dress.description}</p></div>}{dress.available_sizes && dress.available_sizes.length > 0 && <div className='mb-6'><h3 className='text-lg mb-3'>Size</h3><div className='flex flex-wrap gap-2'>{dress.available_sizes.map(size => <button key={size} onClick={() => handleSizeSelect(size)} className={selectedSize === size ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 hover:border-gray-400'} aria-pressed={selectedSize === size}>{size}</button>)}</div></div>}{dress.available_colors && dress.available_colors.length > 0 && <div className='mb-6'><h3 className='text-lg mb-3'>Color</h3><div className='flex flex-wrap gap-2'>{dress.available_colors.map(color => <button key={color} onClick={() => handleColorSelect(color)} className={selectedColor === color ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 hover:border-gray-400'} aria-pressed={selectedColor === color}>{color}</button>)}</div></div>}<div className='mb-6'><h3 className='text-lg mb-3'>Quantity</h3><div className='flex items-center gap-2'><button onClick={() => handleQuantityChange(quantity - 1)} className='border !text-gray-800 border-gray-300 !bg-transparent p-2'>-</button><span className='px-4 py-2 border border-gray-300'>{quantity}</span><button onClick={() => handleQuantityChange(quantity + 1)} className='border !text-gray-800 border-gray-300 !bg-transparent p-2'>+</button></div></div><div className='mb-6'><span className={dress.stock_quantity > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{dress.stock_quantity > 0 ? "${dress.stock_quantity} in stock" : "Out of stock"}</span></div><button onClick={handleAddToCart} disabled={dress.stock_quantity === 0} className={dress.stock_quantity > 0 ? 'border !text-gray-800 border-gray-300 !bg-transparent p-4 text-lg' : 'border !text-gray-400 border-gray-300 !bg-gray-100 p-4 text-lg cursor-not-allowed'}>Add to Cart</button><div className='mt-8 space-y-4'><div><span className='font-semibold'>SKU: </span><span>{dress.sku}</span></div>{dress.material && <div><span className='font-semibold'>Material: </span><span>{dress.material}</span></div>}{dress.care_instructions && <div><span className='font-semibold'>Care Instructions: </span><span>{dress.care_instructions}</span></div>}</div></div></div></div>{showModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 max-w-md w-full m-4'><p className='text-lg mb-4'>{addToCartMessage}</p><button onClick={closeModal} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Close</button></div></div>}</div>;
};
DressDetailViewView.displayName = 'DressDetailViewView';
export default DressDetailViewView;