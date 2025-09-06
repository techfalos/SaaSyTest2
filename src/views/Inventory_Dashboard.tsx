'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const InventoryDashboardView = function InventoryManagement() {
  const [dresses, setDresses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedDress, setSelectedDress] = useState(null);
  const [dressImages, setDressImages] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedDresses, setSelectedDresses] = useState([]);
  const [formData, setFormData] = useState({
    categoriesid: '',
    name: '',
    slug: '',
    description: '',
    price: '',
    compare_at_price: '',
    sku: '',
    stock_quantity: '',
    available_sizes: [],
    available_colors: [],
    material: '',
    care_instructions: '',
    featured: false,
    published: true
  });
  const [imageFormData, setImageFormData] = useState({
    image_url: '',
    alt_text: '',
    display_order: 0,
    is_primary: false
  });
  useEffect(() => {
    loadData();
  }, [currentPage, searchTerm, selectedCategory]);
  const loadData = async () => {
    try {
      const userResponse = await fetch('/api/user');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setIsAdmin(userData.isadmin);
      } else if (userResponse.status === 401) {
        setIsAdmin(false);
      }
      const categoriesResponse = await fetch('/api/categorieslist?published=true&limit=100');
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.data || []);
      }
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', 20);
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category_id', selectedCategory);
      params.append('sort', 'created_at');
      const dressesResponse = await fetch(`/api/dresseslist?${params.toString()}`);
      if (dressesResponse.ok) {
        const dressesData = await dressesResponse.json();
        setDresses(dressesData.data || []);
        setTotalPages(dressesData.totalpages || 1);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  const loadDressImages = async dressId => {
    try {
      const response = await fetch(`/api/dressimageslist?dress_id=${dressId}&limit=100`);
      if (response.ok) {
        const data = await response.json();
        setDressImages(data.data || []);
      }
    } catch (error) {
      console.error('Error loading dress images:', error);
    }
  };
  const handleAddDress = async () => {
    try {
      const response = await fetch('/api/dressescreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
          stock_quantity: parseInt(formData.stock_quantity)
        })
      });
      if (response.ok) {
        const newDress = await response.json();
        setDresses(prev => [newDress, ...prev]);
        setShowAddModal(false);
        resetForm();
        setMessage("Dress added successfully");
        setShowMessage(true);
      } else if (response.status === 401) {
        setMessage("You are not authorized to perform this action");
        setShowMessage(true);
      }
    } catch (error) {
      console.error('Error adding dress:', error);
    }
  };
  const handleEditDress = async () => {
    try {
      const response = await fetch('/api/dressesupdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: selectedDress.id,
          ...formData,
          price: parseFloat(formData.price),
          compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
          stock_quantity: parseInt(formData.stock_quantity)
        })
      });
      if (response.ok) {
        const updatedDress = await response.json();
        setDresses(prev => prev.map(d => d.id === updatedDress.id ? updatedDress : d));
        setShowEditModal(false);
        resetForm();
        setMessage("Dress updated successfully");
        setShowMessage(true);
      } else if (response.status === 401) {
        setMessage("You are not authorized to perform this action");
        setShowMessage(true);
      }
    } catch (error) {
      console.error('Error updating dress:', error);
    }
  };
  const handleDeleteDress = async () => {
    try {
      const response = await fetch('/api/dressesdelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: deleteId
        })
      });
      if (response.ok) {
        setDresses(prev => prev.filter(d => d.id !== deleteId));
        setShowDeleteConfirm(false);
        setDeleteId(null);
        setMessage("Dress deleted successfully");
        setShowMessage(true);
      } else if (response.status === 401) {
        setMessage("You are not authorized to perform this action");
        setShowMessage(true);
      }
    } catch (error) {
      console.error('Error deleting dress:', error);
    }
  };
  const handleAddImage = async () => {
    try {
      const response = await fetch('/api/dressimagescreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dressesid: selectedDress.id,
          ...imageFormData,
          display_order: parseInt(imageFormData.display_order)
        })
      });
      if (response.ok) {
        await loadDressImages(selectedDress.id);
        setImageFormData({
          image_url: '',
          alt_text: '',
          display_order: 0,
          is_primary: false
        });
        setMessage("Image added successfully");
        setShowMessage(true);
      } else if (response.status === 401) {
        setMessage("You are not authorized to perform this action");
        setShowMessage(true);
      }
    } catch (error) {
      console.error('Error adding image:', error);
    }
  };
  const handleDeleteImage = async imageId => {
    try {
      const response = await fetch('/api/dressimagesdelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: imageId
        })
      });
      if (response.ok) {
        await loadDressImages(selectedDress.id);
        setMessage("Image deleted successfully");
        setShowMessage(true);
      } else if (response.status === 401) {
        setMessage("You are not authorized to perform this action");
        setShowMessage(true);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  const handleUpdateImage = async (imageId, updateData) => {
    try {
      const response = await fetch('/api/dressimagesupdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: imageId,
          ...updateData
        })
      });
      if (response.ok) {
        await loadDressImages(selectedDress.id);
        setMessage("Image updated successfully");
        setShowMessage(true);
      } else if (response.status === 401) {
        setMessage("You are not authorized to perform this action");
        setShowMessage(true);
      }
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };
  const handleFileUpload = (event, field) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const base64Data = e.target.result.split(',')[1];
        if (field === 'image_url') {
          setImageFormData(prev => ({
            ...prev,
            image_url: base64Data
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const resetForm = () => {
    setFormData({
      categoriesid: '',
      name: '',
      slug: '',
      description: '',
      price: '',
      compare_at_price: '',
      sku: '',
      stock_quantity: '',
      available_sizes: [],
      available_colors: [],
      material: '',
      care_instructions: '',
      featured: false,
      published: true
    });
  };
  const openEditModal = dress => {
    setSelectedDress(dress);
    setFormData({
      categoriesid: dress.categoriesid || '',
      name: dress.name || '',
      slug: dress.slug || '',
      description: dress.description || '',
      price: dress.price || '',
      compare_at_price: dress.compare_at_price || '',
      sku: dress.sku || '',
      stock_quantity: dress.stock_quantity || '',
      available_sizes: dress.available_sizes || [],
      available_colors: dress.available_colors || [],
      material: dress.material || '',
      care_instructions: dress.care_instructions || '',
      featured: dress.featured || false,
      published: dress.published || false
    });
    setShowEditModal(true);
  };
  const openImageModal = async dress => {
    setSelectedDress(dress);
    await loadDressImages(dress.id);
    setShowImageModal(true);
  };
  const openDeleteConfirm = id => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };
  const formatPrice = price => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  const getStockStatus = stock => {
    if (stock === 0) return {
      text: "Out of Stock",
      className: "text-red-600 bg-red-100"
    };
    if (stock <= 5) return {
      text: "Low Stock",
      className: "text-orange-600 bg-orange-100"
    };
    return {
      text: "In Stock",
      className: "text-green-600 bg-green-100"
    };
  };
  const handleSizeSelection = size => {
    setFormData(prev => ({
      ...prev,
      available_sizes: prev.available_sizes.includes(size) ? prev.available_sizes.filter(s => s !== size) : [...prev.available_sizes, size]
    }));
  };
  const handleColorSelection = color => {
    setFormData(prev => ({
      ...prev,
      available_colors: prev.available_colors.includes(color) ? prev.available_colors.filter(c => c !== color) : [...prev.available_colors, color]
    }));
  };
  const commonSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const commonColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Pink', 'Purple', 'Yellow', 'Gray', 'Navy'];
  if (loading) {
    return <div className='w-full flex justify-center items-center p-20'><div>Loading featured dresses...</div></div>;
  }
  if (!isAdmin) {
    return <div className='w-full flex justify-center items-center p-20'><div>Please log in to view featured dresses</div></div>;
  }
  return <div className='w-full p-4'><div className='flex flex-col lg:flex-row justify-between items-start lg:items-center m-5'><h1>Inventory Management</h1><div className='flex flex-col sm:flex-col md:flex-col lg:flex-row gap-4 w-full lg:w-auto'><input type='text' placeholder='Search dresses...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className='m-5 p-3' /><select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className='m-5 p-3'><option value=''>All Categories</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select><button onClick={() => setShowAddModal(true)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-5'>Add Dress</button></div></div><div className='grid grid-cols-1 lg:grid-cols-1 gap-6'><div className='border p-5'><h2>Dress Inventory</h2>{dresses.length === 0 ? <p className='text-center p-10'>No dresses found matching your criteria.</p> : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>{dresses.map(dress => <div key={dress.id} className='border p-4'>{dress.primary_image && <img src={`${dress.primary_image}`} alt={dress.name} className='w-full h-48 max-w-full max-h-full h-auto w-auto m-2' />}<h3 className='m-2'>{dress.name}</h3><p className='m-2 font-bold text-blue-600'>{formatPrice(dress.price)}</p>{dress.compare_at_price && <p className='m-2'>Compare Price{formatPrice(dress.compare_at_price)}</p>}<p className='m-2'>SKU: {dress.sku}</p><div className='m-2'><span className={`p-2 ${getStockStatus(dress.stock_quantity).className}`}>{`${dress.stock_quantity} ${getStockStatus(dress.stock_quantity).text}`}</span></div><div className='m-2'><span className={dress.featured ? 'text-green-600 bg-green-100 p-2' : 'text-gray-600 p-2'}>{dress.featured ? "Featured" : "Regular"}</span><span className={dress.published ? 'text-blue-600 bg-blue-100 p-2 m-2' : 'text-red-600 bg-red-100 p-2 m-2'}>{dress.published ? "Published" : "Draft"}</span></div><div className='flex flex-col sm:flex-col md:flex-col lg:flex-row gap-2 m-2'><button onClick={() => openEditModal(dress)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Edit</button><button onClick={() => openImageModal(dress)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Images</button><button onClick={() => openDeleteConfirm(dress.id)} className='!bg-red-700 !text-white p-3'>Delete</button></div></div>)}</div>}</div></div><div className='flex justify-center items-center m-5'><div className='flex gap-2'><button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Previous</button><span className='p-3'>{`${"Page"} ${currentPage} ${" of "} ${totalPages}`}</span><button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Next</button></div></div>{showAddModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 max-w-2xl w-full max-h-full overflow-y-auto'><h2 className='m-5'>Add New Dress</h2><div className='grid grid-cols-1 md:grid-cols-2 gap-4'><div><label className='m-5'>Category</label><select value={formData.categoriesid} onChange={e => setFormData(prev => ({
              ...prev,
              categoriesid: e.target.value
            }))} className='m-5 p-3 w-full'><option value=''>Select Category</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div><div><label className='m-5'>Name</label><input type='text' value={formData.name} onChange={e => setFormData(prev => ({
              ...prev,
              name: e.target.value
            }))} className='m-5 p-3 w-full' /></div><div><label className='m-5'>Slug</label><input type='text' value={formData.slug} onChange={e => setFormData(prev => ({
              ...prev,
              slug: e.target.value
            }))} className='m-5 p-3 w-full' /></div><div><label className='m-5'>SKU</label><input type='text' value={formData.sku} onChange={e => setFormData(prev => ({
              ...prev,
              sku: e.target.value
            }))} className='m-5 p-3 w-full' /></div><div><label className='m-5'>Price</label><input type='number' value={formData.price} onChange={e => setFormData(prev => ({
              ...prev,
              price: e.target.value
            }))} className='m-5 p-3 w-full' /></div><div><label className='m-5'>Compare Price</label><input type='number' value={formData.compare_at_price} onChange={e => setFormData(prev => ({
              ...prev,
              compare_at_price: e.target.value
            }))} className='m-5 p-3 w-full' /></div><div><label className='m-5'>Stock Quantity</label><input type='number' value={formData.stock_quantity} onChange={e => setFormData(prev => ({
              ...prev,
              stock_quantity: e.target.value
            }))} className='m-5 p-3 w-full' /></div><div><label className='m-5'>Material</label><input type='text' value={formData.material} onChange={e => setFormData(prev => ({
              ...prev,
              material: e.target.value
            }))} className='m-5 p-3 w-full' /></div></div><div className='m-5'><label className='m-5'>Description</label><textarea value={formData.description} onChange={e => setFormData(prev => ({
            ...prev,
            description: e.target.value
          }))} className='m-5 p-3 w-full' rows={3} /></div><div className='m-5'><label className='m-5'>Care Instructions</label><textarea value={formData.care_instructions} onChange={e => setFormData(prev => ({
            ...prev,
            care_instructions: e.target.value
          }))} className='m-5 p-3 w-full' rows={2} /></div><div className='m-5'><label className='m-5'>Sizes: </label><div className='flex flex-wrap gap-2 m-5'>{commonSizes.map(size => <button key={size} onClick={() => handleSizeSelection(size)} className={formData.available_sizes.includes(size) ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 hover:border-gray-400'} aria-pressed={formData.available_sizes.includes(size)}>{size}</button>)}</div></div><div className='m-5'><label className='m-5'>Colors: </label><div className='flex flex-wrap gap-2 m-5'>{commonColors.map(color => <button key={color} onClick={() => handleColorSelection(color)} className={formData.available_colors.includes(color) ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 hover:border-gray-400'} aria-pressed={formData.available_colors.includes(color)}>{color}</button>)}</div></div><div className='flex gap-4 m-5'><label className='flex items-center'><input type='checkbox' checked={formData.featured} onChange={e => setFormData(prev => ({
              ...prev,
              featured: e.target.checked
            }))} className='m-2' />Featured</label><label className='flex items-center'><input type='checkbox' checked={formData.published} onChange={e => setFormData(prev => ({
              ...prev,
              published: e.target.checked
            }))} className='m-2' />Published</label></div><div className='flex justify-end gap-4 m-5'><button onClick={() => {
            setShowAddModal(false);
            resetForm();
          }} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Cancel</button><button onClick={handleAddDress} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Add Dress</button></div></div></div>}{showEditModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 max-w-2xl w-full max-h-full overflow-y-auto'><h2 className='m-5'>Edit Dress</h2><div className='grid grid-cols-1 md:grid-cols-2 gap-4'><div><label className='m-5'>Category</label><select value={formData.categoriesid} onChange={e => setFormData(prev => ({
              ...prev,
              categoriesid: e.target.value
            }))} className='m-5 p-3 w-full'><option value=''>Select Category</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div><div><label className='m-5'>Name</label><input type='text' value={formData.name} onChange={e => setFormData(prev => ({
              ...prev,
              name: e.target.value
            }))} className='m-5 p-3 w-full' /></div><div><label className='m-5'>Slug</label><input type='text' value={formData.slug} onChange={e => setFormData(prev => ({
              ...prev,
              slug: e.target.value
            }))} className='m-5 p-3 w-full' /></div><div><label className='m-5'>SKU</label><input type='text' value={formData.sku} onChange={e => setFormData(prev => ({
              ...prev,
              sku: e.target.value
            }))} className='m-5 p-3 w-full' /></div><div><label className='m-5'>Price</label><input type='number' value={formData.price} onChange={e => setFormData(prev => ({
              ...prev,
              price: e.target.value
            }))} className='m-5 p-3 w-full' /></div><div><label className='m-5'>Compare Price</label><input type='number' value={formData.compare_at_price} onChange={e => setFormData(prev => ({
              ...prev,
              compare_at_price: e.target.value
            }))} className='m-5 p-3 w-full' /></div><div><label className='m-5'>Stock Quantity</label><input type='number' value={formData.stock_quantity} onChange={e => setFormData(prev => ({
              ...prev,
              stock_quantity: e.target.value
            }))} className='m-5 p-3 w-full' /></div><div><label className='m-5'>Material</label><input type='text' value={formData.material} onChange={e => setFormData(prev => ({
              ...prev,
              material: e.target.value
            }))} className='m-5 p-3 w-full' /></div></div><div className='m-5'><label className='m-5'>Description</label><textarea value={formData.description} onChange={e => setFormData(prev => ({
            ...prev,
            description: e.target.value
          }))} className='m-5 p-3 w-full' rows={3} /></div><div className='m-5'><label className='m-5'>Care Instructions</label><textarea value={formData.care_instructions} onChange={e => setFormData(prev => ({
            ...prev,
            care_instructions: e.target.value
          }))} className='m-5 p-3 w-full' rows={2} /></div><div className='m-5'><label className='m-5'>Sizes: </label><div className='flex flex-wrap gap-2 m-5'>{commonSizes.map(size => <button key={size} onClick={() => handleSizeSelection(size)} className={formData.available_sizes.includes(size) ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 hover:border-gray-400'} aria-pressed={formData.available_sizes.includes(size)}>{size}</button>)}</div></div><div className='m-5'><label className='m-5'>Colors: </label><div className='flex flex-wrap gap-2 m-5'>{commonColors.map(color => <button key={color} onClick={() => handleColorSelection(color)} className={formData.available_colors.includes(color) ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 hover:border-gray-400'} aria-pressed={formData.available_colors.includes(color)}>{color}</button>)}</div></div><div className='flex gap-4 m-5'><label className='flex items-center'><input type='checkbox' checked={formData.featured} onChange={e => setFormData(prev => ({
              ...prev,
              featured: e.target.checked
            }))} className='m-2' />Featured</label><label className='flex items-center'><input type='checkbox' checked={formData.published} onChange={e => setFormData(prev => ({
              ...prev,
              published: e.target.checked
            }))} className='m-2' />Published</label></div><div className='flex justify-end gap-4 m-5'><button onClick={() => {
            setShowEditModal(false);
            resetForm();
          }} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Cancel</button><button onClick={handleEditDress} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Update Dress</button></div></div></div>}{showImageModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 max-w-4xl w-full max-h-full overflow-y-auto'><h2 className='m-5'>{`${"Manage Images"} - ${selectedDress?.name}`}</h2><div className='grid grid-cols-1 lg:grid-cols-2 gap-6'><div><h3 className='m-5'>Add Image</h3><div className='m-5'><label className='m-5'>Image File</label><input type='file' accept='image/*' onChange={e => handleFileUpload(e, 'image_url')} className='m-5 p-3 w-full' /></div><div className='m-5'><label className='m-5'>Alt Text: </label><input type='text' value={imageFormData.alt_text} onChange={e => setImageFormData(prev => ({
                ...prev,
                alt_text: e.target.value
              }))} className='m-5 p-3 w-full' /></div><div className='m-5'><label className='m-5'>Display Order: </label><input type='number' value={imageFormData.display_order} onChange={e => setImageFormData(prev => ({
                ...prev,
                display_order: e.target.value
              }))} className='m-5 p-3 w-full' /></div><div className='m-5'><label className='flex items-center'><input type='checkbox' checked={imageFormData.is_primary} onChange={e => setImageFormData(prev => ({
                  ...prev,
                  is_primary: e.target.checked
                }))} className='m-2' />Primary Image</label></div><button onClick={handleAddImage} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-5'>Add Image</button></div><div><h3 className='m-5'>Existing Images</h3>{dressImages.length === 0 ? <p className='m-5'>No images found</p> : <div className='grid gap-4'>{dressImages.map(image => <div key={image.id} className='border p-4'><img src={`${image.image_url}`} alt={image.alt_text || ''} className='w-full h-32 max-w-full max-h-full h-auto w-auto m-2' /><p className='m-2'>Alt Text: {image.alt_text || "None"}</p><p className='m-2'>Display Order: {image.display_order}</p><div className='m-2'><span className={image.is_primary ? 'text-blue-600 bg-blue-100 p-2' : 'text-gray-600 p-2'}>{image.is_primary ? "Primary" : "Secondary"}</span></div><div className='flex gap-2 m-2'><button onClick={() => handleUpdateImage(image.id, {
                    is_primary: !image.is_primary
                  })} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>{image.is_primary ? "Remove Primary" : "Set Primary"}</button><button onClick={() => handleDeleteImage(image.id)} className='!bg-red-700 !text-white p-3'>Delete</button></div></div>)}</div>}</div></div><div className='flex justify-end m-5'><button onClick={() => setShowImageModal(false)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Close</button></div></div></div>}{showDeleteConfirm && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 max-w-md w-full'><h2 className='m-5'>Confirm Delete</h2><p className='m-5'>Are you sure you want to delete this dress? This action cannot be undone.</p><div className='flex justify-end gap-4 m-5'><button onClick={() => setShowDeleteConfirm(false)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Cancel</button><button onClick={handleDeleteDress} className='!bg-red-700 !text-white p-3'>Delete</button></div></div></div>}{showMessage && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 max-w-md w-full'><p className='m-5'>{message}</p><div className='flex justify-end m-5'><button onClick={() => setShowMessage(false)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>OK</button></div></div></div>}</div>;
};
InventoryDashboardView.displayName = 'InventoryDashboardView';
export default InventoryDashboardView;