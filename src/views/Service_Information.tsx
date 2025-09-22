'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const ServiceInformationView = function ServiceDetailView() {
  const router = useRouter();
  const [service, setService] = useState(null);
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const servicesid = urlParams.get('servicesid');
    if (servicesid) {
      fetchServiceDetails(servicesid);
      fetchPractitioners();
    }
  }, []);
  const fetchServiceDetails = async id => {
    try {
      const response = await fetch(`/api/servicesget?id=${id}`);
      if (response.status === 401) {
        setUnauthorized(true);
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setService(data);
      } else {
        setError("Failed to load service details");
      }
    } catch (err) {
      setError("Failed to load service details");
    } finally {
      setLoading(false);
    }
  };
  const fetchPractitioners = async () => {
    try {
      const response = await fetch('/api/practitionerslist?available=true&page=1&limit=6');
      if (response.status === 401) {
        setUnauthorized(true);
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setPractitioners(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch practitioners');
    }
  };
  const handleBookSession = () => {
    if (unauthorized) {
      setShowBookingModal(true);
      return;
    }
    router.push(`/book_session?servicesid=${service.id}`);
  };
  const handlePractitionerClick = practitionerId => {
    router.push(`/practitioner_profile?practitionersid=${practitionerId}`);
  };
  const formatPrice = price => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  if (loading) {
    return <div className='w-full h-full flex items-center justify-center'><div>Loading service details...</div></div>;
  }
  if (error || !service) {
    return <div className='w-full h-full flex items-center justify-center'><div>{error || "Service not found"}</div></div>;
  }
  return <div className='w-full min-h-full'><div className='max-w-full mx-auto p-4 lg:p-8'><div className='flex flex-col lg:flex-row gap-8 mb-8'>{service.service_image && <div className='flex-1'><img src={`${service.service_image}`} alt={service.name} className='w-full h-auto max-h-full border border-gray-300' /></div>}<div className='flex-1'><h1 className='mb-4'>{service.name}</h1><div className='mb-6'><span className='text-blue-600 font-bold text-2xl'>{formatPrice(service.price)}</span><span className='ml-3 text-gray-600'>{`${service.duration} ${" minutes"}`}</span></div>{service.category && <div className='mb-4'><span className='bg-blue-100 text-blue-800 p-2 border border-blue-300 font-medium'>{service.category}</span></div>}<div className='mb-6'><p>{service.description}</p></div>{service.available && <button onClick={handleBookSession} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-2 w-full lg:w-auto'>Book Session</button>}{!service.available && <div className='text-red-600 font-semibold p-3'>Currently Unavailable</div>}</div></div>{service.benefits && <div className='mb-8'><h2 className='mb-4'>Benefits</h2><div className='border border-gray-300 p-6'><p>{service.benefits}</p></div></div>}{practitioners.length > 0 && <div className='mb-8'><h2 className='mb-6'>Our Practitioners</h2><div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>{practitioners.map((practitioner, index) => <div key={practitioner.id} className='border border-gray-300 p-6 w-full h-full'>{practitioner.profile_image && <div className='mb-4'><img src={`${practitioner.profile_image}`} alt={practitioner.name} className='w-full h-auto max-h-full border border-gray-300' /></div>}<h3 className='mb-2'>{practitioner.name}</h3>{practitioner.specializations && <div className='mb-2'><span className='text-green-600 font-medium'>{practitioner.specializations}</span></div>}{practitioner.experience_years && <div className='mb-3 text-gray-600'>{`${practitioner.experience_years} ${"years of experience"}`}</div>}<p className='mb-4 text-gray-700'>{practitioner.bio}</p><button onClick={() => handlePractitionerClick(practitioner.id)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 w-full'>View Profile</button></div>)}</div></div>}<div className='mb-8'><h2 className='mb-6'>Client Testimonials</h2><div className='grid grid-cols-1 lg:grid-cols-2 gap-6'><div className='border border-gray-300 p-6'><p className='mb-4 text-gray-700'>The sound healing session was transformative. I felt a deep sense of peace and clarity that lasted for days.</p><div className='text-green-600 font-medium'>- Sarah M.</div></div><div className='border border-gray-300 p-6'><p className='mb-4 text-gray-700'>I've been struggling with anxiety and this service helped me find inner calm. Highly recommend!</p><div className='text-green-600 font-medium'>- Michael R.</div></div><div className='border border-gray-300 p-6'><p className='mb-4 text-gray-700'>The healing vibrations helped release tension I didn't even know I was holding. Amazing experience.</p><div className='text-green-600 font-medium'>- Emma T.</div></div><div className='border border-gray-300 p-6'><p className='mb-4 text-gray-700'>Professional service with incredible results. I feel more balanced and centered after each session.</p><div className='text-green-600 font-medium'>- David L.</div></div></div></div><div className='mb-8'><h2 className='mb-4'>What to Expect</h2><div className='border border-gray-300 p-6'><div className='grid grid-cols-1 lg:grid-cols-3 gap-6'><div><h3 className='mb-2 text-blue-600 font-semibold'>Preparation</h3><p>Arrive 10 minutes early. Wear comfortable clothing and bring an open mind.</p></div><div><h3 className='mb-2 text-blue-600 font-semibold'>During Session</h3><p>Lie comfortably while healing sounds and vibrations work to restore your natural balance.</p></div><div><h3 className='mb-2 text-blue-600 font-semibold'>After Session</h3><p>Take time to integrate the experience. Stay hydrated and be gentle with yourself.</p></div></div></div></div><div className='mb-8'><h2 className='mb-4'>Additional Information</h2><div className='border border-gray-300 p-6'><div className='grid grid-cols-1 lg:grid-cols-2 gap-6'><div><h3 className='mb-2 font-medium'>Session Includes</h3><ul className='list-disc list-inside text-gray-700'><li>Personal consultation</li><li>Customized sound healing treatment</li><li>Integration guidance</li><li>Take-home wellness tips</li></ul></div><div><h3 className='mb-2 font-medium'>Booking Policy</h3><ul className='list-disc list-inside text-gray-700'><li>24-hour cancellation policy</li><li>Please arrive on time</li><li>Consultation included in session</li><li>Packages available for multiple sessions</li></ul></div></div></div></div>{service.available && <div className='text-center mb-8'><div className='border border-gray-300 p-8'><h2 className='mb-4'>Ready to Begin Your Healing Journey?</h2><p className='mb-6 text-gray-700'>Discover the ancient art of sound healing and experience profound relaxation, stress relief, and inner harmony. Our certified practitioners guide you on a journey toward holistic wellness through therapeutic vibrations and healing frequencies.</p><button onClick={handleBookSession} className='border !text-gray-800 border-gray-300 !bg-transparent p-4 text-lg font-semibold'>Book Now</button></div></div>}</div>{showBookingModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-8 border border-gray-300 max-w-md w-full m-4'><h3 className='mb-4'>Authentication Required</h3><p className='mb-6'>Please log in to book a session.</p><button onClick={() => setShowBookingModal(false)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 w-full'>Close</button></div></div>}</div>;
};
ServiceInformationView.displayName = 'ServiceInformationView';
export default ServiceInformationView;