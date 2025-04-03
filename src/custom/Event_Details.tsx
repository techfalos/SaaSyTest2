'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function EventDetails() {
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isRegistrationLoading, setIsRegistrationLoading] = useState(true);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    event_type: '',
    event_image: null
  });
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const eventId = urlParams.get('EventsID');
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setIsAdmin(true);
        setUserId("sample-user-id");
      } catch (err) {
        console.error("Error checking user role:", err);
      }
    };
    checkUserRole();
  }, []);
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setError("No event ID provided");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/events?ID=${eventId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.length > 0) {
          setEvent(data[0]);
          setEditFormData({
            title: data[0].title,
            description: data[0].description,
            start_date: data[0].start_date,
            end_date: data[0].end_date,
            location: data[0].location,
            event_type: data[0].event_type,
            event_image: data[0].event_image
          });
        } else {
          setError("Event not found");
        }
      } catch (err) {
        setError(`Failed to fetch event: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);
  useEffect(() => {
    const fetchRegistration = async () => {
      if (!eventId || !userId) {
        setIsRegistrationLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/eventregistrations');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        const userRegistration = data.find(reg => reg.EventsID === eventId && reg.MembersID === userId);
        if (userRegistration) {
          setRegistration(userRegistration);
        }
      } catch (err) {
        console.error("Failed to fetch registration status:", err);
      } finally {
        setIsRegistrationLoading(false);
      }
    };
    fetchRegistration();
  }, [eventId, userId]);
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setEditFormData(prev => ({
          ...prev,
          event_image: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ID: eventId,
          ...editFormData
        })
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      setEvent({
        ...event,
        ...editFormData
      });
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update event:", err);
      alert(`Failed to update event: ${err.message}`);
    }
  };
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      router.push('/events');
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert(`Failed to delete event: ${err.message}`);
    }
  };
  const handleRegister = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const newRegistration = {
        ID: crypto.randomUUID(),
        EventsID: eventId,
        MembersID: userId,
        registration_date: today,
        status: "registered"
      };
      const response = await fetch('/api/eventregistrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRegistration)
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setRegistration(data);
      alert("You have successfully registered for this event!");
    } catch (err) {
      console.error("Failed to register for event:", err);
      alert(`Failed to register: ${err.message}`);
    }
  };
  if (loading) {
    return <div className='p-4'><p>Loading event details...</p></div>;
  }
  if (error) {
    return <div className='p-4'><p>{`Error: ${error}`}</p></div>;
  }
  if (!event) {
    return <div className='p-4'><p>Event not found</p></div>;
  }
  const formatDate = dateString => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return <div className='p-4'><div className='mb-6'><h1 className='mb-4'>{event.title}</h1>{event.event_image ? <div className='mb-4'><img src={event.event_image.startsWith('data:') ? event.event_image : `data:image/jpeg;base64,${event.event_image}`} alt={event.title} className='mb-4' /></div> : <p className='mb-4'>Image not found</p>}<div className='mb-4'><p className='mb-2'><strong>Date: </strong>{`${formatDate(event.start_date)} to ${formatDate(event.end_date)}`}</p><p className='mb-2'><strong>Location: </strong>{event.location}</p><p className='mb-2'><strong>Event Type: </strong>{event.event_type}</p><div className='mt-4'><strong>Description:</strong><p className='mt-1'>{event.description}</p></div></div></div>{isAdmin && <div className='mt-6 mb-6'><div className='flex mb-4'><button className='mr-4 p-2 border' onClick={() => setShowEditModal(true)}>Edit Event</button><button className='p-2 border' onClick={() => setShowDeleteModal(true)}>Delete Event</button></div></div>}{userId && !isRegistrationLoading && !isAdmin && <div className='mt-6'>{!registration ? <button className='p-2 border' onClick={handleRegister}>Register for Event</button> : <div className='p-4 border'><p>Registration Status: <strong>{registration.status.toUpperCase()}</strong></p><p>Registered on: {formatDate(registration.registration_date)}</p></div>}</div>}<div className='mt-6'><button className='p-2 border' onClick={() => router.push('/events')}>Back to Events</button></div>{showEditModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4' style={{
      zIndex: 100
    }}><div className='bg-white p-6 border max-w-2xl w-full'><h2 className='mb-4'>Edit Event</h2><div className='mb-4'><label className='block mb-1'>Title:</label><input type='text' name='title' value={editFormData.title} onChange={handleInputChange} className='w-full p-2 border mb-4' /><label className='block mb-1'>Description:</label><textarea name='description' value={editFormData.description} onChange={handleInputChange} className='w-full p-2 border mb-4' rows={4} /><label className='block mb-1'>Start Date:</label><input type='datetime-local' name='start_date' value={editFormData.start_date.substring(0, 16)} onChange={handleInputChange} className='w-full p-2 border mb-4' /><label className='block mb-1'>End Date:</label><input type='datetime-local' name='end_date' value={editFormData.end_date.substring(0, 16)} onChange={handleInputChange} className='w-full p-2 border mb-4' /><label className='block mb-1'>Location:</label><input type='text' name='location' value={editFormData.location} onChange={handleInputChange} className='w-full p-2 border mb-4' /><label className='block mb-1'>Event Type:</label><input type='text' name='event_type' value={editFormData.event_type} onChange={handleInputChange} className='w-full p-2 border mb-4' /><label className='block mb-1'>Event Image:</label><input type='file' onChange={handleImageUpload} className='w-full p-2 border mb-4' />{editFormData.event_image && <img src={editFormData.event_image.startsWith('data:') ? editFormData.event_image : `data:image/jpeg;base64,${editFormData.event_image}`} alt='Event preview' className='mb-4' style={{
            maxHeight: '200px'
          }} />}</div><div className='flex justify-end'><button className='mr-2 p-2 border' onClick={() => setShowEditModal(false)}>Cancel</button><button className='p-2 border' onClick={handleEditSubmit}>Save Changes</button></div></div></div>}{showDeleteModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4' style={{
      zIndex: 100
    }}><div className='bg-white p-6 border max-w-md w-full'><h2 className='mb-4'>Confirm Deletion</h2><p className='mb-6'>Are you sure you want to delete this event? This action cannot be undone.</p><div className='flex justify-end'><button className='mr-2 p-2 border' onClick={() => setShowDeleteModal(false)}>Cancel</button><button className='p-2 border' onClick={handleDelete}>Delete Event</button></div></div></div>}</div>;
}