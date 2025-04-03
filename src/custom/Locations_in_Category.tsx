'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function LocationsList() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
        const categoryId = urlParams.get('LocationCategoriesID');
        if (!categoryId) {
          throw new Error('Category ID is missing from URL parameters');
        }
        const categoryResponse = await fetch(`/api/locationcategories?ID=[${categoryId}]`);
        if (!categoryResponse.ok) {
          throw new Error('Failed to fetch category details');
        }
        const categoryData = await categoryResponse.json();
        if (categoryData.length === 0) {
          throw new Error('Category not found');
        }
        setCategory(categoryData[0]);
        const locationsResponse = await fetch('/api/locations');
        if (!locationsResponse.ok) {
          throw new Error('Failed to fetch locations');
        }
        const locationsData = await locationsResponse.json();
        const filteredLocations = locationsData.filter(location => location.LocationCategoriesID === categoryId);
        setLocations(filteredLocations);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleViewDetails = locationId => {
    router.push(`/location_details?LocationsID=${locationId}`);
  };
  if (loading) {
    return <div className='p-4'><p>Loading locations...</p></div>;
  }
  if (error) {
    return <div className='p-4'><p>{`Error: ${error}`}</p></div>;
  }
  return <div className='p-4'>{category && <div className='mb-6'><h1 className='mb-2'>{`${category.name} Locations`}</h1><p className='mb-4'>{category.description}</p></div>}{locations.length === 0 ? <p>No locations found for this category.</p> : <div className='grid gap-4'>{locations.map(location => <div key={location.ID} className='p-4 border rounded-md mb-4'><h2 className='mb-2'>{location.name}</h2><div className='mb-2'>{`${location.city}, ${location.state}`}</div><p className='mb-3'>{location.description.length > 150 ? `${location.description.substring(0, 150)}...` : location.description}</p><button className='p-2 border rounded-md' onClick={() => handleViewDetails(location.ID)}>View Details</button></div>)}</div>}</div>;
}