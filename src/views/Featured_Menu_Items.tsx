'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const FeaturedMenuItemsView = function FeaturedMenuItems() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await fetch('/api/featureditems?limit=8');
        if (!response.ok) {
          if (response.status === 401) {
            setError('Unauthorized');
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch featured items');
        }
        const data = await response.json();
        setItems(data.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedItems();
  }, []);
  const handleOrderNow = itemId => {
    router.push(`/order_online?menuitemsid=${itemId}`);
  };
  const formatPrice = price => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  if (loading) {
    return <div className='w-full flex justify-center items-center p-8'><p>Loading featured items...</p></div>;
  }
  if (error) {
    return <div className='w-full flex justify-center items-center p-8'><p className='text-red-600'>Error loading featured items</p></div>;
  }
  if (!items || items.length === 0) {
    return <div className='w-full flex justify-center items-center p-8'><p>No featured items available</p></div>;
  }
  return <div className='w-full p-4 sm:p-6 lg:p-8'><div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>{items.map(item => <div key={item.id} className='w-full border border-gray-300 flex flex-col h-full'>{item.image_url ? <img src={`${item.image_url}`} alt={item.name} className='w-full h-auto max-h-full' /> : null}<div className='p-4 flex-1 flex flex-col'><h3 className='font-bold m-2'>{item.name}</h3><p className='m-2 flex-1'>{item.description}</p>{item.spice_level ? <p className='m-2 text-red-600 font-semibold'>{`${"Spice Level"}: ${item.spice_level}`}</p> : null}{item.preparation_time ? <p className='m-2'>{`${"Prep Time"}: ${item.preparation_time} ${"minutes"}`}</p> : null}<div className='flex justify-between items-center m-2'><p className='text-green-600 font-bold'>{formatPrice(item.price)}</p>{item.available ? <button onClick={() => handleOrderNow(item.id)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Order Now</button> : <p className='text-red-600'>Unavailable</p>}</div></div></div>)}</div></div>;
};
FeaturedMenuItemsView.displayName = 'FeaturedMenuItemsView';
export default FeaturedMenuItemsView;