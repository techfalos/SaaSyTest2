'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await fetch('/api/categorieslist?visible=true&sortby=display_order&sortorder=asc&limit=10');
        const categoriesData = await categoriesResponse.json();
        const productsResponse = await fetch('/api/featuredproductsget');
        const productsData = await productsResponse.json();
        setCategories(categoriesData.data || []);
        setFeaturedProducts(productsData.data || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const slides = useMemo(() => {
    const categorySlides = categories.filter(c => c.image_url).map(category => ({
      type: 'category',
      id: category.id,
      name: category.name,
      description: category.description,
      image: category.image_url
    }));
    const productSlides = featuredProducts.filter(p => p.primary_image_url).map(product => ({
      type: 'product',
      id: product.id,
      categoriesid: product.categoriesid,
      name: product.name,
      description: product.description,
      image: product.primary_image_url,
      price: product.price
    }));
    return [...categorySlides, ...productSlides];
  }, [categories, featuredProducts]);
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);
  const handlePrevious = () => {
    setCurrentSlide(prev => prev === 0 ? slides.length - 1 : prev - 1);
  };
  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };
  const handleDotClick = index => {
    setCurrentSlide(index);
  };
  const handleSlideClick = () => {
    const slide = slides[currentSlide];
    if (slide.type === 'category') {
      router.push(`/shop?categoriesid=${slide.id}`);
    } else if (slide.type === 'product') {
      router.push(`/item_detail?productsid=${slide.id}`);
    }
  };
  if (loading) {
    return <div className='w-full flex items-center justify-center p-8'><div className='text-gray-600'>Loading featured collections...</div></div>;
  }
  if (slides.length === 0) {
    return <div className='w-full flex items-center justify-center p-8'><div className='text-gray-600'>No featured collections available</div></div>;
  }
  const currentSlideData = slides[currentSlide];
  return <div className='w-full relative'><div className='relative w-full h-96 lg:h-[600px]'><div className='absolute inset-0 w-full h-full' onClick={handleSlideClick}><div className='w-full h-full'><img src={'data:image/jpeg;base64,' + currentSlideData.image} alt={currentSlideData.name} className='w-full h-full object-cover' /></div><div className='absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center p-6'><h2 className='text-white text-3xl lg:text-5xl font-bold mb-4'>{currentSlideData.name}</h2>{currentSlideData.description && <p className='text-white text-lg lg:text-xl max-w-2xl mb-6'>{currentSlideData.description}</p>}{currentSlideData.type === 'product' && currentSlideData.price && <div className='text-white text-2xl font-semibold'>{new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(currentSlideData.price)}</div>}</div></div><button onClick={handlePrevious} className='absolute left-4 top-1/2 z-10 p-3 bg-white bg-opacity-75 hover:bg-opacity-100'>Previous</button><button onClick={handleNext} className='absolute right-4 top-1/2 z-10 p-3 bg-white bg-opacity-75 hover:bg-opacity-100'>Next</button></div><div className='flex justify-center items-center gap-2 p-4'>{slides.map((slide, index) => <button key={index} onClick={() => handleDotClick(index)} className={'w-3 h-3 bg-gray-300 hover:bg-gray-500' + (index === currentSlide ? ' bg-gray-700' : '')} aria-label={"Slide" + ' ' + (index + 1)} />)}</div></div>;
}