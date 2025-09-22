'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const AppointmentBookingView = function BookingSystem() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPractitioner, setSelectedPractitioner] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [serviceFilters, setServiceFilters] = useState({
    category: '',
    min_price: '',
    max_price: ''
  });
  const [practitionerFilters, setPractitionerFilters] = useState({
    specialization: '',
    min_experience: ''
  });
  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];
  useEffect(() => {
    fetchServices();
  }, [serviceFilters]);
  useEffect(() => {
    if (selectedService) {
      fetchPractitioners();
    }
  }, [selectedService, practitionerFilters]);
  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('available', 'true');
      params.append('limit', '50');
      if (serviceFilters.category) params.append('category', serviceFilters.category);
      if (serviceFilters.min_price) params.append('min_price', serviceFilters.min_price);
      if (serviceFilters.max_price) params.append('max_price', serviceFilters.max_price);
      const response = await fetch(`/api/serviceslist?${params.toString()}`);
      if (response.status === 401) {
        setError('Authorization required');
        setShowModal(true);
        setModalContent('Please log in to access booking services');
        return;
      }
      const data = await response.json();
      setServices(data.data || []);
    } catch (err) {
      setError('Failed to load services');
      setShowModal(true);
      setModalContent('Unable to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const fetchPractitioners = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('available', 'true');
      params.append('limit', '50');
      if (practitionerFilters.specialization) params.append('specialization', practitionerFilters.specialization);
      if (practitionerFilters.min_experience) params.append('min_experience', practitionerFilters.min_experience);
      const response = await fetch(`/api/practitionerslist?${params.toString()}`);
      if (response.status === 401) {
        setError('Authorization required');
        setShowModal(true);
        setModalContent('Please log in to view practitioners');
        return;
      }
      const data = await response.json();
      setPractitioners(data.data || []);
    } catch (err) {
      setError('Failed to load practitioners');
      setShowModal(true);
      setModalContent('Unable to load practitioners. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleServiceSelect = service => {
    setSelectedService(service);
    setCurrentStep(2);
  };
  const handlePractitionerSelect = practitioner => {
    setSelectedPractitioner(practitioner);
    setCurrentStep(3);
  };
  const handleDateSelect = date => {
    setSelectedDate(date);
    setCurrentStep(4);
  };
  const handleTimeSelect = time => {
    setSelectedTime(time);
    setCurrentStep(5);
  };
  const createBooking = async () => {
    if (!selectedService || !selectedPractitioner || !selectedDate || !selectedTime) {
      setError('Please complete all booking details');
      setShowModal(true);
      setModalContent('All fields are required to complete your booking');
      return;
    }
    setLoading(true);
    try {
      const bookingData = {
        servicesid: selectedService.id,
        practitionersid: selectedPractitioner.id,
        session_date: selectedDate,
        session_time: selectedTime,
        duration: selectedService.duration,
        status: 'scheduled',
        price: selectedService.price
      };
      const response = await fetch('/api/sessionscreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
      if (response.status === 401) {
        setError('Authorization required');
        setShowModal(true);
        setModalContent('Please log in to complete your booking');
        return;
      }
      const result = await response.json();
      setSuccess('Booking created successfully!');
      setShowModal(true);
      setModalContent('Your session has been booked successfully! Redirecting to payment...');
      setTimeout(() => {
        router.push(`/terms_of_service?sessionsid=${result.id}`);
      }, 2000);
    } catch (err) {
      setError('Failed to create booking');
      setShowModal(true);
      setModalContent('Unable to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  const closeModal = () => {
    setShowModal(false);
    setModalContent('');
    setError('');
    setSuccess('');
  };
  const resetBooking = () => {
    setCurrentStep(1);
    setSelectedService(null);
    setSelectedPractitioner(null);
    setSelectedDate('');
    setSelectedTime('');
  };
  return <div className='w-full min-h-screen p-4 sm:p-6 md:p-8 lg:p-10'><div className='mb-8'><h1 className='mb-6'>Book Your Sound Healing Session</h1><div className='flex flex-col sm:flex-row justify-between items-center mb-6'><div className='flex items-center space-x-2 sm:space-x-4 mb-4 sm:mb-0'><div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200'}`}>1</div><div className='h-0.5 w-4 sm:w-8 bg-gray-300' /><div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200'}`}>2</div><div className='h-0.5 w-4 sm:w-8 bg-gray-300' /><div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200'}`}>3</div><div className='h-0.5 w-4 sm:w-8 bg-gray-300' /><div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 4 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200'}`}>4</div><div className='h-0.5 w-4 sm:w-8 bg-gray-300' /><div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 5 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200'}`}>5</div></div><button onClick={resetBooking} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Start Over</button></div></div>{currentStep === 1 && <div className='mb-8'><h2 className='mb-6'>Select Your Service</h2><div className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6'><div className='lg:col-span-1'><h3 className='mb-4'>Filter Services</h3><input type='text' placeholder='Category' value={serviceFilters.category} onChange={e => setServiceFilters({
            ...serviceFilters,
            category: e.target.value
          })} className='m-5 p-3 border border-gray-300' /><input type='number' placeholder='Min Price' value={serviceFilters.min_price} onChange={e => setServiceFilters({
            ...serviceFilters,
            min_price: e.target.value
          })} className='m-5 p-3 border border-gray-300' /><input type='number' placeholder='Max Price' value={serviceFilters.max_price} onChange={e => setServiceFilters({
            ...serviceFilters,
            max_price: e.target.value
          })} className='m-5 p-3 border border-gray-300' /></div><div className='lg:col-span-3'>{loading && <div className='text-center p-8'>Loading services...</div>}{!loading && services.length === 0 && <div className='text-center p-8'>No services found matching your criteria.</div>}{!loading && services.length > 0 && <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>{services.map(service => <div key={service.id} className='border border-gray-300 p-6 cursor-pointer hover:border-gray-400 w-full h-full' onClick={() => handleServiceSelect(service)}>{service.service_image && <img src={`${service.service_image}`} alt={service.name} className='w-full h-auto max-w-full max-h-full mb-4' />}<h3 className='mb-3'>{service.name}</h3><p className='mb-3'>{service.description}</p><div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3'><span className='text-blue-600 font-bold mb-2 sm:mb-0'>{formatCurrency(service.price)}</span><span className='bg-blue-100 text-blue-800 font-medium px-2 py-1'>{`${service.duration} min`}</span></div>{service.benefits && <p className='text-green-600 bg-green-100 p-2'>{service.benefits}</p>}{service.category && <div className='mt-3'><span className='bg-gray-100 text-gray-800 px-2 py-1'>{service.category}</span></div>}</div>)}</div>}</div></div></div>}{currentStep === 2 && <div className='mb-8'><h2 className='mb-6'>Select Your Practitioner</h2><button onClick={() => setCurrentStep(1)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 mb-6'>Back to Services</button><div className='grid grid-cols-1 lg:grid-cols-4 gap-6'><div className='lg:col-span-1'><h3 className='mb-4'>Filter Practitioners</h3><input type='text' placeholder='Specialization' value={practitionerFilters.specialization} onChange={e => setPractitionerFilters({
            ...practitionerFilters,
            specialization: e.target.value
          })} className='m-5 p-3 border border-gray-300' /><input type='number' placeholder='Min Experience (years)' value={practitionerFilters.min_experience} onChange={e => setPractitionerFilters({
            ...practitionerFilters,
            min_experience: e.target.value
          })} className='m-5 p-3 border border-gray-300' /></div><div className='lg:col-span-3'>{loading && <div className='text-center p-8'>Loading practitioners...</div>}{!loading && practitioners.length === 0 && <div className='text-center p-8'>No practitioners found matching your criteria</div>}{!loading && practitioners.length > 0 && <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>{practitioners.map(practitioner => <div key={practitioner.id} className='border border-gray-300 p-6 cursor-pointer hover:border-gray-400 w-full h-full' onClick={() => handlePractitionerSelect(practitioner)}>{practitioner.profile_image && <img src={`${practitioner.profile_image}`} alt={practitioner.name} className='w-full h-auto max-w-full max-h-full mb-4' />}<h3 className='mb-3'>{practitioner.name}</h3><p className='mb-3'>{practitioner.bio}</p>{practitioner.specializations && <p className='text-blue-600 bg-blue-100 p-2 mb-3'>{practitioner.specializations}</p>}{practitioner.certifications && <p className='text-green-600 mb-3'>{practitioner.certifications}</p>}{practitioner.experience_years && <p className='text-orange-600 bg-orange-100 px-2 py-1'>{`${practitioner.experience_years} years experience`}</p>}</div>)}</div>}</div></div></div>}{currentStep === 3 && <div className='mb-8'><h2 className='mb-6'>Select Date</h2><button onClick={() => setCurrentStep(2)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 mb-6'>Back to Practitioners</button><div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4'>{generateCalendarDates().map(date => {
          const dateObj = new Date(date);
          const isSelected = selectedDate === date;
          return <button key={date} onClick={() => handleDateSelect(date)} className={isSelected ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 hover:border-gray-400'}><div className='text-center'><div className='font-bold'>{dateObj.getDate()}</div><div className='text-sm'>{dateObj.toLocaleDateString('en-US', {
                  weekday: 'short'
                })}</div></div></button>;
        })}</div></div>}{currentStep === 4 && <div className='mb-8'><h2 className='mb-6'>Select Time</h2><button onClick={() => setCurrentStep(3)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 mb-6'>Back to Date</button><div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>{timeSlots.map(time => <button key={time} onClick={() => handleTimeSelect(time)} className={selectedTime === time ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 hover:border-gray-400'}>{time}</button>)}</div></div>}{currentStep === 5 && <div className='mb-8'><h2 className='mb-6'>Confirm Your Booking</h2><button onClick={() => setCurrentStep(4)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 mb-6'>Back to Time</button><div className='grid grid-cols-1 lg:grid-cols-2 gap-6'><div className='border border-gray-300 p-6'><h3 className='mb-4'>Booking Summary</h3>{selectedService && <div className='mb-4'><div className='mb-2'><strong>Service: </strong>{selectedService.name}</div><div className='text-blue-600 font-bold mb-2'>{formatCurrency(selectedService.price)}</div><div className='text-gray-600'>{selectedService.description}</div></div>}{selectedPractitioner && <div className='mb-4'><div className='mb-2'><strong>Practitioner: </strong>{selectedPractitioner.name}</div><div className='text-gray-600'>{selectedPractitioner.bio}</div></div>}<div className='mb-4'><strong>Date: </strong>{new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</div><div className='mb-4'><strong>Time: </strong>{selectedTime}</div><div className='mb-4'><strong>Duration: </strong>{`${selectedService?.duration} minutes`}</div></div><div className='border border-gray-300 p-6'><h3 className='mb-4'>Session Preparation</h3><p className='mb-4'>Please arrive 10 minutes early for your session. Wear comfortable clothing and bring water.</p><h4 className='mb-2'>What to Expect</h4><p className='mb-4'>Your sound healing session will include guided relaxation and therapeutic sound vibrations for wellness and healing.</p><div className='bg-yellow-100 text-yellow-800 p-3'><strong>Total Cost: </strong>{formatCurrency(selectedService?.price || 0)}</div></div></div><div className='flex justify-center mt-8'><button onClick={createBooking} disabled={loading} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-5'>{loading ? "Creating..." : "Confirm Booking"}</button></div></div>}{showModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' onClick={closeModal}><div className='bg-white p-6 m-4 max-w-md w-full' onClick={e => e.stopPropagation()}><p className='mb-6'>{modalContent}</p><div className='flex justify-end'><button onClick={closeModal} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Close</button></div></div></div>}</div>;
};
AppointmentBookingView.displayName = 'AppointmentBookingView';
export default AppointmentBookingView;