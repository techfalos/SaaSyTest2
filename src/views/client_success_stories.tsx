'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedFeatured, setSelectedFeatured] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [services, setServices] = useState([]);
  const [authorized, setAuthorized] = useState(true);
  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedRating) params.append('rating', selectedRating);
      if (selectedFeatured) params.append('featured', selectedFeatured);
      if (selectedService) params.append('service_name', selectedService);
      params.append('page', currentPage);
      params.append('limit', '12');
      params.append('approved', 'true');
      const response = await fetch(`/api/testimonialslist?${params.toString()}`);
      if (response.status === 401) {
        setAuthorized(false);
        setError("You are not authorized to perform this action");
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      const data = await response.json();
      setTestimonials(data.data || []);
      setTotalPages(data.totalpages || 1);
      const uniqueServices = [...new Set(data.data?.filter(t => t.service_name).map(t => t.service_name) || [])];
      setServices(uniqueServices);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedRating, selectedFeatured, selectedService, currentPage]);
  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);
  const handleRatingFilter = rating => {
    setSelectedRating(selectedRating === rating ? '' : rating);
    setCurrentPage(1);
  };
  const handleFeaturedFilter = featured => {
    setSelectedFeatured(selectedFeatured === featured ? '' : featured);
    setCurrentPage(1);
  };
  const handleServiceFilter = service => {
    setSelectedService(selectedService === service ? '' : service);
    setCurrentPage(1);
  };
  const renderStars = rating => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i} className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>);
    }
    return stars;
  };
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString();
  };
  if (!authorized) {
    return <div className='w-full flex items-center justify-center p-8'><div className='text-center'><p className='text-red-600'>{error}</p></div></div>;
  }
  return <div className='w-full h-full flex flex-col'><div className='p-4 sm:p-6 lg:p-8'><h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4'>Client Testimonials</h1><p className='text-center mb-6 max-w-2xl mx-auto'>Discover the transformative power of sound healing through our clients' authentic experiences and wellness journeys.</p></div><div className='p-4 sm:p-6 lg:p-8 border-b'><div className='flex flex-col lg:flex-row gap-6 items-center justify-center'><div className='flex flex-col items-center'><span className='mb-3 font-medium'>Filter by Rating</span><div className='flex gap-2'>{[5, 4, 3].map(rating => <button key={rating} onClick={() => handleRatingFilter(rating.toString())} className={selectedRating === rating.toString() ? "border-2 border-blue-500 !text-black !bg-blue-100 p-3" : "border !text-gray-200 border-gray-600 !bg-transparent p-3 hover:border-gray-500"} aria-pressed={selectedRating === rating.toString()}>{`${rating}+ Stars`}</button>)}</div></div><div className='flex flex-col items-center'><span className='mb-3 font-medium'>Show Featured</span><button onClick={() => handleFeaturedFilter('true')} className={selectedFeatured === 'true' ? "border-2 border-blue-500 !text-black !bg-blue-100 p-3" : "border !text-gray-200 border-gray-600 !bg-transparent p-3 hover:border-gray-500"} aria-pressed={selectedFeatured === 'true'}>Featured Only</button></div>{services.length > 0 && <div className='flex flex-col items-center'><span className='mb-3 font-medium'>Filter by Service</span><div className='flex flex-wrap gap-2 justify-center max-w-md'>{services.map(service => <button key={service} onClick={() => handleServiceFilter(service)} className={selectedService === service ? "border-2 border-blue-500 !text-black !bg-blue-100 p-3" : "border !text-gray-200 border-gray-600 !bg-transparent p-3 hover:border-gray-500"} aria-pressed={selectedService === service}>{service}</button>)}</div></div>}{(selectedRating || selectedFeatured || selectedService) && <button onClick={() => {
          setSelectedRating('');
          setSelectedFeatured('');
          setSelectedService('');
          setCurrentPage(1);
        }} className='!bg-red-700 !text-white p-3'>Clear All</button>}</div></div><div className='flex-1 p-4 sm:p-6 lg:p-8'>{loading ? <div className='flex items-center justify-center h-full'><div className='text-center'><p>Loading testimonials...</p></div></div> : error ? <div className='flex items-center justify-center h-full'><div className='text-center'><p className='text-red-600'>{error}</p></div></div> : testimonials.length === 0 ? <div className='flex items-center justify-center h-full'><div className='text-center'><p>No testimonials found matching your criteria.</p></div></div> : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>{testimonials.map(testimonial => <div key={testimonial.id} className={`border p-6 flex flex-col h-full ${testimonial.featured ? 'border-2 border-yellow-400 bg-yellow-50' : ''}`}><div className='flex items-center mb-4'>{testimonial.client_photo && <img src={`data:image/jpeg;base64,${testimonial.client_photo}`} alt={`${testimonial.client_name} photo`} className='w-12 h-12 rounded-full mr-4 object-cover' />}<div><h3 className='font-semibold text-lg'>{testimonial.client_name}</h3>{testimonial.service_name && <p className='text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded inline-block mt-1'>{testimonial.service_name}</p>}</div></div>{testimonial.featured && <div className='mb-3'><span className='text-green-600 bg-green-100 font-semibold px-2 py-1 rounded text-sm'>FEATURED</span></div>}<div className='flex items-center mb-4'><div className='flex mr-2'>{renderStars(testimonial.rating)}</div><span className='font-bold text-yellow-600'>{`${testimonial.rating}/5`}</span></div><div className='flex-1 mb-4'><p className='leading-relaxed'>{testimonial.content}</p></div><div className='text-sm text-gray-600'>{formatDate(testimonial.date_given)}</div></div>)}</div>}</div>{totalPages > 1 && <div className='p-4 sm:p-6 lg:p-8 border-t'><div className='flex flex-col sm:flex-row items-center justify-center gap-4'><div className='flex items-center gap-2'><button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className='border !text-gray-200 border-gray-600 !bg-transparent p-3 disabled:opacity-50'>Previous</button><span className='px-4 font-medium'>{`${"Page"} ${currentPage} ${"of"} ${totalPages}`}</span><button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className='border !text-gray-200 border-gray-600 !bg-transparent p-3 disabled:opacity-50'>Next</button></div></div></div>}</div>;
}