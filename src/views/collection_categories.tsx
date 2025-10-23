'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categorieslist?visible=true&sortby=display_order&sortorder=asc');
        if (response.status === 401) {
          setError("Unauthorized access");
          setLoading(false);
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to load categories");
        }
        const data = await response.json();
        setCategories(data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  const handleCategoryClick = categoryId => {
    router.push(`/shop?categoriesid=${categoryId}`);
  };
  if (loading) {
    return <div className='w-full'><div className='flex items-center justify-center p-10'><p>Loading collections...</p></div></div>;
  }
  if (error) {
    return <div className='w-full'><div className='flex items-center justify-center p-10'><p>{error}</p></div></div>;
  }
  if (categories.length === 0) {
    return <div className='w-full'><div className='flex items-center justify-center p-10'><p>No collections available at this time</p></div></div>;
  }
  return <div className='w-full'><div className='p-4 sm:p-6 md:p-8 lg:p-10'><div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>{categories.map(category => <div key={category.id} className='flex flex-col border border-solid p-4 w-full h-full'>{category.image_url && <div className='w-full h-64 mb-4'><img src={`data:image/jpeg;base64,${category.image_url}`} alt={category.name} className='w-full h-full object-cover' /></div>}<div className='text-center mb-3'>{category.name}</div>{category.description && <div className='text-center mb-4'>{category.description}</div>}<button className='p-3 mt-auto' onClick={() => handleCategoryClick(category.id)}>View Collection</button></div>)}</div></div></div>;
}