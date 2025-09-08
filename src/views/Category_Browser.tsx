'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const CategoryBrowserView = function CategoryDisplay() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('display_order');
  const limit = 12;
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (publishedFilter !== 'all') params.append('published', publishedFilter);
      params.append('sort', sortBy);
      params.append('page', currentPage.toString());
      params.append('limit', limit.toString());
      const response = await fetch(`/api/categorieslist?${params.toString()}`);
      if (response.status === 401) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalpages || 1);
        setUnauthorized(false);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
    setLoading(false);
  }, [searchTerm, publishedFilter, sortBy, currentPage]);
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, publishedFilter, sortBy]);
  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };
  const handlePublishedFilterChange = value => {
    setPublishedFilter(value);
  };
  const handleSortChange = value => {
    setSortBy(value);
  };
  const handlePageChange = page => {
    setCurrentPage(page);
  };
  const handleCategoryClick = categoryId => {
    router.push(`/dress_collection?categoriesid=${categoryId}`);
  };
  if (unauthorized) {
    return <div className='w-full p-5'><div className='text-center'>Please log in to view dresses.</div></div>;
  }
  return <div className='w-full'><div className='p-5 sm:p-3 md:p-4 lg:p-5'><div className='flex flex-col lg:flex-row justify-between items-start lg:items-center mb-5'><h1 className='text-2xl lg:text-3xl mb-3 lg:mb-0'>Dress Categories</h1><div className='flex flex-col sm:flex-col md:flex-col lg:flex-row gap-3 w-full lg:w-auto'><input type='text' placeholder='Search dresses...' value={searchTerm} onChange={handleSearchChange} className='m-2 p-3 border border-gray-300 w-full lg:w-64' /><div className='flex gap-2'><button onClick={() => handlePublishedFilterChange('all')} className={`border p-3 ${publishedFilter === 'all' ? 'border-2 border-blue-500 !text-black !bg-blue-100' : 'border border-gray-300 !text-gray-800 !bg-transparent hover:border-gray-400'}`} aria-pressed={publishedFilter === 'all'}>All</button><button onClick={() => handlePublishedFilterChange('true')} className={`border p-3 ${publishedFilter === 'true' ? 'border-2 border-blue-500 !text-black !bg-blue-100' : 'border border-gray-300 !text-gray-800 !bg-transparent hover:border-gray-400'}`} aria-pressed={publishedFilter === 'true'}>Published</button><button onClick={() => handlePublishedFilterChange('false')} className={`border p-3 ${publishedFilter === 'false' ? 'border-2 border-blue-500 !text-black !bg-blue-100' : 'border border-gray-300 !text-gray-800 !bg-transparent hover:border-gray-400'}`} aria-pressed={publishedFilter === 'false'}>Unpublished</button></div></div></div><div className='flex gap-2 mb-5 flex-wrap'><span className='p-3 text-sm'>Sort by</span><button onClick={() => handleSortChange('display_order')} className={`border p-3 ${sortBy === 'display_order' ? 'border-2 border-blue-500 !text-black !bg-blue-100' : 'border border-gray-300 !text-gray-800 !bg-transparent hover:border-gray-400'}`} aria-pressed={sortBy === 'display_order'}>Order</button><button onClick={() => handleSortChange('name')} className={`border p-3 ${sortBy === 'name' ? 'border-2 border-blue-500 !text-black !bg-blue-100' : 'border border-gray-300 !text-gray-800 !bg-transparent hover:border-gray-400'}`} aria-pressed={sortBy === 'name'}>Name</button><button onClick={() => handleSortChange('created_at')} className={`border p-3 ${sortBy === 'created_at' ? 'border-2 border-blue-500 !text-black !bg-blue-100' : 'border border-gray-300 !text-gray-800 !bg-transparent hover:border-gray-400'}`} aria-pressed={sortBy === 'created_at'}>Newest</button></div></div>{loading && <div className='flex justify-center items-center p-5'><div>Loading dresses...</div></div>}{!loading && categories.length === 0 && <div className='text-center p-5'><p>No categories found.</p></div>}{!loading && categories.length > 0 && <div className='p-5 sm:p-3 md:p-4 lg:p-5'><div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-3 md:gap-4 lg:gap-5'>{categories.map(category => <div key={category.id} className='border border-gray-200 p-5 hover:border-gray-400 cursor-pointer w-full h-full' onClick={() => handleCategoryClick(category.id)}>{category.image_url && <div className='mb-4'><img src={`${category.image_url}`} alt={category.name} className='w-full h-48 max-w-full max-h-full h-auto object-cover' /></div>}<h3 className='text-lg font-semibold mb-2'>{category.name}</h3>{category.description && <p className='text-sm mb-3'>{category.description}</p>}<div className='flex justify-between items-center'><span className={`text-xs px-2 py-1 ${category.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{category.published ? "Published" : "Draft"}</span><span className='text-xs text-gray-500'>{`${"Order"}: ${category.display_order}`}</span></div></div>)}</div></div>}{!loading && totalPages > 1 && <div className='p-5 flex justify-center'><div className='flex gap-2'><button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`p-3 border border-gray-300 ${currentPage === 1 ? '!bg-gray-100 !text-gray-400' : '!bg-transparent !text-gray-800 hover:border-gray-400'}`}>Previous</button>{Array.from({
          length: Math.min(5, totalPages)
        }, (_, i) => {
          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
          if (pageNum > totalPages) return null;
          return <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`p-3 border ${currentPage === pageNum ? 'border-2 border-blue-500 !text-black !bg-blue-100' : 'border-gray-300 !text-gray-800 !bg-transparent hover:border-gray-400'}`} aria-pressed={currentPage === pageNum}>{pageNum.toString()}</button>;
        })}<button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`p-3 border border-gray-300 ${currentPage === totalPages ? '!bg-gray-100 !text-gray-400' : '!bg-transparent !text-gray-800 hover:border-gray-400'}`}>Next</button></div></div>}{!loading && categories.length > 0 && <div className='text-center p-3 text-sm text-gray-600'>Showing ${((currentPage - 1) * limit) + 1}-${Math.min(currentPage * limit, total)} of ${total} categories</div>}</div>;
};
CategoryBrowserView.displayName = 'CategoryBrowserView';
export default CategoryBrowserView;