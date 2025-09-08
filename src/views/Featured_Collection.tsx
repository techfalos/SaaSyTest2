'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const FeaturedCollectionView = function () {
  const router = useRouter();
  const [dresses, setDresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true);
  useEffect(() => {
    const fetchFeaturedDresses = async () => {
      try {
        const response = await fetch('/api/featureddresses?limit=6');
        if (response.status === 401) {
          setAuthorized(false);
          setLoading(false);
          return;
        }
        const result = await response.json();
        setDresses(result.data || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchFeaturedDresses();
  }, []);
  const handleDressClick = dressId => {
    router.push(`/dress_details?dressesid=${dressId}`);
  };
  const formatPrice = price => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  if (loading) {
    return <div className='w-full h-full flex items-center justify-center'><div>Loading featured dresses...</div></div>;
  }
  if (!authorized) {
    return <div className='w-full h-full flex items-center justify-center'><div>Please log in to view featured dresses</div></div>;
  }
  if (dresses.length === 0) {
    return <div className='w-full h-full flex items-center justify-center'><div>No featured dresses available</div></div>;
  }
  return <div className='w-full h-full p-3 sm:p-4 md:p-5 lg:p-6'><div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 h-full'>{dresses.map(dress => <div key={dress.id} className='flex flex-col h-full w-full border border-gray-300 hover:border-gray-400'>{dress.primary_image && <img src={`${dress.primary_image}`} alt={dress.name} className='w-full h-auto max-h-full' />}<div className='p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between flex-grow'><div className='m-2'>{dress.name}</div><div className='flex flex-col m-2'><span className='text-lg font-bold text-blue-600 m-1'>{formatPrice(dress.price)}</span>{dress.compare_at_price && dress.compare_at_price > dress.price && <span className='text-sm text-gray-500 m-1'>{formatPrice(dress.compare_at_price)}</span>}</div><button onClick={() => handleDressClick(dress.id)} className='m-2 p-3'>View Details</button></div></div>)}</div></div>;
};
FeaturedCollectionView.displayName = 'FeaturedCollectionView';
export default FeaturedCollectionView;