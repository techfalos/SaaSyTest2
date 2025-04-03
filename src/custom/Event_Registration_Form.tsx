'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function EventRegistrationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  const [member, setMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
        const eventId = urlParams.get('EventsID');
        if (!eventId) {
          throw new Error('No event ID provided');
        }
        const eventResponse = await fetch(`/api/events?ID=${eventId}`);
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event details');
        }
        const eventData = await eventResponse.json();
        if (!eventData || eventData.length === 0) {
          throw new Error('Event not found');
        }
        setEvent(eventData[0]);
        const memberResponse = await fetch('/api/members');
        if (!memberResponse.ok) {
          throw new Error('Failed to fetch member details');
        }
        const memberData = await memberResponse.json();
        if (!memberData || memberData.length === 0) {
          throw new Error('No member found');
        }
        setMember(memberData[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const registration = {
        ID: crypto.randomUUID(),
        EventsID: event.ID,
        MembersID: member.ID,
        registration_date: new Date().toISOString().split('T')[0],
        status: 'registered'
      };
      const response = await fetch('/api/eventregistrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registration)
      });
      if (!response.ok) {
        throw new Error('Failed to register for event');
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return <div className='p-4'><p>Loading event information...</p></div>;
  }
  if (error) {
    return <div className='p-4'><p>{`Error: ${error}`}</p><button className='mt-4 p-2 border' onClick={() => window.history.back()}>Go Back</button></div>;
  }
  if (success) {
    return <div className='p-4'><h1>Registration Complete</h1><p className='my-4'>{`You have successfully registered for ${event.title}.`}</p><button className='mt-4 p-2 border' onClick={() => {
        router.push('/my_event_registrations');
      }}>View My Registrations</button></div>;
  }
  return <div className='p-4'><h1>Event Registration</h1><div className='mt-6 border-b pb-4'><h2 className='text-lg'>Event Information</h2><div className='mt-2'><p><span className='font-medium'>Title: </span>{event.title}</p><p className='mt-1'><span className='font-medium'>Date: </span>{`${new Date(event.start_date).toLocaleDateString()} to ${new Date(event.end_date).toLocaleDateString()}`}</p><p className='mt-1'><span className='font-medium'>Location: </span>{event.location}</p><p className='mt-1'><span className='font-medium'>Type: </span>{event.event_type}</p><p className='mt-2'>{event.description}</p></div></div><div className='mt-6 border-b pb-4'><h2 className='text-lg'>Your Information</h2><div className='mt-2 grid grid-cols-1 md:grid-cols-2 gap-4'><div><label className='block'>First Name</label><p className='border p-2 mt-1'>{member.first_name}</p></div><div><label className='block'>Last Name</label><p className='border p-2 mt-1'>{member.last_name}</p></div><div><label className='block'>Email</label><p className='border p-2 mt-1'>{member.email}</p></div><div><label className='block'>Phone</label><p className='border p-2 mt-1'>{member.phone || 'Not provided'}</p></div></div></div><div className='mt-6'><p>By submitting this registration, you confirm that you will attend this event.</p><div className='mt-4 flex items-center'><button className='p-2 border mr-4' onClick={handleSubmit} disabled={submitting}>{submitting ? 'Submitting...' : 'Register for Event'}</button><button className='p-2 border' onClick={() => window.history.back()} disabled={submitting}>Cancel</button></div></div></div>;
}