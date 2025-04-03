'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function LocationsList() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [locationCategories, setLocationCategories] = useState([]);
  const [locationImages, setLocationImages] = useState({});
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    categoryId: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [modalMode, setModalMode] = useState('');
  const isAdmin = true;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const locationsResponse = await fetch('/api/locations');
        if (!locationsResponse.ok) {
          throw new Error('Failed to fetch locations');
        }
        const locationsData = await locationsResponse.json();
        const categoriesResponse = await fetch('/api/locationcategories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch location categories');
        }
        const categoriesData = await categoriesResponse.json();
        const imagesResponse = await fetch('/api/locationimages');
        if (!imagesResponse.ok) {
          throw new Error('Failed to fetch location images');
        }
        const imagesData = await imagesResponse.json();
        const imagesMap = {};
        imagesData.forEach(image => {
          if (!imagesMap[image.LocationsID]) {
            imagesMap[image.LocationsID] = [];
          }
          imagesMap[image.LocationsID].push(image);
        });
        setLocations(locationsData);
        setFilteredLocations(locationsData);
        setLocationCategories(categoriesData);
        setLocationImages(imagesMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (locations.length === 0) return;
    const filtered = locations.filter(location => {
      const matchesSearch = searchTerm === '' || location.name && location.name.toLowerCase().includes(searchTerm.toLowerCase()) || location.description && location.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = filters.city === '' || location.city && location.city.toLowerCase() === filters.city.toLowerCase();
      const matchesState = filters.state === '' || location.state && location.state.toLowerCase() === filters.state.toLowerCase();
      const matchesCategory = filters.categoryId === '' || location.LocationCategoriesID === filters.categoryId;
      return matchesSearch && matchesCity && matchesState && matchesCategory;
    });
    setFilteredLocations(filtered);
  }, [searchTerm, filters, locations]);
  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };
  const uniqueCities = useMemo(() => {
    const cities = [...new Set(locations.map(loc => loc.city).filter(Boolean))].sort();
    return cities;
  }, [locations]);
  const uniqueStates = useMemo(() => {
    const states = [...new Set(locations.map(loc => loc.state).filter(Boolean))].sort();
    return states;
  }, [locations]);
  const getCategoryName = categoryId => {
    const category = locationCategories.find(cat => cat.ID === categoryId);
    return category ? category.name : 'Unknown Category';
  };
  const getLocationThumbnail = locationId => {
    if (locationImages[locationId] && locationImages[locationId].length > 0) {
      return locationImages[locationId][0].image;
    }
    return null;
  };
  const viewLocationDetails = locationId => {
    router.push(`/location_details?LocationsID=${locationId}`);
  };
  const openEditModal = location => {
    setCurrentLocation({
      ...location
    });
    setModalMode('edit');
    setShowModal(true);
  };
  const openDeleteModal = location => {
    setCurrentLocation(location);
    setModalMode('delete');
    setShowModal(true);
  };
  const openAddModal = () => {
    setCurrentLocation({
      ID: crypto.randomUUID(),
      name: '',
      description: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      latitude: 0,
      longitude: 0,
      LocationCategoriesID: locationCategories.length > 0 ? locationCategories[0].ID : '',
      website: '',
      phone: '',
      hours: ''
    });
    setModalMode('add');
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setCurrentLocation(null);
    setModalMode('');
  };
  const handleInputChange = (field, value) => {
    setCurrentLocation(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const saveLocation = async () => {
    try {
      if (!currentLocation.name || !currentLocation.description || !currentLocation.address || !currentLocation.city || !currentLocation.state || !currentLocation.zip || !currentLocation.LocationCategoriesID) {
        alert('Please fill in all required fields');
        return;
      }
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const url = modalMode === 'add' ? '/api/locations' : `/api/locations/${currentLocation.ID}`;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentLocation)
      });
      if (!response.ok) {
        throw new Error(`Failed to ${modalMode === 'add' ? 'create' : 'update'} location`);
      }
      if (modalMode === 'add') {
        setLocations(prev => [...prev, currentLocation]);
      } else {
        setLocations(prev => prev.map(loc => loc.ID === currentLocation.ID ? currentLocation : loc));
      }
      closeModal();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
  const deleteLocation = async () => {
    try {
      const response = await fetch(`/api/locations/${currentLocation.ID}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete location');
      }
      setLocations(prev => prev.filter(loc => loc.ID !== currentLocation.ID));
      closeModal();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
  if (loading) {
    return <div className='p-4'><p>Loading locations...</p></div>;
  }
  if (error) {
    return <div className='p-4'><p>{`Error: ${error}`}</p></div>;
  }
  return <div className='p-4'><div className='mb-6 flex justify-between items-center'><h1 className='text-lg'>Tree Farm Locations</h1>{isAdmin && <button className='px-4 py-2 border rounded' onClick={openAddModal}>Add New Location</button>}</div><div className='mb-6 border-b pb-4'><div className='mb-4'><input type='text' placeholder='Search by name or description...' value={searchTerm} onChange={handleSearchChange} className='w-full p-2 border rounded' /></div><div className='grid grid-cols-3 gap-4'><div><label className='block mb-1'>City:</label><select value={filters.city} onChange={e => handleFilterChange('city', e.target.value)} className='w-full p-2 border rounded'><option value=''>All Cities</option>{uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}</select></div><div><label className='block mb-1'>State:</label><select value={filters.state} onChange={e => handleFilterChange('state', e.target.value)} className='w-full p-2 border rounded'><option value=''>All States</option>{uniqueStates.map(state => <option key={state} value={state}>{state}</option>)}</select></div><div><label className='block mb-1'>Category:</label><select value={filters.categoryId} onChange={e => handleFilterChange('categoryId', e.target.value)} className='w-full p-2 border rounded'><option value=''>All Categories</option>{locationCategories.map(category => <option key={category.ID} value={category.ID}>{category.name}</option>)}</select></div></div></div><div className='mb-4'><p>{`Showing ${filteredLocations.length} of ${locations.length} locations`}</p></div>{filteredLocations.length > 0 ? <div className='grid grid-cols-1 gap-4'>{filteredLocations.map(location => <div key={location.ID} className='border rounded p-4 flex'><div className='mr-4 w-24 h-24 flex-shrink-0'>{getLocationThumbnail(location.ID) ? <img src={`data:image/jpeg;base64,${getLocationThumbnail(location.ID)}`} alt={location.name} className='object-cover rounded' /> : <div className='w-24 h-24 flex items-center justify-center border rounded'>image not found</div>}</div><div className='flex-grow'><h2 className='mb-1'>{location.name}</h2><p className='text-sm mb-1'>{`${location.address}, ${location.city}, ${location.state} ${location.zip}`}</p><p className='text-sm mb-1'>{`Category: ${getCategoryName(location.LocationCategoriesID)}`}</p><p className='text-sm mb-2'>{location.description && location.description.length > 150 ? `${location.description.substring(0, 150)}...` : location.description}</p><div className='flex gap-2 mt-2'><button onClick={() => viewLocationDetails(location.ID)} className='px-3 py-1 border rounded'>View Details</button>{isAdmin && <button onClick={() => openEditModal(location)} className='px-3 py-1 border rounded'>Edit</button>}{isAdmin && <button onClick={() => openDeleteModal(location)} className='px-3 py-1 border rounded'>Delete</button>}</div></div></div>)}</div> : <div className='text-center p-4 border rounded'><p>No locations found matching your criteria.</p></div>}{showModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 rounded w-full max-w-2xl'><div className='mb-4 flex justify-between items-center'><h2 className='text-lg'>{modalMode === 'add' ? 'Add New Location' : modalMode === 'edit' ? 'Edit Location' : 'Delete Location'}</h2><button onClick={closeModal} className='px-2 py-1'>×</button></div>{modalMode === 'delete' ? <div><p className='mb-4'>{`Are you sure you want to delete "${currentLocation.name}"? This action cannot be undone.`}</p><div className='flex justify-end gap-2'><button onClick={closeModal} className='px-4 py-2 border rounded'>Cancel</button><button onClick={deleteLocation} className='px-4 py-2 border rounded'>Delete</button></div></div> : <div><div className='mb-4'><label className='block mb-1'>Name:</label><input type='text' value={currentLocation.name || ''} onChange={e => handleInputChange('name', e.target.value)} className='w-full p-2 border rounded' /></div><div className='mb-4'><label className='block mb-1'>Description:</label><textarea value={currentLocation.description || ''} onChange={e => handleInputChange('description', e.target.value)} className='w-full p-2 border rounded' rows={3} /></div><div className='mb-4'><label className='block mb-1'>Address:</label><input type='text' value={currentLocation.address || ''} onChange={e => handleInputChange('address', e.target.value)} className='w-full p-2 border rounded' /></div><div className='grid grid-cols-3 gap-4 mb-4'><div><label className='block mb-1'>City:</label><input type='text' value={currentLocation.city || ''} onChange={e => handleInputChange('city', e.target.value)} className='w-full p-2 border rounded' /></div><div><label className='block mb-1'>State:</label><input type='text' value={currentLocation.state || ''} onChange={e => handleInputChange('state', e.target.value)} className='w-full p-2 border rounded' /></div><div><label className='block mb-1'>Zip:</label><input type='text' value={currentLocation.zip || ''} onChange={e => handleInputChange('zip', e.target.value)} className='w-full p-2 border rounded' /></div></div><div className='grid grid-cols-2 gap-4 mb-4'><div><label className='block mb-1'>Latitude:</label><input type='number' step='any' value={currentLocation.latitude || 0} onChange={e => handleInputChange('latitude', parseFloat(e.target.value) || 0)} className='w-full p-2 border rounded' /></div><div><label className='block mb-1'>Longitude:</label><input type='number' step='any' value={currentLocation.longitude || 0} onChange={e => handleInputChange('longitude', parseFloat(e.target.value) || 0)} className='w-full p-2 border rounded' /></div></div><div className='mb-4'><label className='block mb-1'>Category:</label><select value={currentLocation.LocationCategoriesID || ''} onChange={e => handleInputChange('LocationCategoriesID', e.target.value)} className='w-full p-2 border rounded'>{locationCategories.map(category => <option key={category.ID} value={category.ID}>{category.name}</option>)}</select></div><div className='mb-4'><label className='block mb-1'>Website (optional):</label><input type='text' value={currentLocation.website || ''} onChange={e => handleInputChange('website', e.target.value)} className='w-full p-2 border rounded' /></div><div className='mb-4'><label className='block mb-1'>Phone (optional):</label><input type='text' value={currentLocation.phone || ''} onChange={e => handleInputChange('phone', e.target.value)} className='w-full p-2 border rounded' /></div><div className='mb-4'><label className='block mb-1'>Hours (optional):</label><input type='text' value={currentLocation.hours || ''} onChange={e => handleInputChange('hours', e.target.value)} className='w-full p-2 border rounded' /></div><div className='flex justify-end gap-2 mt-4'><button onClick={closeModal} className='px-4 py-2 border rounded'>Cancel</button><button onClick={saveLocation} className='px-4 py-2 border rounded'>Save</button></div></div>}</div></div>}</div>;
}