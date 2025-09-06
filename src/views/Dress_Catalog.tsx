'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const DressCatalogView = function DressCollection() {
  const router = useRouter();
  const [dresses, setDresses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState({
    min: '',
    max: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [unauthorized, setUnauthorized] = useState(false);
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const categoryFromUrl = urlParams.get('categoriesid');
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);
  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    fetchDresses();
  }, [searchTerm, selectedCategory, selectedSizes, selectedColors, priceRange, sortBy, currentPage]);
  useEffect(() => {
    if (dresses.length > 0) {
      const allSizes = [...new Set(dresses.flatMap(dress => dress.available_sizes || []))];
      const allColors = [...new Set(dresses.flatMap(dress => dress.available_colors || []))];
      setAvailableSizes(allSizes);
      setAvailableColors(allColors);
    }
  }, [dresses]);
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categorieslist?published=true&sort=display_order&limit=100');
      if (response.status === 401) {
        setUnauthorized(true);
        return;
      }
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const fetchDresses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (selectedSizes.length > 0) params.append('sizes', selectedSizes.join(','));
      if (selectedColors.length > 0) params.append('colors', selectedColors.join(','));
      if (priceRange.min) params.append('min_price', priceRange.min);
      if (priceRange.max) params.append('max_price', priceRange.max);
      params.append('published', 'true');
      params.append('sort', sortBy);
      params.append('page', currentPage.toString());
      params.append('limit', '12');
      const response = await fetch(`/api/dresseslist?${params.toString()}`);
      if (response.status === 401) {
        setUnauthorized(true);
        return;
      }
      const data = await response.json();
      setDresses(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalpages || 0);
    } catch (error) {
      console.error('Error fetching dresses:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSizeToggle = size => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
    setCurrentPage(1);
  };
  const handleColorToggle = color => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
    setCurrentPage(1);
  };
  const handleAddToCart = dress => {
    if (!dress.available_sizes || dress.available_sizes.length === 0 || !dress.available_colors || dress.available_colors.length === 0) {
      return;
    }
    const cartItems = JSON.parse(typeof localStorage === 'undefined' ? '' : localStorage.getItem('cart') || '[]');
    const newItem = {
      id: `cart-${Date.now()}-${Math.random()}`,
      dressesid: dress.id,
      size: dress.available_sizes[0],
      color: dress.available_colors[0],
      quantity: 1,
      added_at: new Date().toISOString()
    };
    cartItems.push(newItem);
    if (typeof localStorage !== 'undefined') localStorage.setItem('cart', JSON.stringify(cartItems));
  };
  const handleQuickView = dressId => {
    router.push(`/dress_details?dressesid=${dressId}`);
  };
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange({
      min: '',
      max: ''
    });
    setCurrentPage(1);
  };
  const formatPrice = price => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  if (unauthorized) {
    return <div className='w-full p-5'><p>Please log in to view dresses.</p></div>;
  }
  return <div className='w-full flex flex-col lg:flex-row'><div className='lg:w-1/4 p-5'><div className='border p-5 m-2'><h3 className='font-bold mb-5'>Filters</h3><div className='m-5'><label className='block mb-2'>Search</label><input type='text' value={searchTerm} onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }} className='w-full p-3 border' placeholder='Search dresses...' /></div><div className='m-5'><label className='block mb-2'>Category</label><select value={selectedCategory} onChange={e => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }} className='w-full p-3 border'><option value=''>All Categories</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div><div className='m-5'><label className='block mb-2'>Sizes</label><div className='flex flex-wrap'>{availableSizes.map(size => <button key={size} onClick={() => handleSizeToggle(size)} className={selectedSizes.includes(size) ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3 m-1' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 m-1 hover:border-gray-400'} aria-pressed={selectedSizes.includes(size)}>{size}</button>)}</div></div><div className='m-5'><label className='block mb-2'>Colors</label><div className='flex flex-wrap'>{availableColors.map(color => <button key={color} onClick={() => handleColorToggle(color)} className={selectedColors.includes(color) ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3 m-1' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 m-1 hover:border-gray-400'} aria-pressed={selectedColors.includes(color)}>{color}</button>)}</div></div><div className='m-5'><label className='block mb-2'>Price Range</label><div className='flex flex-col sm:flex-row'><input type='number' placeholder='Min' value={priceRange.min} onChange={e => {
              setPriceRange({
                ...priceRange,
                min: e.target.value
              });
              setCurrentPage(1);
            }} className='p-3 border m-1' /><input type='number' placeholder='Max' value={priceRange.max} onChange={e => {
              setPriceRange({
                ...priceRange,
                max: e.target.value
              });
              setCurrentPage(1);
            }} className='p-3 border m-1' /></div></div><button onClick={clearFilters} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-5 w-full'>Clear Filters</button></div></div><div className='lg:w-3/4 p-5'><div className='flex flex-col sm:flex-row justify-between items-center mb-5'><div><span>Showing {total} results</span></div><div className='mt-3 sm:mt-0'><label className='mr-3'>Sort by:</label><select value={sortBy} onChange={e => {
            setSortBy(e.target.value);
            setCurrentPage(1);
          }} className='p-3 border'><option value='name'>Name</option><option value='price'>Price: Low to High</option><option value='-price'>Price: High to Low</option><option value='-created_at'>Newest</option></select></div></div>{loading && <div className='text-center p-5'><p>Loading featured dresses...</p></div>}{!loading && <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>{dresses.map(dress => <div key={dress.id} className='border p-5 w-full h-full'>{dress.primary_image && <img src={`${dress.primary_image}`} alt={dress.name} className='w-full h-auto mb-3' />}<h4 className='font-bold mb-2'>{dress.name}</h4><div className='mb-2'><span className='text-lg font-bold text-green-600'>{formatPrice(dress.price)}</span>{dress.compare_at_price && dress.compare_at_price > dress.price && <span className='ml-2 line-through text-gray-500'>{formatPrice(dress.compare_at_price)}</span>}</div>{dress.featured && <div className='mb-2'><span className='bg-yellow-100 text-yellow-800 px-2 py-1 text-sm font-semibold'>Featured</span></div>}{dress.stock_quantity === 0 && <div className='mb-2'><span className='text-red-600 font-bold'>Out of Stock</span></div>}{dress.available_sizes && dress.available_sizes.length > 0 && <div className='mb-2 text-sm'><span>Sizes: </span>{dress.available_sizes.join(', ')}</div>}{dress.available_colors && dress.available_colors.length > 0 && <div className='mb-3 text-sm'><span>Colors: </span>{dress.available_colors.join(', ')}</div>}<div className='flex flex-col gap-2'><button onClick={() => handleQuickView(dress.id)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 w-full'>Quick View</button>{dress.stock_quantity > 0 && dress.available_sizes && dress.available_sizes.length > 0 && dress.available_colors && dress.available_colors.length > 0 && <button onClick={() => handleAddToCart(dress)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 w-full'>Add to Cart</button>}</div></div>)}</div>}{!loading && dresses.length === 0 && <div className='text-center p-5'><p>No dresses found matching your criteria.</p></div>}{!loading && totalPages > 1 && <div className='flex justify-center items-center mt-5 gap-3'><button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Previous</button><span className='px-3'>Page {currentPage} of {totalPages}</span><button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Next</button></div>}</div></div>;
};
DressCatalogView.displayName = 'DressCatalogView';
export default DressCatalogView;