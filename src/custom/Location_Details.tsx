'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function LocationDetail() {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [locationImages, setLocationImages] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
        const locationId = urlParams.get('LocationsID');
        if (!locationId) {
          setError('Location ID not found');
          setLoading(false);
          return;
        }
        const locationResponse = await fetch(`/api/locations?ID=${locationId}`);
        if (!locationResponse.ok) {
          throw new Error('Failed to fetch location');
        }
        const locationData = await locationResponse.json();
        if (locationData.length === 0) {
          setError('Location not found');
          setLoading(false);
          return;
        }
        const locationInfo = locationData[0];
        setLocation(locationInfo);
        setFormData(locationInfo);
        if (locationInfo.LocationCategoriesID) {
          const categoryResponse = await fetch(`/api/locationcategories?ID=${locationInfo.LocationCategoriesID}`);
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            if (categoryData.length > 0) {
              setCategory(categoryData[0]);
            }
          }
        }
        const imagesResponse = await fetch(`/api/locationimages`);
        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          const filteredImages = imagesData.filter(img => img.LocationsID === locationId);
          setLocationImages(filteredImages);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleEditClick = () => {
    setShowEditModal(true);
  };
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/locations/${location.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setLocation(formData);
        setShowEditModal(false);
      } else {
        throw new Error('Failed to update location');
      }
    } catch (err) {
      alert(`Error updating location: ${err.message}`);
    }
  };
  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/locations/${location.ID}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        router.push('/tree_farm_locations');
      } else {
        throw new Error('Failed to delete location');
      }
    } catch (err) {
      alert(`Error deleting location: ${err.message}`);
    }
  };
  if (loading) {
    return <div className='p-4'>Loading...</div>;
  }
  if (error) {
    return <div className='p-4 border'>{error}</div>;
  }
  if (!location) {
    return <div className='p-4 border'>Location not found</div>;
  }
  return <div className='p-4'><h1 className='text-2xl mb-4'>{location.name}</h1><div className='grid grid-cols-1 md:grid-cols-2 gap-6'><div className='space-y-4 border p-4'><div><h2 className='font-semibold'>Category:</h2><p>{category ? category.name : 'Unknown Category'}</p></div><div><h2 className='font-semibold'>Description:</h2><p>{location.description}</p></div><div><h2 className='font-semibold'>Address:</h2><p>{location.address}</p><p>{`${location.city}, ${location.state} ${location.zip}`}</p></div>{location.phone && <div><h2 className='font-semibold'>Phone:</h2><p>{location.phone}</p></div>}{location.website && <div><h2 className='font-semibold'>Website:</h2><a href={location.website} target='_blank'>{location.website}</a></div>}{location.hours && <div><h2 className='font-semibold'>Hours:</h2><p>{location.hours}</p></div>}<div className='mt-6 space-x-4'><button onClick={handleEditClick} className='border p-2'>Edit Location</button><button onClick={handleDeleteClick} className='border p-2'>Delete Location</button></div></div><div className='space-y-4'>{location.latitude && location.longitude ? <div className='border p-4'><h2 className='font-semibold mb-2'>Location Map:</h2><iframe src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`} width='100%' height='300' frameBorder='0' allowFullScreen={true} className='border' /></div> : <div className='border p-4'>Map location not available</div>}<div className='border p-4'><h2 className='font-semibold mb-2'>Images:</h2>{locationImages.length > 0 ? <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>{locationImages.map(img => <div key={img.ID} className='border p-2'><img src={img.image ? `data:image/jpeg;base64,${img.image}` : null} alt={img.caption || 'Location image'} onError={e => {
                e.target.parentNode.innerHTML = 'Image not found';
              }} className='mb-2' />{img.caption && <p className='text-center'>{img.caption}</p>}</div>)}</div> : <p>No images available</p>}</div></div></div>{showEditModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 border m-4 max-h-[90vh] overflow-y-auto w-full max-w-2xl'><h2 className='text-xl mb-4'>Edit Location</h2><div className='space-y-4'><div><label className='block mb-1'>Name:</label><input type='text' name='name' value={formData.name || ''} onChange={handleInputChange} className='border p-2 w-full' required={true} /></div><div><label className='block mb-1'>Description:</label><textarea name='description' value={formData.description || ''} onChange={handleInputChange} className='border p-2 w-full' rows={3} required={true} /></div><div><label className='block mb-1'>Address:</label><input type='text' name='address' value={formData.address || ''} onChange={handleInputChange} className='border p-2 w-full' required={true} /></div><div className='grid grid-cols-3 gap-2'><div><label className='block mb-1'>City:</label><input type='text' name='city' value={formData.city || ''} onChange={handleInputChange} className='border p-2 w-full' required={true} /></div><div><label className='block mb-1'>State:</label><input type='text' name='state' value={formData.state || ''} onChange={handleInputChange} className='border p-2 w-full' required={true} /></div><div><label className='block mb-1'>Zip:</label><input type='text' name='zip' value={formData.zip || ''} onChange={handleInputChange} className='border p-2 w-full' required={true} /></div></div><div className='grid grid-cols-2 gap-2'><div><label className='block mb-1'>Latitude:</label><input type='text' name='latitude' value={formData.latitude || ''} onChange={handleInputChange} className='border p-2 w-full' required={true} /></div><div><label className='block mb-1'>Longitude:</label><input type='text' name='longitude' value={formData.longitude || ''} onChange={handleInputChange} className='border p-2 w-full' required={true} /></div></div><div><label className='block mb-1'>Category ID:</label><input type='text' name='LocationCategoriesID' value={formData.LocationCategoriesID || ''} onChange={handleInputChange} className='border p-2 w-full' required={true} /></div><div><label className='block mb-1'>Website:</label><input type='text' name='website' value={formData.website || ''} onChange={handleInputChange} className='border p-2 w-full' /></div><div><label className='block mb-1'>Phone:</label><input type='text' name='phone' value={formData.phone || ''} onChange={handleInputChange} className='border p-2 w-full' /></div><div><label className='block mb-1'>Hours:</label><textarea name='hours' value={formData.hours || ''} onChange={handleInputChange} className='border p-2 w-full' rows={3} /></div></div><div className='mt-6 flex justify-end space-x-4'><button onClick={() => setShowEditModal(false)} className='border p-2'>Cancel</button><button onClick={handleSaveChanges} className='border p-2'>Save Changes</button></div></div></div>}{showDeleteModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 border m-4 max-w-md'><h2 className='text-xl mb-4'>Confirm Deletion</h2><p className='mb-6'>{`Are you sure you want to delete "${location.name}"? This action cannot be undone.`}</p><div className='flex justify-end space-x-4'><button onClick={() => setShowDeleteModal(false)} className='border p-2'>Cancel</button><button onClick={handleDeleteConfirm} className='border p-2'>Delete</button></div></div></div>}</div>;
}