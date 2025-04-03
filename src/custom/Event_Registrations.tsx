'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function EventRegistrationsList() {
  const [registrations, setRegistrations] = useState([]);
  const [members, setMembers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRegistration, setCurrentRegistration] = useState(null);
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const eventId = urlParams.get('EventsID');
  useEffect(() => {
    if (!eventId) {
      setError("Event ID is missing");
      setIsLoading(false);
      return;
    }
    const fetchRegistrations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/eventregistrations`);
        if (!response.ok) {
          throw new Error(`Failed to fetch registrations: ${response.status}`);
        }
        const data = await response.json();
        const eventRegistrations = data.filter(reg => reg.EventsID === eventId);
        setRegistrations(eventRegistrations);
        const memberIds = [...new Set(eventRegistrations.map(reg => reg.MembersID))];
        if (memberIds.length > 0) {
          const membersResponse = await fetch(`/api/members?ID=[${memberIds.join(',')}]`);
          if (!membersResponse.ok) {
            throw new Error(`Failed to fetch members: ${membersResponse.status}`);
          }
          const membersData = await membersResponse.json();
          const membersMap = {};
          membersData.forEach(member => {
            membersMap[member.ID] = member;
          });
          setMembers(membersMap);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRegistrations();
  }, [eventId]);
  const handleUpdateRegistration = async updatedRegistration => {
    try {
      const response = await fetch(`/api/eventregistrations/${updatedRegistration.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedRegistration)
      });
      if (!response.ok) {
        throw new Error(`Failed to update registration: ${response.status}`);
      }
      setRegistrations(prevRegs => prevRegs.map(reg => reg.ID === updatedRegistration.ID ? updatedRegistration : reg));
      setModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleDeleteRegistration = async id => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        const response = await fetch(`/api/eventregistrations/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error(`Failed to delete registration: ${response.status}`);
        }
        setRegistrations(prevRegs => prevRegs.filter(reg => reg.ID !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };
  const openUpdateModal = registration => {
    setCurrentRegistration(registration);
    setModalOpen(true);
  };
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  if (isLoading) {
    return <div className='p-4'><p>Loading registrations...</p></div>;
  }
  if (error) {
    return <div className='p-4'><p>{`Error: ${error}`}</p></div>;
  }
  return <div className='p-4'><h1 className='mb-4'>Event Registrations</h1>{registrations.length === 0 ? <p>No registrations found for this event.</p> : <div className='overflow-x-auto'><table className='w-full border-collapse'><thead><tr><th className='border p-2 text-left'>Member Name</th><th className='border p-2 text-left'>Registration Date</th><th className='border p-2 text-left'>Status</th><th className='border p-2 text-left'>Actions</th></tr></thead><tbody>{registrations.map(registration => {
            const member = members[registration.MembersID];
            return <tr key={registration.ID}><td className='border p-2'>{member ? `${member.first_name} ${member.last_name}` : 'Unknown Member'}</td><td className='border p-2'>{formatDate(registration.registration_date)}</td><td className='border p-2'>{registration.status}</td><td className='border p-2'><div className='flex space-x-2'><button className='border p-1' onClick={() => openUpdateModal(registration)}>Update</button><button className='border p-1' onClick={() => handleDeleteRegistration(registration.ID)}>Delete</button></div></td></tr>;
          })}</tbody></table></div>}{modalOpen && currentRegistration && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-4 rounded w-full max-w-md'><h2 className='mb-4'>Update Registration</h2><div className='mb-3'><label className='block mb-1'>Member:</label><p>{members[currentRegistration.MembersID] ? `${members[currentRegistration.MembersID].first_name} ${members[currentRegistration.MembersID].last_name}` : 'Unknown Member'}</p></div><div className='mb-3'><label className='block mb-1'>Registration Date:</label><input type='date' value={currentRegistration.registration_date.split('T')[0]} onChange={e => setCurrentRegistration({
            ...currentRegistration,
            registration_date: e.target.value
          })} className='border p-2 w-full' /></div><div className='mb-3'><label className='block mb-1'>Status:</label><select value={currentRegistration.status} onChange={e => setCurrentRegistration({
            ...currentRegistration,
            status: e.target.value
          })} className='border p-2 w-full'><option value='pending'>Pending</option><option value='confirmed'>Confirmed</option><option value='cancelled'>Cancelled</option><option value='attended'>Attended</option></select></div><div className='flex justify-end space-x-2'><button onClick={() => setModalOpen(false)} className='border p-2'>Cancel</button><button onClick={() => handleUpdateRegistration(currentRegistration)} className='border p-2'>Save Changes</button></div></div></div>}</div>;
}