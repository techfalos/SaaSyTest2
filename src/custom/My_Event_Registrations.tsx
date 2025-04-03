'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function MemberEventRegistrations() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const getCurrentMemberId = () => {
    const userInfo = typeof localStorage === 'undefined' ? '' : localStorage.getItem('currentuserinfo');
    if (userInfo) {
      try {
        const parsedInfo = JSON.parse(userInfo);
        return parsedInfo.id;
      } catch (e) {
        return null;
      }
    }
    return null;
  };
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const memberId = getCurrentMemberId();
        if (!memberId) {
          setError("Member ID not found. Please log in again.");
          setLoading(false);
          return;
        }
        const registrationsResponse = await fetch('/api/eventregistrations');
        if (!registrationsResponse.ok) {
          throw new Error(`Failed to fetch registrations: ${registrationsResponse.status}`);
        }
        const allRegistrations = await registrationsResponse.json();
        const memberRegistrations = allRegistrations.filter(reg => reg.MembersID === memberId);
        if (memberRegistrations.length === 0) {
          setRegistrations([]);
          setLoading(false);
          return;
        }
        const eventIds = memberRegistrations.map(reg => reg.EventsID);
        const eventsQueryParam = eventIds.join(',');
        const eventsResponse = await fetch(`/api/events?ID=[${eventsQueryParam}]`);
        if (!eventsResponse.ok) {
          throw new Error(`Failed to fetch events: ${eventsResponse.status}`);
        }
        const eventsList = await eventsResponse.json();
        const eventsMap = {};
        eventsList.forEach(event => {
          eventsMap[event.ID] = event;
        });
        setEvents(eventsMap);
        const now = new Date();
        memberRegistrations.sort((a, b) => {
          const eventA = eventsMap[a.EventsID];
          const eventB = eventsMap[b.EventsID];
          if (!eventA || !eventB) return 0;
          const dateA = new Date(eventA.start_date);
          const dateB = new Date(eventB.start_date);
          const aIsPast = dateA < now;
          const bIsPast = dateB < now;
          if (aIsPast && !bIsPast) return 1;
          if (!aIsPast && bIsPast) return -1;
          if (aIsPast) {
            return dateB - dateA;
          } else {
            return dateA - dateB;
          }
        });
        setRegistrations(memberRegistrations);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);
  const formatDate = dateString => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const handleCancelRegistration = async () => {
    if (!selectedRegistration) return;
    try {
      const response = await fetch(`/api/eventregistrations/${selectedRegistration.ID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to cancel registration: ${response.status}`);
      }
      setRegistrations(registrations.filter(reg => reg.ID !== selectedRegistration.ID));
      setShowModal(false);
      setSelectedRegistration(null);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleUpdateStatus = async newStatus => {
    if (!selectedRegistration) return;
    try {
      const updatedRegistration = {
        ...selectedRegistration,
        status: newStatus
      };
      const response = await fetch(`/api/eventregistrations/${selectedRegistration.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedRegistration)
      });
      if (!response.ok) {
        throw new Error(`Failed to update registration: ${response.status}`);
      }
      setRegistrations(registrations.map(reg => reg.ID === selectedRegistration.ID ? updatedRegistration : reg));
      setShowModal(false);
      setSelectedRegistration(null);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleViewDetails = registration => {
    router.push(`/registration_details?EventRegistrationsID=${registration.ID}`);
  };
  const renderModal = () => {
    if (!showModal || !selectedRegistration) return null;
    const event = events[selectedRegistration.EventsID];
    if (modalAction === 'cancel') {
      return <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 rounded-lg shadow-lg w-96'><h1 className='mb-4'>Cancel Registration</h1><p className='mb-4'>{`Are you sure you want to cancel your registration for "${event?.title}"?`}</p><div className='flex justify-end space-x-2'><button className='border px-4 py-2 rounded' onClick={() => setShowModal(false)}>No</button><button className='border px-4 py-2 rounded' onClick={handleCancelRegistration}>Yes</button></div></div></div>;
    } else if (modalAction === 'status') {
      return <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 rounded-lg shadow-lg w-96'><h1 className='mb-4'>Update Registration Status</h1><p className='mb-2'>{`Current status: ${selectedRegistration.status}`}</p><p className='mb-4'>Select new status:</p><div className='space-y-2 mb-4'><button className='border px-4 py-2 rounded w-full' onClick={() => handleUpdateStatus('confirmed')}>Confirmed</button><button className='border px-4 py-2 rounded w-full' onClick={() => handleUpdateStatus('pending')}>Pending</button><button className='border px-4 py-2 rounded w-full' onClick={() => handleUpdateStatus('waitlisted')}>Waitlisted</button></div><div className='flex justify-end'><button className='border px-4 py-2 rounded' onClick={() => setShowModal(false)}>Cancel</button></div></div></div>;
    }
    return null;
  };
  const renderStatus = status => {
    let statusClass = '';
    switch (status.toLowerCase()) {
      case 'confirmed':
        statusClass = 'border-2 rounded px-2 py-1';
        break;
      case 'pending':
        statusClass = 'border-2 rounded px-2 py-1';
        break;
      case 'waitlisted':
        statusClass = 'border-2 rounded px-2 py-1';
        break;
      case 'cancelled':
        statusClass = 'border-2 rounded px-2 py-1';
        break;
      default:
        statusClass = 'border-2 rounded px-2 py-1';
    }
    return <span className={statusClass}>{status}</span>;
  };
  if (loading) {
    return <div className='p-4'><h1 className='mb-4'>My Event Registrations</h1><p>Loading registrations...</p></div>;
  }
  if (error) {
    return <div className='p-4'><h1 className='mb-4'>My Event Registrations</h1><p>{`Error: ${error}`}</p><button className='border px-4 py-2 rounded mt-2' onClick={() => window.location.reload()}>Try Again</button></div>;
  }
  return <div className='p-4'><h1 className='mb-4'>My Event Registrations</h1>{registrations.length === 0 ? <p>You have no registered events.</p> : <div className='space-y-4'>{registrations.map(registration => {
        const event = events[registration.EventsID];
        if (!event) return null;
        const isPastEvent = new Date(event.end_date) < new Date();
        return <div key={registration.ID} className='border p-4 rounded'><div className='flex flex-col sm:flex-row sm:justify-between'><div><h1 className='mb-1'>{event.title}</h1><p className='mb-1'>{`Date: ${formatDate(event.start_date)}${event.end_date !== event.start_date ? ` - ${formatDate(event.end_date)}` : ''}`}</p><p className='mb-1'>{`Location: ${event.location}`}</p><p className='mb-3'><span className='mr-2'>Status:</span>{renderStatus(registration.status)}</p></div><div className='mt-2 sm:mt-0 space-y-2 sm:space-y-2'><button className='border px-4 py-1 rounded block w-full sm:w-auto' onClick={() => handleViewDetails(registration)}>View Details</button>{!isPastEvent && <button className='border px-4 py-1 rounded block w-full sm:w-auto' onClick={() => {
                setSelectedRegistration(registration);
                setModalAction('status');
                setShowModal(true);
              }}>Update Status</button>}{!isPastEvent && <button className='border px-4 py-1 rounded block w-full sm:w-auto' onClick={() => {
                setSelectedRegistration(registration);
                setModalAction('cancel');
                setShowModal(true);
              }}>Cancel Registration</button>}</div></div></div>;
      })}</div>}{renderModal()}</div>;
}