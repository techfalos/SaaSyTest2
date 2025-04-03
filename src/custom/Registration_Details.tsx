'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function EventRegistrationDetails() {
  const router = useRouter();
  const [registration, setRegistration] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
        const registrationId = urlParams.get('ID');
        if (!registrationId) {
          throw new Error('Registration ID is required');
        }
        const regResponse = await fetch(`/api/eventregistrations?ID=${registrationId}`);
        if (!regResponse.ok) {
          throw new Error('Failed to fetch registration data');
        }
        const regData = await regResponse.json();
        if (!regData.length) {
          throw new Error('Registration not found');
        }
        const regDetails = regData[0];
        setRegistration(regDetails);
        const eventResponse = await fetch(`/api/events?ID=${regDetails.EventsID}`);
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event data');
        }
        const eventData = await eventResponse.json();
        if (!eventData.length) {
          throw new Error('Event not found');
        }
        setEvent(eventData[0]);
        setNewStatus(regDetails.status);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const formatDate = dateString => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };
  const updateRegistrationStatus = async () => {
    try {
      if (!registration) return;
      const response = await fetch(`/api/eventregistrations/${registration.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...registration,
          status: newStatus
        })
      });
      if (!response.ok) {
        throw new Error('Failed to update registration status');
      }
      setRegistration({
        ...registration,
        status: newStatus
      });
      setModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };
  const cancelRegistration = async () => {
    try {
      if (!registration) return;
      const response = await fetch(`/api/eventregistrations/${registration.ID}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to cancel registration');
      }
      router.push('/my_event_registrations');
    } catch (err) {
      setError(err.message);
    }
  };
  const viewEventDetails = () => {
    if (!event) return;
    router.push(`/event_details?EventsID=${event.ID}`);
  };
  if (loading) {
    return <div className='p-4'><h1 className='mb-4'>Loading event registration details...</h1></div>;
  }
  if (error) {
    return <div className='p-4'><h1 className='mb-4'>Error</h1><p>{error}</p></div>;
  }
  if (!registration || !event) {
    return <div className='p-4'><h1 className='mb-4'>Registration not found</h1></div>;
  }
  return <div className='p-4'><h1 className='mb-6'>Event Registration Details</h1><div className='mb-6 p-4 border border-gray-300 rounded'><h1 className='mb-2'>{event.title}</h1><div className='mb-2'><span className='mr-2'>When:</span><span>{`${formatDate(event.start_date)} to ${formatDate(event.end_date)}`}</span></div><div className='mb-2'><span className='mr-2'>Where:</span><span>{event.location}</span></div><div className='mb-4'><span className='mr-2'>Event Type:</span><span>{event.event_type}</span></div>{event.event_image && <div className='mb-4'><img src={`data:image/jpeg;base64,${event.event_image}`} alt={event.title} className='rounded'>{null}</img></div>}<div className='mb-4'><p>{event.description}</p></div><button onClick={viewEventDetails} className='p-2 border border-gray-300 rounded mb-2'>View Full Event Details</button></div><div className='mb-6 p-4 border border-gray-300 rounded'><h1 className='mb-4'>Registration Information</h1><div className='mb-2'><span className='mr-2'>Registration ID:</span><span>{registration.ID}</span></div><div className='mb-2'><span className='mr-2'>Registration Date:</span><span>{formatDate(registration.registration_date)}</span></div><div className='mb-4'><span className='mr-2'>Status:</span><span>{registration.status}</span></div><div className='flex gap-2'><button onClick={() => setModalOpen(true)} className='p-2 border border-gray-300 rounded'>Update Status</button><button onClick={cancelRegistration} className='p-2 border border-gray-300 rounded'>Cancel Registration</button></div></div>{modalOpen && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 rounded max-w-md w-full'><h1 className='mb-4'>Update Registration Status</h1><div className='mb-4'><label className='block mb-2'>Status:</label><select value={newStatus} onChange={e => setNewStatus(e.target.value)} className='w-full p-2 border border-gray-300 rounded'><option value='Registered'>Registered</option><option value='Confirmed'>Confirmed</option><option value='Attended'>Attended</option><option value='Cancelled'>Cancelled</option></select></div><div className='flex justify-end gap-2'><button onClick={() => setModalOpen(false)} className='p-2 border border-gray-300 rounded'>Cancel</button><button onClick={updateRegistrationStatus} className='p-2 border border-gray-300 rounded'>Save</button></div></div></div>}</div>;
}