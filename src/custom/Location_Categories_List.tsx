'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function LocationCategoriesComponent() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/locationcategories');
        if (!response.ok) {
          throw new Error('Failed to fetch location categories');
        }
        const data = await response.json();
        setCategories(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);
  const handleAddCategory = () => {
    setCurrentCategory({
      ID: '',
      name: '',
      description: ''
    });
    setModalMode('add');
    setShowModal(true);
  };
  const handleViewDetails = category => {
    setCurrentCategory(category);
    setModalMode('view');
    setShowModal(true);
  };
  const handleEditCategory = category => {
    setCurrentCategory({
      ...category
    });
    setModalMode('edit');
    setShowModal(true);
  };
  const handleDeleteCategory = category => {
    setCurrentCategory(category);
    setModalMode('delete');
    setShowModal(true);
  };
  const handleSubmit = async () => {
    try {
      if (modalMode === 'add') {
        const newCategory = {
          ...currentCategory
        };
        if (!newCategory.ID) {
          newCategory.ID = crypto.randomUUID();
        }
        const response = await fetch('/api/locationcategories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newCategory)
        });
        if (!response.ok) {
          throw new Error('Failed to add location category');
        }
        const addedCategory = await response.json();
        setCategories([...categories, addedCategory]);
      } else if (modalMode === 'edit') {
        const response = await fetch(`/api/locationcategories/${currentCategory.ID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(currentCategory)
        });
        if (!response.ok) {
          throw new Error('Failed to update location category');
        }
        const updatedCategory = await response.json();
        setCategories(categories.map(cat => cat.ID === updatedCategory.ID ? updatedCategory : cat));
      } else if (modalMode === 'delete') {
        const response = await fetch(`/api/locationcategories/${currentCategory.ID}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Failed to delete location category');
        }
        setCategories(categories.filter(cat => cat.ID !== currentCategory.ID));
      }
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: value
    });
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCategory(null);
  };
  if (isLoading) {
    return <div className='p-4'><p>Loading location categories...</p></div>;
  }
  if (error) {
    return <div className='p-4'><p>{`Error: ${error}`}</p><button className='mt-2 p-2 border rounded' onClick={() => window.location.reload()}>Retry</button></div>;
  }
  return <div className='p-4'><div className='mb-4 flex justify-between items-center'><h1 className='text-2xl'>Location Categories</h1><button className='p-2 border rounded' onClick={handleAddCategory}>Add New Category</button></div><div className='border rounded p-2'>{categories.length === 0 ? <p>No location categories found.</p> : <ul>{categories.map(category => <li key={category.ID} className='mb-2 p-2 border-b'><div className='flex justify-between'><div><h2 className='font-medium'>{category.name}</h2><p>{category.description}</p></div><div className='flex space-x-2'><button className='p-1 border rounded' onClick={() => handleViewDetails(category)}>View</button><button className='p-1 border rounded' onClick={() => handleEditCategory(category)}>Edit</button><button className='p-1 border rounded' onClick={() => handleDeleteCategory(category)}>Delete</button></div></div></li>)}</ul>}</div>{showModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-4 rounded w-full max-w-md'><div className='mb-4 flex justify-between items-center'><h2 className='text-xl'>{modalMode === 'add' ? 'Add New Category' : modalMode === 'edit' ? 'Edit Category' : modalMode === 'delete' ? 'Confirm Deletion' : 'Category Details'}</h2><button className='p-1 border rounded' onClick={handleCloseModal}>X</button></div>{modalMode === 'delete' ? <p>{`Are you sure you want to delete "${currentCategory?.name}"?`}</p> : <div><div className='mb-2'><label className='block mb-1'>Name:</label>{modalMode === 'view' ? <p>{currentCategory?.name}</p> : <input type='text' name='name' value={currentCategory?.name || ''} onChange={handleInputChange} className='w-full p-2 border rounded' required={true} disabled={modalMode === 'view'} />}</div><div className='mb-2'><label className='block mb-1'>Description:</label>{modalMode === 'view' ? <p>{currentCategory?.description}</p> : <textarea name='description' value={currentCategory?.description || ''} onChange={handleInputChange} className='w-full p-2 border rounded' rows={3} required={true} disabled={modalMode === 'view'} />}</div></div>}<div className='mt-4 flex justify-end space-x-2'>{modalMode !== 'view' && <button className='p-2 border rounded' onClick={handleSubmit}>{modalMode === 'delete' ? 'Delete' : modalMode === 'edit' ? 'Save Changes' : 'Add Category'}</button>}<button className='p-2 border rounded' onClick={handleCloseModal}>Cancel</button></div></div></div>}</div>;
}