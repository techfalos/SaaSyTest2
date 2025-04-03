'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function MemberLocationsView() {
  const router = useRouter();
  const [memberLocations, setMemberLocations] = useState([]);
  const [locations, setLocations] = useState({});
  const [locationCategories, setLocationCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
        const memberId = urlParams.get('MembersID');
        if (!memberId) {
          throw new Error('Member ID is required');
        }
        const mlResponse = await fetch(`/api/memberlocations`);
        if (!mlResponse.ok) {
          throw new Error('Failed to fetch member locations');
        }
        const mlData = await mlResponse.json();
        const memberLocationsList = mlData.filter(ml => ml.MembersID === memberId);
        if (memberLocationsList.length === 0) {
          setMemberLocations([]);
          setLoading(false);
          return;
        }
        const locationIds = memberLocationsList.map(ml => ml.LocationsID);
        const locationsResponse = await fetch(`/api/locations?ID=[${locationIds.join(',')}]`);
        if (!locationsResponse.ok) {
          throw new Error('Failed to fetch locations');
        }
        const locationsData = await locationsResponse.json();
        const locationsLookup = {};
        locationsData.forEach(location => {
          locationsLookup[location.ID] = location;
        });
        const categoryIds = [...new Set(locationsData.filter(location => location.LocationCategoriesID).map(location => location.LocationCategoriesID))];
        if (categoryIds.length > 0) {
          const categoriesResponse = await fetch(`/api/locationcategories?ID=[${categoryIds.join(',')}]`);
          if (!categoriesResponse.ok) {
            throw new Error('Failed to fetch location categories');
          }
          const categoriesData = await categoriesResponse.json();
          const categoriesLookup = {};
          categoriesData.forEach(category => {
            categoriesLookup[category.ID] = category;
          });
          setLocationCategories(categoriesLookup);
        }
        const enrichedLocations = memberLocationsList.map(ml => ({
          ...ml,
          locationDetails: locationsLookup[ml.LocationsID] || null
        }));
        setMemberLocations(enrichedLocations);
        setLocations(locationsLookup);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const handleViewDetails = locationId => {
    router.push(`/location_details?LocationsID=${locationId}`);
  };
  if (loading) {
    return <div className='p-4'><h1 className='mb-4'>Member Locations</h1><p>Loading locations...</p></div>;
  }
  if (error) {
    return <div className='p-4'><h1 className='mb-4'>Member Locations</h1><p>{`Error: ${error}`}</p></div>;
  }
  return <div className='p-4'><h1 className='mb-4'>Member Locations</h1>{memberLocations.length === 0 ? <p>No locations found for this member.</p> : <div className='border rounded-md'><table className='w-full'><thead><tr className='border-b'><th className='p-2 text-left'>Name</th><th className='p-2 text-left'>Category</th><th className='p-2 text-left'>City</th><th className='p-2 text-left'>State</th><th className='p-2 text-left'>Ownership Type</th><th className='p-2 text-left'>Ownership Start Date</th><th className='p-2 text-left'>Actions</th></tr></thead><tbody>{memberLocations.map(memberLocation => {
            const location = memberLocation.locationDetails;
            const categoryName = location && location.LocationCategoriesID && locationCategories[location.LocationCategoriesID] ? locationCategories[location.LocationCategoriesID].name : 'Unknown';
            return <tr key={memberLocation.ID} className='border-b'><td className='p-2'>{location ? location.name : 'Unknown Location'}</td><td className='p-2'>{categoryName}</td><td className='p-2'>{location ? location.city : 'N/A'}</td><td className='p-2'>{location ? location.state : 'N/A'}</td><td className='p-2'>{memberLocation.ownership_type}</td><td className='p-2'>{formatDate(memberLocation.ownership_start_date)}</td><td className='p-2'>{location ? <button className='border rounded px-3 py-1' onClick={() => handleViewDetails(location.ID)}>View Details</button> : null}</td></tr>;
          })}</tbody></table></div>}</div>;
}