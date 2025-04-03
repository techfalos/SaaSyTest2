'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function MemberEventRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRegistration, setCurrentRegistration] = useState(null);
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const memberID = urlParams.get('MembersID');
  const statusOptions = ['registered', 'attended', 'canceled', 'waitlisted'];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const registrationsResponse = await fetch('/api/eventregistrations');
        if (!registrationsResponse.ok) {
          throw new Error('Failed to fetch event registrations');
        }
        const registrationsData = await registrationsResponse.json();
        const filteredRegistrations = memberID ? registrationsData.filter(reg => reg.MembersID === memberID) : registrationsData;
        const eventIds = [...new Set(filteredRegistrations.map(reg => reg.EventsID))];
        if (eventIds.length > 0) {
          const eventsResponse = await fetch(`/api/events?ID=[${eventIds.join(',')}]`);
          if (!eventsResponse.ok) {
            throw new Error('Failed to fetch events');
          }
          const eventsData = await eventsResponse.json();
          const eventsMap = {};
          eventsData.forEach(event => {
            eventsMap[event.ID] = event;
          });
          setEvents(eventsMap);
        }
        setRegistrations(filteredRegistrations);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [memberID]);
  const handleDeleteRegistration = async registrationId => {
    if (window.confirm('Are you sure you want to cancel this registration?')) {
      try {
        const response = await fetch(`/api/eventregistrations/${registrationId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Failed to delete registration');
        }
        setRegistrations(registrations.filter(reg => reg.ID !== registrationId));
      } catch (err) {
        setError(err.message);
      }
    }
  };
  const handleEditRegistration = registration => {
    setCurrentRegistration(registration);
    setShowEditModal(true);
  };
  const handleUpdateRegistration = async () => {
    try {
      const response = await fetch(`/api/eventregistrations/${currentRegistration.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentRegistration)
      });
      if (!response.ok) {
        throw new Error('Failed to update registration');
      }
      setRegistrations(registrations.map(reg => reg.ID === currentRegistration.ID ? currentRegistration : reg));
      setShowEditModal(false);
    } catch (err) {
      setError(err.message);
    }
  };
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString();
  };
  if (loading) {
    return <div className='p-4'>Loading...</div>;
  }
  if (error) {
    return <div className='p-4 border'>{`Error: ${error}`}</div>;
  }
  return <div className='p-4'><h1 className='mb-4'>My Event Registrations</h1>{registrations.length === 0 ? <p>You have no event registrations.</p> : <div className='overflow-x-auto'><table className='w-full border-collapse'><thead><tr className='border-b'><th className='p-2 text-left'>Event</th><th className='p-2 text-left'>Date</th><th className='p-2 text-left'>Location</th><th className='p-2 text-left'>Registration Date</th><th className='p-2 text-left'>Status</th><th className='p-2 text-left'>Actions</th></tr></thead><tbody>{registrations.map(registration => {
            const event = events[registration.EventsID] || {};
            return <tr key={registration.ID} className='border-b'><td className='p-2'>{event.title || 'Unknown Event'}</td><td className='p-2'>{event.start_date ? `${formatDate(event.start_date)} - ${formatDate(event.end_date)}` : 'N/A'}</td><td className='p-2'>{event.location || 'N/A'}</td><td className='p-2'>{formatDate(registration.registration_date)}</td><td className='p-2'>{registration.status}</td><td className='p-2 flex space-x-2'><button className='px-3 py-1 border rounded' onClick={() => handleEditRegistration(registration)}>Edit</button><button className='px-3 py-1 border rounded' onClick={() => handleDeleteRegistration(registration.ID)}>Cancel</button></td></tr>;
          })}</tbody></table></div>}{showEditModal && <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'><div className='bg-white p-6 rounded max-w-md w-full'><h2 className='mb-4'>Edit Registration</h2><div className='mb-4'><label className='block mb-1'>Event:</label><div>{events[currentRegistration.EventsID]?.title || 'Unknown Event'}</div></div><div className='mb-4'><label className='block mb-1'>Status:</label><select className='w-full p-2 border rounded' value={currentRegistration.status} onChange={e => setCurrentRegistration({
            ...currentRegistration,
            status: e.target.value
          })}>{statusOptions.map(option => <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>)}</select></div><div className='flex justify-end space-x-2'><button className='px-4 py-2 border rounded' onClick={() => setShowEditModal(false)}>Cancel</button><button className='px-4 py-2 border rounded' onClick={handleUpdateRegistration}>Save</button></div></div></div>}</div>;
}