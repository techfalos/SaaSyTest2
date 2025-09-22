'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const ServicesCatalogView = function ServicesDisplay() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    available: '',
    min_price: '',
    max_price: ''
  });
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '12');
      if (filters.category) params.append('category', filters.category);
      if (filters.available) params.append('available', filters.available);
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);
      const response = await fetch(`/api/serviceslist?${params.toString()}`);
      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized access');
          return;
        }
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data.data || []);
      setTotalPages(data.totalpages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };
  const handleBookSession = serviceId => {
    router.push(`/book_session?servicesid=${serviceId}`);
  };
  const handlePageChange = page => {
    setCurrentPage(page);
  };
  if (loading) {
    return <div className='w-full flex items-center justify-center p-8'><div>Loading services...</div></div>;
  }
  if (error) {
    return <div className='w-full flex items-center justify-center p-8'><div className='text-red-600'>Error loading practitioners</div></div>;
  }
  return <div className='w-full p-4 sm:p-6 lg:p-8'><div className='mb-6 p-4 border rounded'><div className='flex flex-col lg:flex-row gap-4'><div className='m-5'><label className='block mb-2'>Category</label><select className='p-3 border w-full' value={filters.category} onChange={e => handleFilterChange('category', e.target.value)}><option value=''>All Categories</option><option value='individual'>Individual Sessions</option><option value='group'>Group Sessions</option><option value='corporate'>Corporate Programs</option><option value='specialized'>Specialized Treatments</option></select></div><div className='m-5'><label className='block mb-2'>Availability</label><select className='p-3 border w-full' value={filters.available} onChange={e => handleFilterChange('available', e.target.value)}><option value=''>All Availability</option><option value='true'>Available</option><option value='false'>Not Available</option></select></div><div className='m-5'><label className='block mb-2'>Min Price</label><input type='number' className='p-3 border w-full' placeholder='Min Price' value={filters.min_price} onChange={e => handleFilterChange('min_price', e.target.value)} /></div><div className='m-5'><label className='block mb-2'>Max Price</label><input type='number' className='p-3 border w-full' placeholder='Max Price' value={filters.max_price} onChange={e => handleFilterChange('max_price', e.target.value)} /></div></div></div>{services.length === 0 ? <div className='text-center p-8'><p>No services found matching your criteria.</p></div> : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>{services.map(service => <div key={service.id} className='border rounded p-4 w-full h-full flex flex-col'>{service.service_image && <img src={`${service.service_image}`} alt={service.name} className='w-full h-auto max-h-full mb-4 rounded' />}<h3 className='mb-2'>{service.name}</h3><div className='mb-2'><span className='bg-blue-100 text-blue-800 p-2 rounded text-sm'>{service.category}</span></div><p className='mb-3 flex-grow'>{service.description}</p>{service.benefits && <div className='mb-3'><p className='text-sm text-green-600 font-semibold mb-1'>Benefits:</p><p className='text-sm text-green-600'>{service.benefits}</p></div>}<div className='mb-4'><div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2'><span>{"Duration: " + service.duration + " minutes"}</span><span className='font-bold text-blue-600'>{new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(service.price)}</span></div><div className='mb-2'><span className={service.available ? 'text-green-600 bg-green-100 p-2 rounded text-sm' : 'text-red-600 bg-red-100 p-2 rounded text-sm'}>{service.available ? "Available" : "Currently Unavailable"}</span></div></div>{service.available && <button onClick={() => handleBookSession(service.id)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 hover:border-gray-400 mt-auto'>Book Session</button>}</div>)}</div>}{totalPages > 1 && <div className='flex justify-center items-center gap-2 mt-8'><button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={'border !text-gray-800 border-gray-300 !bg-transparent p-3' + (currentPage === 1 ? ' opacity-50' : '')}>Previous</button><span className='mx-4'>{"Page " + currentPage + " of " + totalPages}</span><button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={'border !text-gray-800 border-gray-300 !bg-transparent p-3' + (currentPage === totalPages ? ' opacity-50' : '')}>Next</button></div>}</div>;
};
ServicesCatalogView.displayName = 'ServicesCatalogView';
export default ServicesCatalogView;