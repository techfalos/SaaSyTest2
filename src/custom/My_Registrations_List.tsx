'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function MyEventRegistrationsComponent() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [eventDetails, setEventDetails] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
  const [registrationToCancel, setRegistrationToCancel] = useState(null);
  useEffect(() => {
    fetchRegistrations();
  }, []);
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/eventregistrations');
      if (!response.ok) {
        throw new Error(`Failed to fetch registrations: ${response.status}`);
      }
      const registrationData = await response.json();
      const eventDetails = await Promise.all(registrationData.map(async registration => {
        const eventResponse = await fetch(`/api/events?ID=[${registration.EventsID}]`);
        if (!eventResponse.ok) {
          throw new Error(`Failed to fetch event ${registration.EventsID}: ${eventResponse.status}`);
        }
        const eventData = await eventResponse.json();
        return {
          ...registration,
          event: eventData[0]
        };
      }));
      setRegistrations(eventDetails);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  const handleViewEventDetails = event => {
    setEventDetails(event);
    setShowEventModal(true);
  };
  const handleUpdateStatus = registration => {
    setSelectedRegistration(registration);
    setNewStatus(registration.status);
    setShowStatusModal(true);
  };
  const saveStatusUpdate = async () => {
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
        throw new Error(`Failed to update status: ${response.status}`);
      }
      setRegistrations(registrations.map(reg => reg.ID === selectedRegistration.ID ? {
        ...reg,
        status: newStatus
      } : reg));
      setShowStatusModal(false);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleCancelRegistration = registration => {
    setRegistrationToCancel(registration);
    setShowConfirmCancelModal(true);
  };
  const confirmCancelRegistration = async () => {
    try {
      const response = await fetch(`/api/eventregistrations/${registrationToCancel.ID}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Failed to cancel registration: ${response.status}`);
      }
      setRegistrations(registrations.filter(reg => reg.ID !== registrationToCancel.ID));
      setShowConfirmCancelModal(false);
    } catch (err) {
      setError(err.message);
    }
  };
  const applyFilters = () => {
    fetchRegistrations().then(() => {
      let filtered = [...registrations];
      if (filterStartDate) {
        filtered = filtered.filter(reg => new Date(reg.event.start_date) >= new Date(filterStartDate));
      }
      if (filterEndDate) {
        filtered = filtered.filter(reg => new Date(reg.event.end_date) <= new Date(filterEndDate));
      }
      if (filterStatus) {
        filtered = filtered.filter(reg => reg.status === filterStatus);
      }
      setRegistrations(filtered);
    });
  };
  const resetFilters = () => {
    setFilterStartDate("");
    setFilterEndDate("");
    setFilterStatus("");
    fetchRegistrations();
  };
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  if (loading) {
    return <div className='p-4'><p>Loading your event registrations...</p></div>;
  }
  if (error) {
    return <div className='p-4'><p>{`Error: ${error}`}</p><button onClick={fetchRegistrations} className='mt-2 p-2 border rounded'>Try Again</button></div>;
  }
  return <div className='p-4'><h1 className='mb-6'>My Event Registrations</h1><div className='mb-6 p-4 border rounded'><h2 className='mb-4'>Filter Registrations</h2><div className='grid grid-cols-1 md:grid-cols-3 gap-4'><div><label className='block mb-1'>Event Start Date:</label><input type='date' value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} className='w-full p-2 border rounded' /></div><div><label className='block mb-1'>Event End Date:</label><input type='date' value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} className='w-full p-2 border rounded' /></div><div><label className='block mb-1'>Registration Status:</label><select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className='w-full p-2 border rounded'><option value=''>All Statuses</option><option value='registered'>Registered</option><option value='waitlisted'>Waitlisted</option><option value='attended'>Attended</option><option value='cancelled'>Cancelled</option></select></div></div><div className='mt-4 flex gap-2'><button onClick={applyFilters} className='p-2 border rounded'>Apply Filters</button><button onClick={resetFilters} className='p-2 border rounded'>Reset Filters</button></div></div><div className='mt-4'>{registrations.length === 0 ? <p>No event registrations found.</p> : <div className='grid grid-cols-1 gap-4'>{registrations.map(registration => <div key={registration.ID} className='p-4 border rounded'><div className='flex flex-col md:flex-row justify-between'><div><h2 className='text-xl mb-2'>{registration.event?.title || 'Event title not available'}</h2><p>{`Date: ${formatDate(registration.event?.start_date)} to ${formatDate(registration.event?.end_date)}`}</p><p>{`Location: ${registration.event?.location || 'Location not specified'}`}</p><p>{`Registration Date: ${formatDate(registration.registration_date)}`}</p><p>{`Status: ${registration.status}`}</p></div><div className='mt-4 md:mt-0 flex flex-col gap-2'><button onClick={() => handleViewEventDetails(registration.event)} className='p-2 border rounded'>View Event Details</button><button onClick={() => handleUpdateStatus(registration)} className='p-2 border rounded'>Update Status</button><button onClick={() => handleCancelRegistration(registration)} className='p-2 border rounded'>Cancel Registration</button></div></div></div>)}</div>}</div>{showEventModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'><h2 className='text-xl mb-4'>{eventDetails?.title || 'Event Details'}</h2><p className='mb-2'>{`Description: ${eventDetails?.description || 'No description'}`}</p><p className='mb-2'>{`Date: ${formatDate(eventDetails?.start_date)} to ${formatDate(eventDetails?.end_date)}`}</p><p className='mb-2'>{`Location: ${eventDetails?.location || 'Location not specified'}`}</p><p className='mb-2'>{`Event Type: ${eventDetails?.event_type || 'Not specified'}`}</p>{eventDetails?.event_image ? <img src={`data:image/jpeg;base64,${eventDetails.event_image}`} alt={eventDetails.title} className='my-4 rounded' /> : <p className='my-4'>No image available for this event</p>}<button onClick={() => setShowEventModal(false)} className='mt-4 p-2 border rounded'>Close</button></div></div>}{showStatusModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 rounded-lg max-w-md w-full'><h2 className='text-xl mb-4'>Update Registration Status</h2><p className='mb-4'>{`Event: ${selectedRegistration?.event?.title}`}</p><div className='mb-4'><label className='block mb-2'>Status:</label><select value={newStatus} onChange={e => setNewStatus(e.target.value)} className='w-full p-2 border rounded'><option value='registered'>Registered</option><option value='waitlisted'>Waitlisted</option><option value='attended'>Attended</option><option value='cancelled'>Cancelled</option></select></div><div className='flex justify-end gap-2'><button onClick={() => setShowStatusModal(false)} className='p-2 border rounded'>Cancel</button><button onClick={saveStatusUpdate} className='p-2 border rounded'>Save</button></div></div></div>}{showConfirmCancelModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 rounded-lg max-w-md w-full'><h2 className='text-xl mb-4'>Confirm Cancellation</h2><p className='mb-4'>{`Are you sure you want to cancel your registration for "${registrationToCancel?.event?.title}"?`}</p><div className='flex justify-end gap-2'><button onClick={() => setShowConfirmCancelModal(false)} className='p-2 border rounded'>No, Keep Registration</button><button onClick={confirmCancelRegistration} className='p-2 border rounded'>Yes, Cancel Registration</button></div></div></div>}</div>;
}