'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function UpcomingEvents() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMemberId, setCurrentMemberId] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const memberData = JSON.parse(typeof localStorage === 'undefined' ? '' : localStorage.getItem('memberData') || '{}');
        const memberId = memberData.id;
        if (!memberId) {
          setError('User information not found. Please log in again.');
          setLoading(false);
          return;
        }
        setCurrentMemberId(memberId);
        const today = new Date().toISOString();
        const eventsResponse = await fetch('/api/events');
        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch events');
        }
        const eventsData = await eventsResponse.json();
        const futureEvents = eventsData.filter(event => new Date(event.start_date) > new Date()).sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        const registrationsResponse = await fetch('/api/eventregistrations');
        if (!registrationsResponse.ok) {
          throw new Error('Failed to fetch registrations');
        }
        const registrationsData = await registrationsResponse.json();
        const userRegs = registrationsData.filter(reg => reg.MembersID === memberId);
        setUserRegistrations(userRegs);
        const registeredEventIds = userRegs.map(reg => reg.EventsID);
        const availableEvents = futureEvents.filter(event => !registeredEventIds.includes(event.ID));
        setEvents(availableEvents);
        setLoading(false);
      } catch (err) {
        setError('Error loading events: ' + err.message);
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);
  const handleRegister = eventId => {
    router.push(`/register_for_event?EventsID=${eventId}`);
  };
  if (loading) {
    return <div className='p-4'><p>Loading upcoming events...</p></div>;
  }
  if (error) {
    return <div className='p-4'><p>{error}</p></div>;
  }
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <div className='p-4'><h1 className='mb-6'>Upcoming Events</h1>{events.length === 0 ? <p>No upcoming events available for registration at this time.</p> : <div className='space-y-4'>{events.map(event => <div key={event.ID} className='p-4 border rounded mb-4'><div className='mb-2'><h1>{event.title}</h1></div><div className='mb-2'><p>Date: {formatDate(event.start_date)}{event.end_date ? ` - ${formatDate(event.end_date)}` : ''}</p></div><div className='mb-2'><p>Location: {event.location}</p></div><div className='mb-4'><p>{event.description}</p></div>{event.event_image ? <div className='mb-4'><img src={`data:image/jpeg;base64,${event.event_image}`} alt={event.title} onError={e => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }} /><p style={{
            display: 'none'
          }}>Image not found</p></div> : null}<button className='px-4 py-2 border rounded' onClick={() => handleRegister(event.ID)}>Register</button></div>)}</div>}</div>;
}