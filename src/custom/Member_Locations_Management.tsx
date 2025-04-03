'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function MemberLocationsComponent() {
  const [members, setMembers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [memberLocations, setMemberLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [ownershipType, setOwnershipType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [notes, setNotes] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const membersResponse = await fetch('/api/members');
        if (!membersResponse.ok) {
          throw new Error('Failed to fetch members');
        }
        const membersData = await membersResponse.json();
        const locationsResponse = await fetch('/api/locations');
        if (!locationsResponse.ok) {
          throw new Error('Failed to fetch locations');
        }
        const locationsData = await locationsResponse.json();
        const memberLocationsResponse = await fetch('/api/memberlocations');
        if (!memberLocationsResponse.ok) {
          throw new Error('Failed to fetch member locations');
        }
        const memberLocationsData = await memberLocationsResponse.json();
        setMembers(membersData);
        setLocations(locationsData);
        setMemberLocations(memberLocationsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleAddRelationship = async e => {
    e.preventDefault();
    if (!selectedMember || !selectedLocation || !ownershipType || !startDate) {
      setError('Please fill all required fields');
      return;
    }
    try {
      const newRelationship = {
        ID: crypto.randomUUID(),
        MembersID: selectedMember,
        LocationsID: selectedLocation,
        ownership_type: ownershipType,
        ownership_start_date: startDate,
        notes: notes || ''
      };
      const response = await fetch('/api/memberlocations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRelationship)
      });
      if (!response.ok) {
        throw new Error('Failed to add member location relationship');
      }
      setMemberLocations([...memberLocations, newRelationship]);
      setSelectedMember('');
      setSelectedLocation('');
      setOwnershipType('');
      setStartDate('');
      setNotes('');
    } catch (err) {
      setError(err.message);
    }
  };
  const handleDeleteRelationship = async id => {
    try {
      const response = await fetch(`/api/memberlocations/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete member location relationship');
      }
      setMemberLocations(memberLocations.filter(rel => rel.ID !== id));
    } catch (err) {
      setError(err.message);
    }
  };
  const openEditModal = relationship => {
    setEditingRelationship(relationship);
    setSelectedMember(relationship.MembersID);
    setSelectedLocation(relationship.LocationsID);
    setOwnershipType(relationship.ownership_type);
    setStartDate(relationship.ownership_start_date);
    setNotes(relationship.notes || '');
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingRelationship(null);
    setSelectedMember('');
    setSelectedLocation('');
    setOwnershipType('');
    setStartDate('');
    setNotes('');
  };
  const handleUpdateRelationship = async e => {
    e.preventDefault();
    if (!selectedMember || !selectedLocation || !ownershipType || !startDate) {
      setError('Please fill all required fields');
      return;
    }
    try {
      const updatedRelationship = {
        ID: editingRelationship.ID,
        MembersID: selectedMember,
        LocationsID: selectedLocation,
        ownership_type: ownershipType,
        ownership_start_date: startDate,
        notes: notes || ''
      };
      const response = await fetch(`/api/memberlocations/${editingRelationship.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedRelationship)
      });
      if (!response.ok) {
        throw new Error('Failed to update member location relationship');
      }
      setMemberLocations(memberLocations.map(rel => rel.ID === editingRelationship.ID ? updatedRelationship : rel));
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };
  const getMemberName = id => {
    const member = members.find(m => m.ID === id);
    return member ? `${member.first_name} ${member.last_name}` : 'Unknown Member';
  };
  const getLocationName = id => {
    const location = locations.find(l => l.ID === id);
    return location ? location.name : 'Unknown Location';
  };
  if (loading) {
    return <div className='p-4'>Loading...</div>;
  }
  if (error) {
    return <div className='p-4 border'>{`Error: ${error}`}</div>;
  }
  return <div className='p-4'><h1 className='mb-6'>Member Locations Management</h1><div className='mb-8 p-4 border'><h2 className='mb-4'>Add New Member-Location Relationship</h2><form className='space-y-4'><div><label className='block mb-1'>Member:</label><select className='w-full p-2 border' value={selectedMember} onChange={e => setSelectedMember(e.target.value)} required={true}><option value=''>Select a member</option>{members.map(member => <option key={member.ID} value={member.ID}>{`${member.first_name} ${member.last_name}`}</option>)}</select></div><div><label className='block mb-1'>Location:</label><select className='w-full p-2 border' value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} required={true}><option value=''>Select a location</option>{locations.map(location => <option key={location.ID} value={location.ID}>{location.name}</option>)}</select></div><div><label className='block mb-1'>Ownership Type:</label><select className='w-full p-2 border' value={ownershipType} onChange={e => setOwnershipType(e.target.value)} required={true}><option value=''>Select ownership type</option><option value='Owner'>Owner</option><option value='Manager'>Manager</option><option value='Employee'>Employee</option><option value='Family Member'>Family Member</option><option value='Other'>Other</option></select></div><div><label className='block mb-1'>Start Date:</label><input type='date' className='w-full p-2 border' value={startDate} onChange={e => setStartDate(e.target.value)} required={true} /></div><div><label className='block mb-1'>Notes:</label><textarea className='w-full p-2 border' value={notes} onChange={e => setNotes(e.target.value)} rows={3} /></div><div><button type='button' className='p-2 border' onClick={handleAddRelationship}>Add Relationship</button></div></form></div><div className='mt-8'><h2 className='mb-4'>Existing Member-Location Relationships</h2>{memberLocations.length === 0 ? <p>No relationships found.</p> : <div className='overflow-x-auto'><table className='w-full border'><thead><tr className='border'><th className='p-2 border'>Member</th><th className='p-2 border'>Location</th><th className='p-2 border'>Ownership Type</th><th className='p-2 border'>Start Date</th><th className='p-2 border'>Notes</th><th className='p-2 border'>Actions</th></tr></thead><tbody>{memberLocations.map(relation => <tr key={relation.ID} className='border'><td className='p-2 border'>{getMemberName(relation.MembersID)}</td><td className='p-2 border'>{getLocationName(relation.LocationsID)}</td><td className='p-2 border'>{relation.ownership_type}</td><td className='p-2 border'>{relation.ownership_start_date}</td><td className='p-2 border'>{relation.notes || '-'}</td><td className='p-2 border'><div className='flex space-x-2'><button className='p-1 border' onClick={() => openEditModal(relation)}>Edit</button><button className='p-1 border' onClick={() => handleDeleteRelationship(relation.ID)}>Delete</button></div></td></tr>)}</tbody></table></div>}</div>{showModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 rounded-md w-full max-w-lg'><h2 className='mb-4'>Edit Member-Location Relationship</h2><form className='space-y-4'><div><label className='block mb-1'>Member:</label><select className='w-full p-2 border' value={selectedMember} onChange={e => setSelectedMember(e.target.value)} required={true}>{members.map(member => <option key={member.ID} value={member.ID}>{`${member.first_name} ${member.last_name}`}</option>)}</select></div><div><label className='block mb-1'>Location:</label><select className='w-full p-2 border' value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} required={true}>{locations.map(location => <option key={location.ID} value={location.ID}>{location.name}</option>)}</select></div><div><label className='block mb-1'>Ownership Type:</label><select className='w-full p-2 border' value={ownershipType} onChange={e => setOwnershipType(e.target.value)} required={true}><option value='Owner'>Owner</option><option value='Manager'>Manager</option><option value='Employee'>Employee</option><option value='Family Member'>Family Member</option><option value='Other'>Other</option></select></div><div><label className='block mb-1'>Start Date:</label><input type='date' className='w-full p-2 border' value={startDate} onChange={e => setStartDate(e.target.value)} required={true} /></div><div><label className='block mb-1'>Notes:</label><textarea className='w-full p-2 border' value={notes} onChange={e => setNotes(e.target.value)} rows={3} /></div><div className='flex justify-end space-x-2'><button type='button' className='p-2 border' onClick={closeModal}>Cancel</button><button type='button' className='p-2 border' onClick={handleUpdateRelationship}>Update Relationship</button></div></form></div></div>}</div>;
}