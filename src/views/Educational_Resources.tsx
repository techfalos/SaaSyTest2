'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const EducationalResourcesView = function WellnessResourcesComponent() {
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const resourceId = urlParams.get('wellnessresourcesid');
  const [resources, setResources] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedTags) params.append('tags', selectedTags);
      if (showFeaturedOnly) params.append('featured', 'true');
      params.append('published', 'true');
      params.append('page', currentPage.toString());
      params.append('limit', '12');
      const response = await fetch(`/api/wellnessresourceslist?${params.toString()}`);
      if (response.status === 401) {
        setIsUnauthorized(true);
        return;
      }
      const data = await response.json();
      setResources(data.data || []);
      setTotalPages(data.totalpages || 1);
      const uniqueCategories = [...new Set(data.data?.map(r => r.category).filter(Boolean) || [])];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
    setLoading(false);
  }, [currentPage, selectedCategory, selectedTags, showFeaturedOnly]);
  const fetchSingleResource = useCallback(async id => {
    try {
      const response = await fetch(`/api/wellnessresourcesget?id=${id}`);
      if (response.status === 401) {
        setIsUnauthorized(true);
        setShowResourceModal(true);
        setSelectedResource({
          title: "Unauthorized Access",
          content: "Please log in to access the sound library."
        });
        return;
      }
      const data = await response.json();
      setSelectedResource(data);
      setShowResourceModal(true);
    } catch (error) {
      console.error('Error fetching resource details:', error);
    }
  }, []);
  useEffect(() => {
    if (resourceId) {
      fetchSingleResource(resourceId);
    } else {
      fetchResources();
    }
  }, [resourceId, fetchResources, fetchSingleResource]);
  const filteredResources = useMemo(() => {
    if (!searchTerm) return resources;
    return resources.filter(resource => resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) || resource.content && resource.content.toLowerCase().includes(searchTerm.toLowerCase()) || resource.tags && resource.tags.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [resources, searchTerm]);
  const handleResourceClick = async id => {
    await fetchSingleResource(id);
  };
  const handleCategoryFilter = category => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setCurrentPage(1);
  };
  const handlePageChange = page => {
    setCurrentPage(page);
  };
  const closeModal = () => {
    setShowResourceModal(false);
    setSelectedResource(null);
  };
  const sanitizeHtml = html => {
    return html.replace(/<[^>]*>/g, '');
  };
  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  if (isUnauthorized) {
    return <div className='w-full h-full flex items-center justify-center p-5'><div className='text-center'><h2 className='m-5'>Access Denied</h2><p className='m-3'>Please log in to access wellness resources.</p></div></div>;
  }
  return <div className='w-full h-full flex flex-col'><div className='p-3 sm:p-4 md:p-5 lg:p-6'><div className='flex flex-col lg:flex-row lg:items-center lg:justify-between m-3'><h1 className='m-2'>Wellness Resources</h1><div className='flex flex-col sm:flex-row gap-3 m-2'><input type='text' placeholder='Search resources...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className='p-3 border m-2' /><select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className='p-3 border m-2'><option value=''>All Categories</option>{categories.map(category => <option key={category} value={category}>{category}</option>)}</select></div></div><div className='flex flex-wrap gap-2 m-3'><button onClick={() => setShowFeaturedOnly(!showFeaturedOnly)} className={showFeaturedOnly ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 hover:border-gray-400'} aria-pressed={showFeaturedOnly}>Featured Only</button></div></div><div className='flex-1 overflow-auto p-3 sm:p-4 md:p-5 lg:p-6'>{loading ? <div className='flex items-center justify-center h-full'><p>Loading practitioner profile...</p></div> : filteredResources.length === 0 ? <div className='flex items-center justify-center h-full'><p className='m-5'>No resources found matching your criteria.</p></div> : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6'>{filteredResources.map(resource => <div key={resource.id} className='border p-4 lg:p-6 cursor-pointer hover:border-gray-400 w-full h-full' onClick={() => handleResourceClick(resource.id)}>{resource.featured_image && <img src={`${resource.featured_image}`} alt={resource.title} className='w-full h-auto max-h-48 m-3' />}<div className='m-3'>{resource.featured && <span className='!bg-yellow-100 text-yellow-800 p-2 text-sm font-semibold m-2'>Featured</span>}<h3 className='m-2'>{resource.title}</h3>{resource.category && <p className='text-blue-600 font-medium m-2'>{resource.category}</p>}{resource.author && <p className='m-2'>{"By" + ' ' + resource.author}</p>}{resource.published_date && <p className='text-gray-600 m-2'>{formatDate(resource.published_date)}</p>}{resource.content && <p className='m-2'>{sanitizeHtml(resource.content.substring(0, 150)) + (resource.content.length > 150 ? '...' : '')}</p>}{resource.tags && <div className='flex flex-wrap gap-1 m-2'>{resource.tags.split(',').map(tag => <span key={tag.trim()} className='!bg-green-100 text-green-800 p-1 text-sm'>{tag.trim()}</span>)}</div>}</div></div>)}</div>}</div>{totalPages > 1 && <div className='flex justify-center items-center p-5 border-t'><div className='flex gap-2'>{currentPage > 1 && <button onClick={() => handlePageChange(currentPage - 1)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Previous</button>}<span className='m-3'>{"Page" + ` ${currentPage} ` + "of" + ` ${totalPages}`}</span>{currentPage < totalPages && <button onClick={() => handlePageChange(currentPage + 1)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Next</button>}</div></div>}{showResourceModal && <div className='fixed inset-0 !bg-black bg-opacity-50 flex items-center justify-center p-5 z-50'><div className='bg-white max-w-4xl max-h-full overflow-auto p-6 m-5 w-full'><div className='flex justify-between items-start m-3'>{selectedResource?.title && <h2 className='flex-1 m-2'>{selectedResource.title}</h2>}<button onClick={closeModal} className='!bg-red-700 !text-white p-3'>Close</button></div>{selectedResource && <div className='m-3'>{selectedResource.featured_image && <img src={`${selectedResource.featured_image}`} alt={selectedResource.title} className='w-full h-auto max-h-96 m-3' />}{selectedResource.category && <p className='text-blue-600 font-bold m-3'>{selectedResource.category}</p>}{selectedResource.author && <p className='m-3'>{"By" + ' ' + selectedResource.author}</p>}{selectedResource.published_date && <p className='text-gray-600 m-3'>{formatDate(selectedResource.published_date)}</p>}{selectedResource.content && <div className='m-3'><p>{sanitizeHtml(selectedResource.content)}</p></div>}{selectedResource.tags && <div className='flex flex-wrap gap-2 m-3'>{selectedResource.tags.split(',').map(tag => <span key={tag.trim()} className='!bg-green-100 text-green-800 p-2 text-sm font-medium'>{tag.trim()}</span>)}</div>}</div>}</div></div>}</div>;
};
EducationalResourcesView.displayName = 'EducationalResourcesView';
export default EducationalResourcesView;