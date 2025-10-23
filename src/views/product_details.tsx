'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showZoom, setShowZoom] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const productId = urlParams.get("productsid");
    if (productId) {
      fetch(`/api/productsget?id=${productId}`).then(response => {
        if (response.status === 401) {
          setLoading(false);
          return null;
        }
        return response.json();
      }).then(data => {
        if (data) {
          setProduct(data);
          if (data.images && data.images.length > 0) {
            const primaryImage = data.images.find(img => img.is_primary) || data.images[0];
            setSelectedImage(primaryImage);
          }
          if (data.size) setSelectedSize(data.size);
          if (data.color) setSelectedColor(data.color);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  const handleImageClick = image => {
    setSelectedImage(image);
  };
  const handleZoomClick = () => {
    setShowZoom(true);
  };
  const closeZoom = () => {
    setShowZoom(false);
  };
  const handleAddToCart = () => {
    if (!product) return;
    const cartItem = {
      id: `${Date.now()}-${Math.random()}`,
      productsid: product.id,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor
    };
    const existingCart = JSON.parse(typeof localStorage === 'undefined' ? '' : localStorage.getItem("shoppingcart") || "[]");
    existingCart.push(cartItem);
    if (typeof localStorage !== 'undefined') localStorage.setItem("shoppingcart", JSON.stringify(existingCart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };
  const formatPrice = price => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };
  if (loading) {
    return <div className='w-full flex items-center justify-center p-8'><div>Loading product details...</div></div>;
  }
  if (!product) {
    return <div className='w-full flex items-center justify-center p-8'><div>Product not found</div></div>;
  }
  return <div className='w-full'><div className='flex flex-col lg:flex-row gap-6 p-4 sm:p-6 md:p-8 lg:p-10'><div className='w-full lg:w-3/5'><div className='w-full h-96 lg:h-[600px] mb-4'>{selectedImage && <img src={`data:image/jpeg;base64,${selectedImage.image_url}`} alt={selectedImage.caption || product.name} className='w-full h-full object-contain cursor-pointer' onClick={handleZoomClick} />}</div>{product.images && product.images.length > 1 && <div className='grid grid-cols-4 gap-2 sm:gap-3 md:gap-4'>{product.images.map(image => <div key={image.id} className={`w-full h-24 cursor-pointer ${selectedImage?.id === image.id ? "border-2 border-solid" : ""}`} onClick={() => handleImageClick(image)}><img src={`data:image/jpeg;base64,${image.image_url}`} alt={image.caption || product.name} className='w-full h-full object-cover' /></div>)}</div>}</div><div className='w-full lg:w-2/5'><h1 className='mb-4'>{product.name}</h1>{product.category_name && <div className='mb-4'><span className='text-gray-600'>{product.category_name}</span></div>}<div className='mb-6'><span className='text-3xl font-bold'>{formatPrice(product.price)}</span></div>{product.available ? <div className='mb-4'><span className='text-green-600 font-semibold'>In Stock</span>{product.stock_quantity && <span className='text-gray-600 ml-2'>{`(${product.stock_quantity} ${"available"})`}</span>}</div> : <div className='mb-4'><span className='text-red-600 font-semibold'>Out of Stock</span></div>}{product.sku && <div className='mb-4'><span className='text-gray-600'>{`${"SKU"}: ${product.sku}`}</span></div>}{product.size && <div className='mb-5'><label className='block mb-2 font-semibold'>Size</label><input type='text' value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className='w-full p-3 border-solid border-2' /></div>}{product.color && <div className='mb-5'><label className='block mb-2 font-semibold'>Color</label><input type='text' value={selectedColor} onChange={e => setSelectedColor(e.target.value)} className='w-full p-3 border-solid border-2' /></div>}<div className='mb-5'><label className='block mb-2 font-semibold'>Quantity</label><input type='number' min='1' value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} className='w-full p-3 border-solid border-2' /></div>{product.available && <button onClick={handleAddToCart} className='w-full p-3 mb-4'>Add to Cart</button>}{addedToCart && <div className='p-3 bg-green-100 text-green-800 mb-4'>Added to cart successfully!</div>}</div></div><div className='p-4 sm:p-6 md:p-8 lg:p-10'>{product.description && <div className='mb-6'><h2>Description</h2><p className='mt-4'>{product.description}</p></div>}{product.era_period && <div className='mb-6'><h2>Historical Period</h2><p className='mt-4'>{product.era_period}</p></div>}{product.material && <div className='mb-6'><h2>Materials</h2><p className='mt-4'>{product.material}</p></div>}{product.care_instructions && <div className='mb-6'><h2>Care Instructions</h2><p className='mt-4'>{product.care_instructions}</p></div>}</div>{showZoom && <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-75' onClick={closeZoom} /><div className='relative bg-white p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto'><button onClick={closeZoom} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold z-50'>×</button>{selectedImage && <div className='bg-gray-100 p-4'><img src={`data:image/jpeg;base64,${selectedImage.image_url}`} alt={selectedImage.caption || product.name} className='w-full h-auto object-contain' /></div>}{selectedImage?.caption && <p className='mt-4 text-gray-900'>{selectedImage.caption}</p>}</div></div>}</div>;
}