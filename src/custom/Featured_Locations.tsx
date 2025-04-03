'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function FeaturedLocations() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLocation, setActiveLocation] = useState(null);
  const [locationImages, setLocationImages] = useState({});
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations');
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        const sortedLocations = data.sort((a, b) => a.name.localeCompare(b.name));
        const featuredLocations = sortedLocations.slice(0, 6);
        setLocations(featuredLocations);
        featuredLocations.forEach(location => {
          fetchLocationImages(location.ID);
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchLocationImages = async locationId => {
      try {
        const response = await fetch('/api/locationimages');
        if (!response.ok) {
          throw new Error('Failed to fetch location images');
        }
        const data = await response.json();
        const filteredImages = data.filter(img => img.LocationsID === locationId);
        setLocationImages(prev => ({
          ...prev,
          [locationId]: filteredImages
        }));
      } catch (err) {
        console.error('Error fetching images for location:', err);
      }
    };
    fetchLocations();
  }, []);
  const handleLocationClick = location => {
    router.push(`/location_details?LocationsID=${location.ID}`);
  };
  const handleViewAllClick = () => {
    router.push('/tree_farm_locations');
  };
  const openLocationModal = location => {
    setActiveLocation(location);
  };
  const closeLocationModal = () => {
    setActiveLocation(null);
  };
  if (loading) {
    return <div className='p-4'><h1 className='mb-4'>Featured Tree Farm Locations</h1><p>Loading locations...</p></div>;
  }
  if (error) {
    return <div className='p-4'><h1 className='mb-4'>Featured Tree Farm Locations</h1><p>{`Error: ${error}`}</p></div>;
  }
  if (locations.length === 0) {
    return <div className='p-4'><h1 className='mb-4'>Featured Tree Farm Locations</h1><p>No tree farm locations available at this time.</p></div>;
  }
  return <div className='p-4 w-1/2'><div className='mb-4 flex justify-between items-center'><h1>Featured Tree Farm Locations</h1><button className='px-4 py-2 border rounded' onClick={handleViewAllClick}>View All Locations</button></div><div className='grid grid-cols-2 gap-4'>{locations.map(location => {
        const locationImg = locationImages[location.ID] && locationImages[location.ID].length > 0 ? locationImages[location.ID][0] : null;
        return <div key={location.ID} className='border rounded p-4 cursor-pointer' onClick={() => openLocationModal(location)}><div className='mb-2'>{locationImg ? <img src={`data:image/jpeg;base64,${locationImg.image}`} alt={locationImg.caption || location.name} className='rounded' /> : <div className='p-4 border rounded text-center'>Image not found</div>}</div><h3 className='mb-1'>{location.name}</h3><p className='mb-1 truncate'>{location.description}</p><p className='mb-1'>{`${location.city}, ${location.state}`}</p></div>;
      })}</div>{activeLocation && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 rounded-lg w-3/4 max-h-[90vh] overflow-y-auto'><div className='flex justify-between items-center mb-4'><h2 className='text-xl'>{activeLocation.name}</h2><button onClick={closeLocationModal} className='px-2 py-1 border rounded'>Close</button></div><div className='mb-4'>{locationImages[activeLocation.ID] && locationImages[activeLocation.ID].length > 0 ? <div className='flex gap-2 mb-4 overflow-x-auto'>{locationImages[activeLocation.ID].map((img, index) => <img key={index} src={`data:image/jpeg;base64,${img.image}`} alt={img.caption || `Image ${index + 1}`} className='rounded' />)}</div> : <div className='p-4 border rounded text-center mb-4'>No images available</div>}<p className='mb-2'>{activeLocation.description}</p><div className='mb-2'><strong>Address: </strong><span>{`${activeLocation.address}, ${activeLocation.city}, ${activeLocation.state} ${activeLocation.zip}`}</span></div>{activeLocation.phone && <div className='mb-2'><strong>Phone: </strong><span>{activeLocation.phone}</span></div>}{activeLocation.website && <div className='mb-2'><strong>Website: </strong><a href={activeLocation.website} target='_blank' rel='noopener noreferrer' className='underline'>{activeLocation.website}</a></div>}{activeLocation.hours && <div className='mb-2'><strong>Hours: </strong><span>{activeLocation.hours}</span></div>}</div><div className='flex justify-end gap-2'><button onClick={() => {
            closeLocationModal();
            handleLocationClick(activeLocation);
          }} className='px-4 py-2 border rounded'>View Full Details</button></div></div></div>}</div>;
}