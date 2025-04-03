'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function LocationMembersList() {
  const router = useRouter();
  const [locationOwners, setLocationOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  useEffect(() => {
    const fetchLocationOwners = async () => {
      try {
        const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
        const locationId = urlParams.get('LocationsID');
        if (!locationId) {
          throw new Error('No location ID provided');
        }
        const memberLocationsResponse = await fetch(`/api/memberlocations`);
        if (!memberLocationsResponse.ok) {
          throw new Error('Failed to fetch member locations');
        }
        const memberLocationsData = await memberLocationsResponse.json();
        const filteredMemberLocations = memberLocationsData.filter(ml => ml.LocationsID === locationId);
        if (filteredMemberLocations.length === 0) {
          setLocationOwners([]);
          setLoading(false);
          return;
        }
        const memberIds = filteredMemberLocations.map(ml => ml.MembersID);
        const membersResponse = await fetch(`/api/members?ID=[${memberIds.join(',')}]`);
        if (!membersResponse.ok) {
          throw new Error('Failed to fetch members');
        }
        const membersData = await membersResponse.json();
        const ownersWithDetails = filteredMemberLocations.map(memberLocation => {
          const memberDetails = membersData.find(m => m.ID === memberLocation.MembersID);
          return {
            ...memberLocation,
            ...memberDetails
          };
        });
        setLocationOwners(ownersWithDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLocationOwners();
  }, []);
  const handleViewDetails = member => {
    setSelectedMember(member);
    setShowMemberDetails(true);
  };
  const handleCloseModal = () => {
    setShowMemberDetails(false);
    setSelectedMember(null);
  };
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const navigateToMemberDetails = memberId => {
    router.push(`/member_details?MembersID=${memberId}`);
  };
  return <div className='container mx-auto my-8 px-4'><h1 className='mb-6'>Location Owners</h1>{loading ? <p>Loading location owners...</p> : error ? <p>{`Error: ${error}`}</p> : <React.Fragment>{locationOwners.length === 0 ? <p>No owners found for this location.</p> : <div className='overflow-x-auto'><table className='w-full border-collapse'><thead><tr className='border-b'><th className='text-left py-2 px-4'>Name</th><th className='text-left py-2 px-4'>Email</th><th className='text-left py-2 px-4'>Phone</th><th className='text-left py-2 px-4'>Ownership Type</th><th className='text-left py-2 px-4'>Ownership Start Date</th><th className='text-left py-2 px-4'>Actions</th></tr></thead><tbody>{locationOwners.map(owner => <tr key={owner.ID} className='border-b'><td className='py-3 px-4'>{`${owner.first_name} ${owner.last_name}`}</td><td className='py-3 px-4'>{owner.email || 'N/A'}</td><td className='py-3 px-4'>{owner.phone || 'N/A'}</td><td className='py-3 px-4'>{owner.ownership_type || 'N/A'}</td><td className='py-3 px-4'>{formatDate(owner.ownership_start_date)}</td><td className='py-3 px-4'><button onClick={() => handleViewDetails(owner)} className='mr-2 p-2 border rounded'>Quick View</button><button onClick={() => navigateToMemberDetails(owner.MembersID)} className='p-2 border rounded'>Full Details</button></td></tr>)}</tbody></table></div>}</React.Fragment>}{showMemberDetails && selectedMember && <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'><div className='bg-white p-6 rounded-lg max-w-lg w-full'><h2 className='mb-4'>{`${selectedMember.first_name} ${selectedMember.last_name}`}</h2><div className='mb-4'><p className='mb-2'>{`Email: ${selectedMember.email || 'N/A'}`}</p><p className='mb-2'>{`Phone: ${selectedMember.phone || 'N/A'}`}</p><p className='mb-2'>{`Address: ${[selectedMember.address, selectedMember.city, selectedMember.state, selectedMember.zip].filter(Boolean).join(', ') || 'N/A'}`}</p><p className='mb-2'>{`Membership Type: ${selectedMember.membership_type || 'N/A'}`}</p><p className='mb-2'>{`Joined Date: ${formatDate(selectedMember.joined_date)}`}</p><p className='mb-2'>{`Expiration Date: ${formatDate(selectedMember.expiration_date)}`}</p><p className='mb-2'>{`Ownership Type: ${selectedMember.ownership_type || 'N/A'}`}</p><p className='mb-2'>{`Ownership Start Date: ${formatDate(selectedMember.ownership_start_date)}`}</p>{selectedMember.notes && <p className='mb-2'>{`Notes: ${selectedMember.notes}`}</p>}</div>{selectedMember.profile_image ? <img src={`data:image/jpeg;base64,${selectedMember.profile_image}`} alt={`${selectedMember.first_name} ${selectedMember.last_name}`} className='mb-4 rounded' /> : <p className='mb-4'>No profile image available</p>}<div className='flex justify-end'><button onClick={handleCloseModal} className='p-2 border rounded mr-2'>Close</button><button onClick={() => {
            handleCloseModal();
            navigateToMemberDetails(selectedMember.MembersID);
          }} className='p-2 border rounded'>View Full Profile</button></div></div></div>}</div>;
}