'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedEraPeriods, setSelectedEraPeriods] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [availableEraPeriods, setAvailableEraPeriods] = useState([]);
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const categoriesid = urlParams.get('categoriesid');
  useEffect(() => {
    loadProducts();
  }, [page, sortBy, sortOrder, selectedSizes, selectedColors, selectedMaterials, selectedEraPeriods, minPrice, maxPrice, availableOnly, featuredOnly, searchQuery]);
  const deduplicateProducts = productsList => {
    const seen = new Set();
    return productsList.filter(product => {
      if (seen.has(product.id)) {
        return false;
      }
      seen.add(product.id);
      return true;
    });
  };
  const loadProducts = async () => {
    setLoading(true);
    try {
      let url = '';
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '12');
      if (searchQuery) {
        url = '/api/productssearch';
        params.append('query', searchQuery);
        if (categoriesid) params.append('categoriesid', categoriesid);
        if (minPrice) params.append('minprice', minPrice);
        if (maxPrice) params.append('maxprice', maxPrice);
        if (availableOnly) params.append('available', 'true');
      } else if (categoriesid) {
        url = '/api/productsbycategoryget';
        params.append('categoryid', categoriesid);
        if (availableOnly) params.append('available', 'true');
        if (minPrice) params.append('minprice', minPrice);
        if (maxPrice) params.append('maxprice', maxPrice);
        if (selectedSizes.length > 0) params.append('size', selectedSizes.join(','));
        if (selectedColors.length > 0) params.append('color', selectedColors.join(','));
        if (selectedMaterials.length > 0) params.append('material', selectedMaterials.join(','));
        if (selectedEraPeriods.length > 0) params.append('era_period', selectedEraPeriods.join(','));
        if (sortBy) params.append('sortby', sortBy);
        if (sortOrder) params.append('sortorder', sortOrder);
      } else {
        url = '/api/productslist';
        if (availableOnly) params.append('available', 'true');
        if (featuredOnly) params.append('featured', 'true');
        if (minPrice) params.append('minprice', minPrice);
        if (maxPrice) params.append('maxprice', maxPrice);
        if (selectedSizes.length > 0) params.append('size', selectedSizes.join(','));
        if (selectedColors.length > 0) params.append('color', selectedColors.join(','));
        if (selectedMaterials.length > 0) params.append('material', selectedMaterials.join(','));
        if (selectedEraPeriods.length > 0) params.append('era_period', selectedEraPeriods.join(','));
        if (sortBy) params.append('sortby', sortBy);
        if (sortOrder) params.append('sortorder', sortOrder);
      }
      const finalUrl = `${url}?${params.toString()}`;
      const response = await fetch(finalUrl);
      if (response.status === 401) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const data = await response.json();
      if (categoriesid && data.category) {
        setCategoryInfo(data.category);
        const deduplicatedProducts = deduplicateProducts(data.products.data || []);
        setProducts(deduplicatedProducts);
        setTotalPages(data.products.totalpages || 1);
        const uniqueSizes = [...new Set(deduplicatedProducts.filter(p => p.size).map(p => p.size))];
        const uniqueColors = [...new Set(deduplicatedProducts.filter(p => p.color).map(p => p.color))];
        const uniqueMaterials = [...new Set(deduplicatedProducts.filter(p => p.material).map(p => p.material))];
        const uniqueEras = [...new Set(deduplicatedProducts.filter(p => p.era_period).map(p => p.era_period))];
        setAvailableSizes(uniqueSizes);
        setAvailableColors(uniqueColors);
        setAvailableMaterials(uniqueMaterials);
        setAvailableEraPeriods(uniqueEras);
      } else {
        const deduplicatedProducts = deduplicateProducts(data.data || []);
        setProducts(deduplicatedProducts);
        setTotalPages(data.totalpages || 1);
        const uniqueSizes = [...new Set(deduplicatedProducts.filter(p => p.size).map(p => p.size))];
        const uniqueColors = [...new Set(deduplicatedProducts.filter(p => p.color).map(p => p.color))];
        const uniqueMaterials = [...new Set(deduplicatedProducts.filter(p => p.material).map(p => p.material))];
        const uniqueEras = [...new Set(deduplicatedProducts.filter(p => p.era_period).map(p => p.era_period))];
        setAvailableSizes(uniqueSizes);
        setAvailableColors(uniqueColors);
        setAvailableMaterials(uniqueMaterials);
        setAvailableEraPeriods(uniqueEras);
      }
    } catch (error) {
      setProducts([]);
    }
    setLoading(false);
  };
  const handleSizeToggle = size => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
    setPage(1);
  };
  const handleColorToggle = color => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
    setPage(1);
  };
  const handleMaterialToggle = material => {
    if (selectedMaterials.includes(material)) {
      setSelectedMaterials(selectedMaterials.filter(m => m !== material));
    } else {
      setSelectedMaterials([...selectedMaterials, material]);
    }
    setPage(1);
  };
  const handleEraPeriodToggle = era => {
    if (selectedEraPeriods.includes(era)) {
      setSelectedEraPeriods(selectedEraPeriods.filter(e => e !== era));
    } else {
      setSelectedEraPeriods([...selectedEraPeriods, era]);
    }
    setPage(1);
  };
  const handleClearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSelectedEraPeriods([]);
    setMinPrice('');
    setMaxPrice('');
    setAvailableOnly(false);
    setFeaturedOnly(false);
    setSearchQuery('');
    setPage(1);
  };
  const handleProductClick = productId => {
    router.push(`/item_detail?productsid=${productId}`);
  };
  const formatPrice = price => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  const hideFiltersText = "Hide Filters";
  const showFiltersText = "Show Filters";
  const searchPlaceholderText = "Search products...";
  const sortLabelText = "Sort By";
  const sortNameText = "Name";
  const sortPriceText = "Price";
  const sortAscText = "Ascending";
  const sortDescText = "Descending";
  const priceRangeText = "Price Range";
  const minPriceText = "Min Price";
  const maxPriceText = "Max Price";
  const sizeLabelText = "Size";
  const colorLabelText = "Color";
  const materialLabelText = "Material";
  const eraLabelText = "Era Period";
  const availableOnlyText = "Available Only";
  const featuredOnlyText = "Featured Only";
  const clearFiltersText = "Clear All Filters";
  const loadingText = "Loading products...";
  const noProductsText = "No products found";
  const availableText = "Available";
  const unavailableText = "Out of Stock";
  const featuredText = "Featured";
  const sizeColonText = "Size";
  const colorColonText = "Color";
  const materialColonText = "Material";
  const eraColonText = "Era";
  const stockText = "Stock";
  const previousText = "Previous";
  const pageText = "Page";
  const ofText = "of";
  const nextText = "Next";
  return <div className='w-full flex flex-col lg:flex-row gap-6 p-4 lg:p-6'><div className='w-full lg:w-1/4 lg:max-w-xs'><div className='lg:hidden mb-4'><button onClick={() => setFiltersOpen(!filtersOpen)} className='w-full p-3 border-2 border-solid'>{filtersOpen ? hideFiltersText : showFiltersText}</button></div><div className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}><div className='flex flex-col gap-6'><div className='m-4'><input type='text' placeholder={searchPlaceholderText} value={searchQuery} onChange={e => {
              setSearchQuery(e.target.value);
              setPage(1);
            }} className='w-full p-3 border-2 border-solid' /></div><div className='m-4'><div className='font-bold mb-3'>{sortLabelText}</div><select value={sortBy} onChange={e => setSortBy(e.target.value)} className='w-full p-3 border-2 border-solid mb-3'><option value='name'>{sortNameText}</option><option value='price'>{sortPriceText}</option></select><select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className='w-full p-3 border-2 border-solid'><option value='asc'>{sortAscText}</option><option value='desc'>{sortDescText}</option></select></div><div className='m-4'><div className='font-bold mb-3'>{priceRangeText}</div><input type='number' placeholder={minPriceText} value={minPrice} onChange={e => {
              setMinPrice(e.target.value);
              setPage(1);
            }} className='w-full p-3 border-2 border-solid mb-3' /><input type='number' placeholder={maxPriceText} value={maxPrice} onChange={e => {
              setMaxPrice(e.target.value);
              setPage(1);
            }} className='w-full p-3 border-2 border-solid' /></div>{availableSizes.length > 0 ? <div className='m-4'><div className='font-bold mb-3'>{sizeLabelText}</div><div className='flex flex-wrap gap-2'>{availableSizes.map(size => <button key={size} onClick={() => handleSizeToggle(size)} className={`p-3 border-2 border-solid ${selectedSizes.includes(size) ? 'bg-gray-900 text-white' : ''}`} aria-pressed={selectedSizes.includes(size)}>{size}</button>)}</div></div> : null}{availableColors.length > 0 ? <div className='m-4'><div className='font-bold mb-3'>{colorLabelText}</div><div className='flex flex-wrap gap-2'>{availableColors.map(color => <button key={color} onClick={() => handleColorToggle(color)} className={`p-3 border-2 border-solid ${selectedColors.includes(color) ? 'bg-gray-900 text-white' : ''}`} aria-pressed={selectedColors.includes(color)}>{color}</button>)}</div></div> : null}{availableMaterials.length > 0 ? <div className='m-4'><div className='font-bold mb-3'>{materialLabelText}</div><div className='flex flex-wrap gap-2'>{availableMaterials.map(material => <button key={material} onClick={() => handleMaterialToggle(material)} className={`p-3 border-2 border-solid ${selectedMaterials.includes(material) ? 'bg-gray-900 text-white' : ''}`} aria-pressed={selectedMaterials.includes(material)}>{material}</button>)}</div></div> : null}{availableEraPeriods.length > 0 ? <div className='m-4'><div className='font-bold mb-3'>{eraLabelText}</div><div className='flex flex-wrap gap-2'>{availableEraPeriods.map(era => <button key={era} onClick={() => handleEraPeriodToggle(era)} className={`p-3 border-2 border-solid ${selectedEraPeriods.includes(era) ? 'bg-gray-900 text-white' : ''}`} aria-pressed={selectedEraPeriods.includes(era)}>{era}</button>)}</div></div> : null}<div className='m-4'><label className='flex items-center gap-2'><input type='checkbox' checked={availableOnly} onChange={e => {
                setAvailableOnly(e.target.checked);
                setPage(1);
              }} /><span>{availableOnlyText}</span></label></div>{!categoriesid ? <div className='m-4'><label className='flex items-center gap-2'><input type='checkbox' checked={featuredOnly} onChange={e => {
                setFeaturedOnly(e.target.checked);
                setPage(1);
              }} /><span>{featuredOnlyText}</span></label></div> : null}<div className='m-4'><button onClick={handleClearFilters} className='w-full p-3 border-2 border-solid'>{clearFiltersText}</button></div></div></div></div><div className='w-full lg:w-3/4 flex-1'>{categoryInfo ? <div className='mb-6'><div className='text-2xl font-bold mb-2'>{categoryInfo.name}</div>{categoryInfo.description ? <div className='mb-4'>{categoryInfo.description}</div> : null}</div> : null}{loading ? <div className='text-center p-6'>{loadingText}</div> : products.length === 0 ? <div className='text-center p-6'>{noProductsText}</div> : <div><div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'>{products.map(product => <div key={product.id} className='border-2 border-solid flex flex-col cursor-pointer' onClick={() => handleProductClick(product.id)} tabIndex={0}>{product.primary_image_url ? <div className='w-full h-64'><img src={`data:image/jpeg;base64,${product.primary_image_url}`} alt={product.name} className='w-full h-full object-cover' /></div> : null}<div className='p-4 flex-1 flex flex-col'><div className='font-bold mb-2'>{product.name}</div><div className='text-xl font-semibold mb-2'>{formatPrice(product.price)}</div>{product.available ? <div className='text-green-600 text-sm mb-2'>{availableText}</div> : <div className='text-red-600 text-sm mb-2'>{unavailableText}</div>}{product.featured ? <div className='bg-yellow-100 text-yellow-800 text-sm p-2 mb-2 text-center font-semibold'>{featuredText}</div> : null}{product.size ? <div className='text-sm mb-1'>{`${sizeColonText}: ${product.size}`}</div> : null}{product.color ? <div className='text-sm mb-1'>{`${colorColonText}: ${product.color}`}</div> : null}{product.material ? <div className='text-sm mb-1'>{`${materialColonText}: ${product.material}`}</div> : null}{product.era_period ? <div className='text-sm mb-1'>{`${eraColonText}: ${product.era_period}`}</div> : null}<div className='text-sm text-gray-600 mt-2'>{`${stockText}: ${product.stock_quantity}`}</div></div></div>)}</div>{totalPages > 1 ? <div className='flex justify-center items-center gap-4 mt-6'><button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className='p-3 border-2 border-solid'>{previousText}</button><div>{`${pageText} ${page} ${ofText} ${totalPages}`}</div><button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className='p-3 border-2 border-solid'>{nextText}</button></div> : null}</div>}</div></div>;
}