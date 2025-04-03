'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function LocationCategoryDetailsView() {
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const getCategoryId = () => {
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    return urlParams.get('LocationCategoriesID');
  };
  const categoryId = getCategoryId();
  useEffect(() => {
    if (!categoryId) {
      setError('Category ID not provided');
      setLoading(false);
      return;
    }
    fetch(`/api/locationcategories?ID=${categoryId}`).then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch category details');
      }
      return response.json();
    }).then(data => {
      if (data && data.length > 0) {
        setCategory(data[0]);
        setFormData({
          name: data[0].name,
          description: data[0].description
        });
      } else {
        throw new Error('Category not found');
      }
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [categoryId]);
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
  const handleEditSubmit = () => {
    if (!formData.name || !formData.description) {
      alert('Name and description are required');
      return;
    }
    const updatedCategory = {
      ID: categoryId,
      name: formData.name,
      description: formData.description
    };
    fetch(`/api/locationcategories/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedCategory)
    }).then(response => {
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      return response.json();
    }).then(data => {
      setCategory(updatedCategory);
      setShowEditModal(false);
    }).catch(err => {
      alert(`Error updating category: ${err.message}`);
    });
  };
  const handleDeleteCategory = () => {
    fetch(`/api/locationcategories/${categoryId}`, {
      method: 'DELETE'
    }).then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      router.push('/location_categories');
    }).catch(err => {
      alert(`Error deleting category: ${err.message}`);
      setShowDeleteModal(false);
    });
  };
  if (loading) {
    return <div className='p-4'><p>Loading category details...</p></div>;
  }
  if (error) {
    return <div className='p-4'><p>{`Error: ${error}`}</p><button className='mt-4 border p-2 rounded' onClick={() => router.push('/location_categories')}>Back to Categories</button></div>;
  }
  return <div className='p-4'><h1 className='mb-4'>Location Category Details</h1><div className='border p-4 mb-4 rounded'><div className='mb-4'><h2 className='mb-2'>{category.name}</h2><p>{category.description}</p></div><div className='flex gap-4 mt-4'><button className='border p-2 rounded' onClick={() => setShowEditModal(true)}>Edit Category</button><button className='border p-2 rounded' onClick={() => setShowDeleteModal(true)}>Delete Category</button><button className='border p-2 rounded' onClick={() => router.push('/location_categories')}>Back to Categories</button></div></div>{showEditModal && <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'><div className='border p-6 rounded bg-white'><h2 className='mb-4'>Edit Location Category</h2><div className='mb-4'><label className='block mb-1'>Name</label><input type='text' name='name' value={formData.name} onChange={handleInputChange} className='border p-2 w-full' /></div><div className='mb-4'><label className='block mb-1'>Description</label><textarea name='description' value={formData.description} onChange={handleInputChange} className='border p-2 w-full' rows={4} /></div><div className='flex gap-4 justify-end'><button className='border p-2 rounded' onClick={() => setShowEditModal(false)}>Cancel</button><button className='border p-2 rounded' onClick={handleEditSubmit}>Save Changes</button></div></div></div>}{showDeleteModal && <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'><div className='border p-6 rounded bg-white'><h2 className='mb-4'>Confirm Deletion</h2><p>{`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`}</p><div className='flex gap-4 justify-end mt-4'><button className='border p-2 rounded' onClick={() => setShowDeleteModal(false)}>Cancel</button><button className='border p-2 rounded' onClick={handleDeleteCategory}>Confirm Delete</button></div></div></div>}</div>;
}