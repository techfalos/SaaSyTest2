'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function LocationsManagementComponent() {
  const router = useRouter();
  const [locationSummary, setLocationSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationsResponse = await fetch('/api/locations');
        const locations = await locationsResponse.json();
        const categoriesResponse = await fetch('/api/locationcategories');
        const categories = await categoriesResponse.json();
        const summary = {};
        categories.forEach(category => {
          summary[category.ID] = {
            categoryName: category.name,
            count: 0
          };
        });
        locations.forEach(location => {
          if (summary[location.LocationCategoriesID]) {
            summary[location.LocationCategoriesID].count++;
          }
        });
        setLocationSummary({
          categories: Object.values(summary),
          totalLocations: locations.length
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load location data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleNavigateToLocations = () => {
    router.push('/tree_farm_locations');
  };
  const handleNavigateToCategories = () => {
    router.push('/location_categories');
  };
  return <div className='p-6 w-1/2'><h1 className='mb-6'>Location Management</h1>{loading ? <p>Loading location data...</p> : error ? <p>{error}</p> : <React.Fragment><div className='mb-6'><p className='mb-2'>{`Total Locations: ${locationSummary.totalLocations}`}</p></div><div className='mb-6'><h1 className='mb-4'>Locations by Category</h1><ul className='mb-4'>{locationSummary.categories.map((category, index) => <li key={index} className='mb-2'>{`${category.categoryName}: ${category.count} locations`}</li>)}</ul></div><div className='flex space-x-4'><button onClick={handleNavigateToLocations} className='border p-2 rounded'>Manage Locations</button><button onClick={handleNavigateToCategories} className='border p-2 rounded'>Manage Categories</button></div></React.Fragment>}</div>;
}