'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [practitioner, setPractitioner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    servicesid: '',
    session_date: '',
    session_time: '',
    duration: 60,
    status: 'pending',
    notes: '',
    price: 0
  });
  const [bookingStatus, setBookingStatus] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(true);
  useEffect(() => {
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const practitionersid = urlParams.get('practitionersid');
    if (practitionersid) {
      fetch(`/api/practitionersget?id=${practitionersid}`).then(response => {
        if (response.status === 401) {
          setIsAuthorized(false);
          return null;
        }
        return response.json();
      }).then(data => {
        if (data) {
          setPractitioner(data);
        }
        setLoading(false);
      }).catch(error => {
        console.error('Error fetching practitioner:', error);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);
  const handleBookingSubmit = () => {
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const practitionersid = urlParams.get('practitionersid');
    const sessionData = {
      ...bookingData,
      practitionersid: practitionersid
    };
    fetch('/api/sessionscreate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sessionData)
    }).then(response => {
      if (response.status === 401) {
        setBookingStatus("Please log in to book a session");
        return null;
      }
      return response.json();
    }).then(data => {
      if (data) {
        setBookingStatus("Session booked successfully!");
        setShowBookingModal(false);
        setBookingData({
          servicesid: '',
          session_date: '',
          session_time: '',
          duration: 60,
          status: 'pending',
          notes: '',
          price: 0
        });
      }
    }).catch(error => {
      console.error('Error booking session:', error);
      setBookingStatus("Error booking session. Please try again.");
    });
  };
  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  if (loading) {
    return <div className='w-full flex justify-center items-center p-8'>Loading practitioner profile...</div>;
  }
  if (!practitioner) {
    return <div className='w-full flex justify-center items-center p-8'>Practitioner not found</div>;
  }
  return <div className='w-full'><div className='p-4 sm:p-6 md:p-8 lg:p-12'><div className='flex flex-col lg:flex-row items-start m-5'>{practitioner.profile_image && <div className='w-full lg:w-1/3 m-5'><img src={`data:image/jpeg;base64,${practitioner.profile_image}`} alt={practitioner.name} className='w-full h-auto max-w-full max-h-full' /></div>}<div className='w-full lg:w-2/3 m-5'><h1 className='text-4xl font-bold m-3'>{practitioner.name}</h1>{practitioner.specializations && <div className='m-3'><h2 className='text-xl font-semibold m-2'>Specializations</h2><p className='text-blue-600 font-medium'>{practitioner.specializations}</p></div>}{practitioner.experience_years && <div className='m-3'><p className='font-medium'>{`${practitioner.experience_years} ${"years of experience"}`}</p></div>}<div className='m-3'><span className={`font-semibold ${practitioner.available ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} p-2`}>{practitioner.available ? "Available" : "Currently Unavailable"}</span></div>{isAuthorized && practitioner.available && <div className='m-5'><button onClick={() => setShowBookingModal(true)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Book Session</button></div>}</div></div>{practitioner.bio && <div className='m-5'><h2 className='text-2xl font-semibold m-3'>Biography</h2><p className='text-lg leading-relaxed m-3'>{practitioner.bio}</p></div>}{practitioner.certifications && <div className='m-5'><h2 className='text-2xl font-semibold m-3'>Certifications & Training</h2><p className='text-lg m-3'>{practitioner.certifications}</p></div>}<div className='m-5'><h2 className='text-2xl font-semibold m-3'>Healing Philosophy & Approach</h2><p className='text-lg leading-relaxed m-3'>Through the power of sound vibrations and frequency healing, I guide clients on transformative journeys toward wellness and inner harmony. My approach combines ancient wisdom with modern techniques to create personalized healing experiences that address mind, body, and spirit.</p></div>{(practitioner.email || practitioner.phone) && <div className='m-5'><h2 className='text-2xl font-semibold m-3'>Contact Information</h2>{practitioner.email && <p className='m-3'>{`${"Email"}: ${practitioner.email}`}</p>}{practitioner.phone && <p className='m-3'>{`${"Phone"}: ${practitioner.phone}`}</p>}</div>}<div className='m-5'><h2 className='text-2xl font-semibold m-3'>Client Testimonials</h2><div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-3'><div className='p-4 border'><p className='italic m-2'>The sound healing session was transformative. I felt a deep sense of peace and clarity that lasted for days.</p><p className='font-medium text-right m-2'>- Sarah M.</p></div><div className='p-4 border'><p className='italic m-2'>I've been struggling with anxiety and this service helped me find inner calm. Highly recommend!</p><p className='font-medium text-right m-2'>- Michael R.</p></div><div className='p-4 border'><p className='italic m-2'>The healing vibrations helped release tension I didn't even know I was holding. Amazing experience.</p><p className='font-medium text-right m-2'>- Emma T.</p></div></div></div></div>{showBookingModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50' onClick={e => {
      if (e.target === e.currentTarget) {
        setShowBookingModal(false);
      }
    }}><div className='bg-white p-8 max-w-md w-full max-h-full overflow-auto'><h2 className='text-xl font-semibold m-3'>Book a Session</h2><div className='m-5'><label className='block font-medium m-2'>Service: </label><input type='text' value={bookingData.servicesid} onChange={e => handleInputChange('servicesid', e.target.value)} className='w-full border p-3 m-2' /></div><div className='m-5'><label className='block font-medium m-2'>Date: </label><input type='date' value={bookingData.session_date} onChange={e => handleInputChange('session_date', e.target.value)} className='w-full border p-3 m-2' /></div><div className='m-5'><label className='block font-medium m-2'>Time: </label><input type='time' value={bookingData.session_time} onChange={e => handleInputChange('session_time', e.target.value)} className='w-full border p-3 m-2' /></div><div className='m-5'><label className='block font-medium m-2'>Duration: </label><input type='number' value={bookingData.duration} onChange={e => handleInputChange('duration', parseInt(e.target.value))} className='w-full border p-3 m-2' /></div><div className='m-5'><label className='block font-medium m-2'>Price</label><input type='number' value={bookingData.price} onChange={e => handleInputChange('price', parseFloat(e.target.value))} className='w-full border p-3 m-2' /></div><div className='m-5'><label className='block font-medium m-2'>Notes (Optional)</label><textarea value={bookingData.notes} onChange={e => handleInputChange('notes', e.target.value)} className='w-full border p-3 m-2' rows={3} /></div><div className='flex flex-col sm:flex-row justify-end m-5'><button onClick={() => setShowBookingModal(false)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-2'>Cancel</button><button onClick={handleBookingSubmit} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-2'>Book</button></div></div></div>}{bookingStatus && <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50' onClick={() => setBookingStatus('')}><div className='bg-white p-8 max-w-md w-full'><p className='m-3'>{bookingStatus}</p><button onClick={() => setBookingStatus('')} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-3'>Close</button></div></div>}</div>;
}