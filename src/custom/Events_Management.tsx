'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function EventDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const eventsResponse = await fetch('/api/events');
        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch events');
        }
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
        const registrationsResponse = await fetch('/api/eventregistrations');
        if (!registrationsResponse.ok) {
          throw new Error('Failed to fetch event registrations');
        }
        const registrationsData = await registrationsResponse.json();
        setRegistrations(registrationsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const currentDate = new Date();
  const upcomingEvents = events.filter(event => new Date(event.start_date) > currentDate).sort((a, b) => new Date(a.start_date) - new Date(b.start_date)).slice(0, 3);
  const recentEvents = events.filter(event => new Date(event.end_date) < currentDate).sort((a, b) => new Date(b.end_date) - new Date(a.end_date)).slice(0, 3);
  const navigateToEventsPage = () => {
    router.push('/events');
  };
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  if (isLoading) {
    return <div className='p-4'>Loading event data...</div>;
  }
  if (error) {
    return <div className='p-4'>{`Error: ${error}`}</div>;
  }
  return <div className='p-4 w-1/2'><h1 className='mb-6'>Event Dashboard</h1><div className='mb-6'><div className='flex justify-between mb-4'><h2>Events Overview</h2><div className='space-x-2'><button className='border p-2 rounded' onClick={navigateToEventsPage}>Manage Events</button><button className='border p-2 rounded' onClick={navigateToEventsPage}>Add New Event</button></div></div><div className='grid grid-cols-3 gap-4 mb-6'><div className='border p-4 rounded'><p>Total Events</p><p className='text-2xl'>{events.length}</p></div><div className='border p-4 rounded'><p>Upcoming Events</p><p className='text-2xl'>{events.filter(event => new Date(event.start_date) > currentDate).length}</p></div><div className='border p-4 rounded'><p>Total Registrations</p><p className='text-2xl'>{registrations.length}</p></div></div></div><div className='mb-6'><h2 className='mb-3'>Upcoming Events</h2>{upcomingEvents.length > 0 ? <div className='space-y-2'>{upcomingEvents.map(event => <div key={event.ID} className='border p-3 rounded flex justify-between'><div><p className='font-medium'>{event.title}</p><p>{`${formatDate(event.start_date)} - ${formatDate(event.end_date)}`}</p></div><div><p>{`Location: ${event.location}`}</p><p>{`Type: ${event.event_type}`}</p></div></div>)}</div> : <p>No upcoming events</p>}</div><div className='mb-6'><h2 className='mb-3'>Recent Events</h2>{recentEvents.length > 0 ? <div className='space-y-2'>{recentEvents.map(event => <div key={event.ID} className='border p-3 rounded flex justify-between'><div><p className='font-medium'>{event.title}</p><p>{`${formatDate(event.start_date)} - ${formatDate(event.end_date)}`}</p></div><div><p>{`Location: ${event.location}`}</p><p>{`Type: ${event.event_type}`}</p></div></div>)}</div> : <p>No recent events</p>}</div><div><h2 className='mb-3'>Event Registration Stats</h2><div className='border p-4 rounded'>{registrations.length > 0 ? <div><p>{`Total registered members: ${new Set(registrations.map(reg => reg.MembersID)).size}`}</p><p>{`Active registrations: ${registrations.filter(reg => reg.status === 'active' || reg.status === 'confirmed').length}`}</p><p>{`Pending registrations: ${registrations.filter(reg => reg.status === 'pending').length}`}</p><p>{`Cancelled registrations: ${registrations.filter(reg => reg.status === 'cancelled').length}`}</p></div> : <p>No event registrations yet</p>}</div></div></div>;
}