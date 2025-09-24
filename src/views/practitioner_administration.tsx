'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPractitioner, setSelectedPractitioner] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    specializations: '',
    certifications: '',
    experience_years: '',
    profile_image: '',
    email: '',
    phone: '',
    available: true,
    display_order: ''
  });
  const [filters, setFilters] = useState({
    specialization: '',
    available: '',
    min_experience: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const fetchPractitioners = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.specialization) params.append('specialization', filters.specialization);
      if (filters.available !== '') params.append('available', filters.available);
      if (filters.min_experience) params.append('min_experience', filters.min_experience);
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      const response = await fetch(`/api/practitionerslist?${params.toString()}`);
      if (response.status === 401) {
        setIsAuthorized(false);
        return;
      }
      const data = await response.json();
      setPractitioners(data.data || []);
      setTotalPages(data.totalpages || 1);
    } catch (error) {
      console.error('Error fetching practitioners:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);
  useEffect(() => {
    fetchPractitioners();
  }, [fetchPractitioners]);
  const handleAddPractitioner = async () => {
    try {
      const response = await fetch('/api/practitionerscreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
          display_order: formData.display_order ? parseInt(formData.display_order) : undefined
        })
      });
      if (response.status === 401) {
        setAlertMessage("You are not authorized to perform this action");
        setShowAlert(true);
        return;
      }
      const newPractitioner = await response.json();
      setPractitioners(prev => [...prev, newPractitioner]);
      setShowAddModal(false);
      resetForm();
      setAlertMessage("Practitioner added successfully");
      setShowAlert(true);
    } catch (error) {
      setAlertMessage("Failed to create journal entry");
      setShowAlert(true);
    }
  };
  const handleEditPractitioner = async () => {
    try {
      const response = await fetch('/api/practitionersupdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          id: selectedPractitioner.id,
          experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
          display_order: formData.display_order ? parseInt(formData.display_order) : undefined
        })
      });
      if (response.status === 401) {
        setAlertMessage("You are not authorized to perform this action");
        setShowAlert(true);
        return;
      }
      const updatedPractitioner = await response.json();
      setPractitioners(prev => prev.map(p => p.id === selectedPractitioner.id ? updatedPractitioner : p));
      setShowEditModal(false);
      setSelectedPractitioner(null);
      resetForm();
      setAlertMessage("Practitioner updated successfully");
      setShowAlert(true);
    } catch (error) {
      setAlertMessage("Error updating practitioner");
      setShowAlert(true);
    }
  };
  const handleDeletePractitioner = async () => {
    try {
      const response = await fetch('/api/practitionersdelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: selectedPractitioner.id
        })
      });
      if (response.status === 401) {
        setAlertMessage("You are not authorized to perform this action");
        setShowAlert(true);
        return;
      }
      setPractitioners(prev => prev.filter(p => p.id !== selectedPractitioner.id));
      setShowDeleteModal(false);
      setSelectedPractitioner(null);
      setAlertMessage("Practitioner deleted successfully");
      setShowAlert(true);
    } catch (error) {
      setAlertMessage("Failed to delete journal entry");
      setShowAlert(true);
    }
  };
  const resetForm = () => {
    setFormData({
      name: '',
      bio: '',
      specializations: '',
      certifications: '',
      experience_years: '',
      profile_image: '',
      email: '',
      phone: '',
      available: true,
      display_order: ''
    });
  };
  const openEditModal = practitioner => {
    setSelectedPractitioner(practitioner);
    setFormData({
      name: practitioner.name || '',
      bio: practitioner.bio || '',
      specializations: practitioner.specializations || '',
      certifications: practitioner.certifications || '',
      experience_years: practitioner.experience_years?.toString() || '',
      profile_image: practitioner.profile_image || '',
      email: practitioner.email || '',
      phone: practitioner.phone || '',
      available: practitioner.available,
      display_order: practitioner.display_order?.toString() || ''
    });
    setShowEditModal(true);
  };
  const openDeleteModal = practitioner => {
    setSelectedPractitioner(practitioner);
    setShowDeleteModal(true);
  };
  const handleImageUpload = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        setFormData(prev => ({
          ...prev,
          profile_image: base64
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };
  if (loading) {
    return <div className='w-full flex items-center justify-center p-8'><div>Loading practitioner profile...</div></div>;
  }
  if (!isAuthorized) {
    return <div className='w-full flex items-center justify-center p-8'><div className='text-center'><h2 className='m-4'>Access Denied</h2><p>Administrator access required</p></div></div>;
  }
  return <div className='w-full'><div className='flex flex-col lg:flex-row justify-between items-center m-6'><h1>Practitioner Management</h1><button onClick={() => setShowAddModal(true)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-2'>Add New Practitioner</button></div><div className='flex flex-col lg:flex-row gap-4 m-6 p-4 border border-gray-300'><div className='m-2'><label className='m-2'>Specialization:</label><input type='text' value={filters.specialization} onChange={e => handleFilterChange('specialization', e.target.value)} placeholder='Specialization' className='m-2 p-2 border border-gray-300' /></div><div className='m-2'><label className='m-2'>Available:</label><select value={filters.available} onChange={e => handleFilterChange('available', e.target.value)} className='m-2 p-2 border border-gray-300'><option value=''>All Availability</option><option value='true'>Available</option><option value='false'>Currently Unavailable</option></select></div><div className='m-2'><label className='m-2'>Min Experience (years):</label><input type='number' value={filters.min_experience} onChange={e => handleFilterChange('min_experience', e.target.value)} placeholder='0' className='m-2 p-2 border border-gray-300' /></div></div><div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-6'>{practitioners.map(practitioner => <div key={practitioner.id} className='border border-gray-300 p-4 w-full h-full'>{practitioner.profile_image && <img src={`data:image/jpeg;base64,${practitioner.profile_image}`} alt={practitioner.name} className='w-full h-48 max-h-full max-w-full object-cover m-2' />}<h3 className='m-2'>{practitioner.name}</h3><p className='m-2 text-sm'>{practitioner.bio}</p>{practitioner.specializations && <p className='m-2 text-sm bg-blue-100 text-blue-800 p-2'>{`${"Specializations"}: ${practitioner.specializations}`}</p>}{practitioner.experience_years && <p className='m-2 text-sm font-semibold'>{`${"Experience"}: ${practitioner.experience_years} ${"years"}`}</p>}<p className={`m-2 text-sm ${practitioner.available ? 'text-green-600' : 'text-red-600'}`}>{practitioner.available ? "Available" : "Currently Unavailable"}</p><div className='flex flex-col lg:flex-row gap-2 m-4'><button onClick={() => openEditModal(practitioner)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Edit</button><button onClick={() => openDeleteModal(practitioner)} className='!bg-red-700 !text-white p-3'>Delete</button></div></div>)}</div><div className='flex justify-center items-center gap-4 m-6'><button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Previous</button><span className='m-2'>{`${"Page"} ${currentPage} ${"of"} ${totalPages}`}</span><button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Next</button></div>{showAddModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 max-w-2xl w-full max-h-full overflow-y-auto m-4'><h2 className='m-4'>Add New Practitioner</h2><input type='text' placeholder='Your full name' value={formData.name} onChange={e => setFormData(prev => ({
          ...prev,
          name: e.target.value
        }))} className='m-5 p-3 border border-gray-300 w-full' /><textarea placeholder='Bio' value={formData.bio} onChange={e => setFormData(prev => ({
          ...prev,
          bio: e.target.value
        }))} className='m-5 p-3 border border-gray-300 w-full' rows={4} /><input type='text' placeholder='Specializations' value={formData.specializations} onChange={e => setFormData(prev => ({
          ...prev,
          specializations: e.target.value
        }))} className='m-5 p-3 border border-gray-300 w-full' /><input type='text' placeholder='Certifications' value={formData.certifications} onChange={e => setFormData(prev => ({
          ...prev,
          certifications: e.target.value
        }))} className='m-5 p-3 border border-gray-300 w-full' /><input type='number' placeholder='Experience Years' value={formData.experience_years} onChange={e => setFormData(prev => ({
          ...prev,
          experience_years: e.target.value
        }))} className='m-5 p-3 border border-gray-300 w-full' /><input type='email' placeholder='your.email@example.com' value={formData.email} onChange={e => setFormData(prev => ({
          ...prev,
          email: e.target.value
        }))} className='m-5 p-3 border border-gray-300 w-full' /><input type='tel' placeholder='(555) 123-4567' value={formData.phone} onChange={e => setFormData(prev => ({
          ...prev,
          phone: e.target.value
        }))} className='m-5 p-3 border border-gray-300 w-full' /><input type='number' placeholder='Display Order' value={formData.display_order} onChange={e => setFormData(prev => ({
          ...prev,
          display_order: e.target.value
        }))} className='m-5 p-3 border border-gray-300 w-full' /><div className='m-5'><label className='m-2'>Profile Image:</label><input type='file' accept='image/*' onChange={handleImageUpload} className='m-2 p-3 border border-gray-300 w-full' /></div><div className='m-5 flex items-center'><input type='checkbox' checked={formData.available} onChange={e => setFormData(prev => ({
            ...prev,
            available: e.target.checked
          }))} className='m-2' /><label className='m-2'>Available</label></div><div className='flex flex-col lg:flex-row gap-4 m-4'><button onClick={handleAddPractitioner} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Add</button><button onClick={() => {
            setShowAddModal(false);
            resetForm();
          }} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Cancel</button></div></div></div>}{showEditModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 max-w-2xl w-full max-h-full overflow-y-auto m-4'><h2 className='m-4'>Edit Practitioner</h2><input type='text' placeholder='Your full name' value={formData.name} onChange={e => setFormData(prev => ({
          ...prev,
          name: e.target.value
        }))} className='m-5 p-3 border border-gray-300 w-full' /><textarea placeholder='Bio' value={formData.bio} onChange={e => setFormData(prev => ({
          ...prev,
          bio: e.target.value
        }))} className='m-5 p-3 border border-gray-300 w-full' rows={4} /><input type='text' placeholder='Specializations' value={formData.specializations} onChange={e => setFormData(prev => ({
          ...prev,
          specializations: e.target.value
        }))} className='m-5 p-3 border border-gray-300 w-full' /><input type='text' placeholder='Certifications' value={formData.certifications} onChange={e => setFormData(prev => ({
          ...prev,
          certifications: e.target.value
        }))} className='m-5 p-3 border border-gray-300 w-full' /><input type='number' placeholder='Experience Years' value={formData.experience_years} onChange={e => setFormData(prev => ({
          ...prev,
          experience_years: e.target.value
        }))} className='m-5 p-3 border border-gray-300 w-full' /><input type='email' placeholder='your.email@example.com' value={formData.email} onChange={e => setFormData(prev => ({
          ...prev,
          email: e.target.value
        }))} className='m-5 p-3 border border-gray-300 w-full' /><input type='tel' placeholder='(555) 123-4567' value={formData.phone} onChange={e => setFormData(prev => ({
          ...prev,
          phone: e.target.value
        }))} className='m-5 p-3 border border-gray-300 w-full' /><input type='number' placeholder='Display Order' value={formData.display_order} onChange={e => setFormData(prev => ({
          ...prev,
          display_order: e.target.value
        }))} className='m-5 p-3 border border-gray-300 w-full' /><div className='m-5'><label className='m-2'>Profile Image:</label><input type='file' accept='image/*' onChange={handleImageUpload} className='m-2 p-3 border border-gray-300 w-full' /></div><div className='m-5 flex items-center'><input type='checkbox' checked={formData.available} onChange={e => setFormData(prev => ({
            ...prev,
            available: e.target.checked
          }))} className='m-2' /><label className='m-2'>Available</label></div><div className='flex flex-col lg:flex-row gap-4 m-4'><button onClick={handleEditPractitioner} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Update</button><button onClick={() => {
            setShowEditModal(false);
            setSelectedPractitioner(null);
            resetForm();
          }} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Cancel</button></div></div></div>}{showDeleteModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 max-w-md w-full m-4'><h2 className='m-4'>Confirm Delete</h2><p className='m-4'>{`${"Are you sure you want to delete"} ${selectedPractitioner?.name}?`}</p><div className='flex flex-col lg:flex-row gap-4 m-4'><button onClick={handleDeletePractitioner} className='!bg-red-700 !text-white p-3'>Delete</button><button onClick={() => {
            setShowDeleteModal(false);
            setSelectedPractitioner(null);
          }} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Cancel</button></div></div></div>}{showAlert && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 max-w-md w-full m-4'><p className='m-4'>{alertMessage}</p><button onClick={() => setShowAlert(false)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>OK</button></div></div>}{practitioners.length === 0 && !loading && <div className='text-center m-8'><p>No practitioners found matching your criteria</p></div>}</div>;
}