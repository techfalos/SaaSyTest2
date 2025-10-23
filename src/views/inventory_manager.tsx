'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inventoryStatus, setInventoryStatus] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [formData, setFormData] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const loadCategories = useCallback(() => {
    fetch('/api/categorieslist?page=1&limit=100&visible=true').then(response => {
      if (response.status === 401) {
        setIsAuthorized(false);
        return null;
      }
      return response.json();
    }).then(data => {
      if (data && data.data) {
        setCategories(data.data);
      }
    });
  }, []);
  const loadInventoryStatus = useCallback(() => {
    fetch('/api/inventorystatusget').then(response => {
      if (response.status === 401) {
        return null;
      }
      return response.json();
    }).then(data => {
      if (data) {
        setInventoryStatus(data);
      }
    });
  }, []);
  const loadProducts = useCallback(() => {
    const params = new URLSearchParams();
    params.append('page', currentPage);
    params.append('limit', '20');
    if (selectedCategory) params.append('categoriesid', selectedCategory);
    if (selectedAvailability) params.append('available', selectedAvailability);
    if (searchTerm) params.append('search', searchTerm);
    if (minPrice) params.append('minprice', minPrice);
    if (maxPrice) params.append('maxprice', maxPrice);
    params.append('sortby', 'name');
    params.append('sortorder', 'asc');
    fetch(`/api/productslist?${params.toString()}`).then(response => {
      if (response.status === 401) {
        setIsAuthorized(false);
        return null;
      }
      return response.json();
    }).then(data => {
      if (data) {
        setProducts(data.data || []);
        setTotalPages(data.totalpages || 1);
      }
    });
  }, [currentPage, selectedCategory, selectedAvailability, searchTerm, minPrice, maxPrice]);
  useEffect(() => {
    loadCategories();
    loadInventoryStatus();
  }, [loadCategories, loadInventoryStatus]);
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  const handleAddProduct = () => {
    setFormData({
      categoriesid: '',
      name: '',
      description: '',
      price: '',
      sku: '',
      stock_quantity: '',
      size: '',
      color: '',
      material: '',
      era_period: '',
      care_instructions: '',
      available: true,
      featured: false
    });
    setShowAddModal(true);
  };
  const handleEditProduct = product => {
    setSelectedProduct(product);
    setFormData({
      id: product.id,
      categoriesid: product.categoriesid || '',
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      sku: product.sku || '',
      stock_quantity: product.stock_quantity || '',
      size: product.size || '',
      color: product.color || '',
      material: product.material || '',
      era_period: product.era_period || '',
      care_instructions: product.care_instructions || '',
      available: product.available !== undefined ? product.available : true,
      featured: product.featured || false
    });
    setShowEditModal(true);
  };
  const handleManageImages = product => {
    setSelectedProduct(product);
    fetch(`/api/productimageslist?productsid=${product.id}`).then(response => response.json()).then(data => {
      setProductImages(data.data || []);
      setShowImageModal(true);
    });
  };
  const handleDeleteProduct = productId => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch('/api/productsdelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: productId
        })
      }).then(response => response.json()).then(data => {
        setProducts(products.filter(p => p.id !== productId));
        setMessage("Product deleted successfully");
        setShowMessageModal(true);
        loadInventoryStatus();
      }).catch(() => {
        setMessage("Error deleting product");
        setShowMessageModal(true);
      });
    }
  };
  const handleSubmitAdd = () => {
    const payload = {
      categoriesid: formData.categoriesid,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      sku: formData.sku || undefined,
      stock_quantity: parseInt(formData.stock_quantity),
      size: formData.size || undefined,
      color: formData.color || undefined,
      material: formData.material || undefined,
      era_period: formData.era_period || undefined,
      care_instructions: formData.care_instructions || undefined,
      available: formData.available,
      featured: formData.featured
    };
    fetch('/api/productscreate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(response => response.json()).then(data => {
      setProducts([...products, data]);
      setShowAddModal(false);
      setMessage("Product added successfully");
      setShowMessageModal(true);
      loadInventoryStatus();
    }).catch(() => {
      setMessage("Error adding product");
      setShowMessageModal(true);
    });
  };
  const handleSubmitEdit = () => {
    const payload = {
      id: formData.id,
      categoriesid: formData.categoriesid,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      sku: formData.sku || undefined,
      stock_quantity: parseInt(formData.stock_quantity),
      size: formData.size || undefined,
      color: formData.color || undefined,
      material: formData.material || undefined,
      era_period: formData.era_period || undefined,
      care_instructions: formData.care_instructions || undefined,
      available: formData.available,
      featured: formData.featured
    };
    fetch('/api/productsupdate', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(response => response.json()).then(data => {
      setProducts(products.map(p => p.id === data.id ? data : p));
      setShowEditModal(false);
      setMessage("Product updated successfully");
      setShowMessageModal(true);
      loadInventoryStatus();
    }).catch(() => {
      setMessage("Error updating product");
      setShowMessageModal(true);
    });
  };
  const handleAddImage = imageBase64 => {
    fetch('/api/productimagescreate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productsid: selectedProduct.id,
        image_url: imageBase64,
        is_primary: productImages.length === 0
      })
    }).then(response => response.json()).then(data => {
      setProductImages([...productImages, data]);
      setMessage("Image added successfully");
      setShowMessageModal(true);
    });
  };
  const handleSetPrimaryImage = imageId => {
    fetch('/api/productimagesupdate', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: imageId,
        is_primary: true
      })
    }).then(response => response.json()).then(data => {
      setProductImages(productImages.map(img => ({
        ...img,
        is_primary: img.id === imageId
      })));
    });
  };
  const handleDeleteImage = imageId => {
    fetch('/api/productimagesdelete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: imageId
      })
    }).then(response => response.json()).then(() => {
      setProductImages(productImages.filter(img => img.id !== imageId));
      setMessage("Image deleted successfully");
      setShowMessageModal(true);
    });
  };
  const handleImageFileUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleAddImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const toggleProductSelection = productId => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };
  const handleBulkUpdate = type => {
    setShowBulkModal(true);
  };
  const handleSubmitBulk = (updateType, value) => {
    const promises = selectedProducts.map(productId => {
      const product = products.find(p => p.id === productId);
      const payload = {
        id: productId,
        [updateType]: updateType === 'price' ? parseFloat(value) : parseInt(value)
      };
      return fetch('/api/productsupdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(response => response.json());
    });
    Promise.all(promises).then(() => {
      loadProducts();
      setSelectedProducts([]);
      setShowBulkModal(false);
      setMessage("Bulk update completed successfully");
      setShowMessageModal(true);
      loadInventoryStatus();
    });
  };
  const formatPrice = price => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  if (!isAuthorized) {
    return <div className='w-full p-6'><p className='text-red-600'>You are not authorized to access this page</p></div>;
  }
  return <div className='w-full flex flex-col'>{inventoryStatus && <div className='w-full p-4 sm:p-5 md:p-5 lg:p-6 flex flex-col sm:flex-col md:flex-col lg:flex-row gap-4'><div className='flex-1 border border-solid p-4'><div>Total Products</div><div className='font-bold'>{inventoryStatus.total_products}</div></div><div className='flex-1 border border-solid p-4'><div>Low Stock</div><div className='font-bold text-orange-600'>{inventoryStatus.low_stock_count}</div></div><div className='flex-1 border border-solid p-4'><div>Out of Stock</div><div className='font-bold text-red-600'>{inventoryStatus.out_of_stock_count}</div></div><div className='flex-1 border border-solid p-4'><div>Available</div><div className='font-bold text-green-600'>{inventoryStatus.available_products}</div></div></div>}<div className='w-full p-4 sm:p-5 md:p-5 lg:p-6'><div className='flex flex-col sm:flex-col md:flex-col lg:flex-row gap-4 m-5'><input type='text' placeholder='Search products...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className='flex-1 p-3 border border-solid m-5' /><select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className='flex-1 p-3 border border-solid m-5'><option value=''>All Categories</option>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select><select value={selectedAvailability} onChange={e => setSelectedAvailability(e.target.value)} className='flex-1 p-3 border border-solid m-5'><option value=''>All Availability</option><option value='true'>Available Only</option><option value='false'>Unavailable Only</option></select></div><div className='flex flex-col sm:flex-col md:flex-col lg:flex-row gap-4 m-5'><input type='number' placeholder='Min Price' value={minPrice} onChange={e => setMinPrice(e.target.value)} className='flex-1 p-3 border border-solid m-5' /><input type='number' placeholder='Max Price' value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className='flex-1 p-3 border border-solid m-5' /></div></div><div className='w-full p-4 sm:p-5 md:p-5 lg:p-6'><div className='flex flex-col sm:flex-col md:flex-col lg:flex-row gap-4 m-5'><button onClick={handleAddProduct} className='p-3'>Add Product</button>{selectedProducts.length > 0 && <button onClick={handleBulkUpdate} className='p-3'>Bulk Update</button>}</div></div><div className='w-full p-4 sm:p-5 md:p-5 lg:p-6'><div className='grid grid-cols-1 gap-4'>{products.map(product => <div key={product.id} className='border border-solid p-4 flex flex-col sm:flex-col md:flex-col lg:flex-row gap-4'><input type='checkbox' checked={selectedProducts.includes(product.id)} onChange={() => toggleProductSelection(product.id)} className='m-5' />{product.primary_image_url && <div className='w-full lg:w-24 h-24'><img src={`data:image/jpeg;base64,${product.primary_image_url}`} className='w-full h-full object-cover' alt={product.name} /></div>}<div className='flex-1'><div className='font-bold'>{product.name}</div><div>SKU: {product.sku || "N/A"}</div><div>Price: {formatPrice(product.price)}</div><div>Stock: <span className={product.stock_quantity < 10 ? 'text-orange-600 font-bold' : product.stock_quantity === 0 ? 'text-red-600 font-bold' : ''}>{product.stock_quantity}</span></div><div>Status: <span className={product.available ? 'text-green-600' : 'text-red-600'}>{product.available ? "Available" : "Unavailable"}</span></div></div><div className='flex flex-col gap-2'><button onClick={() => handleEditProduct(product)} className='p-3'>Edit</button><button onClick={() => handleManageImages(product)} className='p-3'>Images</button><button onClick={() => handleDeleteProduct(product.id)} className='!bg-red-700 !text-white p-3'>Delete</button></div></div>)}</div></div><div className='w-full p-4 sm:p-5 md:p-5 lg:p-6 flex justify-center gap-4'>{currentPage > 1 && <button onClick={() => setCurrentPage(currentPage - 1)} className='p-3'>Previous</button>}<span className='m-5'>Page {currentPage} of {totalPages}</span>{currentPage < totalPages && <button onClick={() => setCurrentPage(currentPage + 1)} className='p-3'>Next</button>}</div>{showAddModal && <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-50' onClick={() => setShowAddModal(false)} /><div className='relative bg-white p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto text-gray-900'><button onClick={() => setShowAddModal(false)} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold'>×</button><div className='font-bold m-5'>Add New Product</div><select value={formData.categoriesid} onChange={e => setFormData({
          ...formData,
          categoriesid: e.target.value
        })} className='w-full p-3 border border-solid m-5'><option value=''>Select Category</option>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select><input type='text' placeholder='Product Name' value={formData.name} onChange={e => setFormData({
          ...formData,
          name: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><textarea placeholder='Description' value={formData.description} onChange={e => setFormData({
          ...formData,
          description: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><input type='number' placeholder='Price' value={formData.price} onChange={e => setFormData({
          ...formData,
          price: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><input type='text' placeholder='SKU' value={formData.sku} onChange={e => setFormData({
          ...formData,
          sku: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><input type='number' placeholder='Stock Quantity' value={formData.stock_quantity} onChange={e => setFormData({
          ...formData,
          stock_quantity: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><input type='text' placeholder='Size' value={formData.size} onChange={e => setFormData({
          ...formData,
          size: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><input type='text' placeholder='Color' value={formData.color} onChange={e => setFormData({
          ...formData,
          color: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><input type='text' placeholder='Material' value={formData.material} onChange={e => setFormData({
          ...formData,
          material: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><input type='text' placeholder='Era/Period' value={formData.era_period} onChange={e => setFormData({
          ...formData,
          era_period: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><textarea placeholder='Care Instructions' value={formData.care_instructions} onChange={e => setFormData({
          ...formData,
          care_instructions: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><label className='flex items-center m-5'><input type='checkbox' checked={formData.available} onChange={e => setFormData({
            ...formData,
            available: e.target.checked
          })} className='m-5' />Available</label><label className='flex items-center m-5'><input type='checkbox' checked={formData.featured} onChange={e => setFormData({
            ...formData,
            featured: e.target.checked
          })} className='m-5' />Featured</label><button onClick={handleSubmitAdd} className='w-full p-3 m-5'>Submit</button></div></div>}{showEditModal && <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-50' onClick={() => setShowEditModal(false)} /><div className='relative bg-white p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto text-gray-900'><button onClick={() => setShowEditModal(false)} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold'>×</button><div className='font-bold m-5'>Edit Product</div><select value={formData.categoriesid} onChange={e => setFormData({
          ...formData,
          categoriesid: e.target.value
        })} className='w-full p-3 border border-solid m-5'><option value=''>Select Category</option>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select><input type='text' placeholder='Product Name' value={formData.name} onChange={e => setFormData({
          ...formData,
          name: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><textarea placeholder='Description' value={formData.description} onChange={e => setFormData({
          ...formData,
          description: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><input type='number' placeholder='Price' value={formData.price} onChange={e => setFormData({
          ...formData,
          price: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><input type='text' placeholder='SKU' value={formData.sku} onChange={e => setFormData({
          ...formData,
          sku: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><input type='number' placeholder='Stock Quantity' value={formData.stock_quantity} onChange={e => setFormData({
          ...formData,
          stock_quantity: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><input type='text' placeholder='Size' value={formData.size} onChange={e => setFormData({
          ...formData,
          size: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><input type='text' placeholder='Color' value={formData.color} onChange={e => setFormData({
          ...formData,
          color: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><input type='text' placeholder='Material' value={formData.material} onChange={e => setFormData({
          ...formData,
          material: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><input type='text' placeholder='Era/Period' value={formData.era_period} onChange={e => setFormData({
          ...formData,
          era_period: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><textarea placeholder='Care Instructions' value={formData.care_instructions} onChange={e => setFormData({
          ...formData,
          care_instructions: e.target.value
        })} className='w-full p-3 border border-solid m-5' /><label className='flex items-center m-5'><input type='checkbox' checked={formData.available} onChange={e => setFormData({
            ...formData,
            available: e.target.checked
          })} className='m-5' />Available</label><label className='flex items-center m-5'><input type='checkbox' checked={formData.featured} onChange={e => setFormData({
            ...formData,
            featured: e.target.checked
          })} className='m-5' />Featured</label><button onClick={handleSubmitEdit} className='w-full p-3 m-5'>Submit</button></div></div>}{showImageModal && <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-50' onClick={() => setShowImageModal(false)} /><div className='relative bg-white p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto text-gray-900'><button onClick={() => setShowImageModal(false)} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold'>×</button><div className='font-bold m-5'>Manage Images</div><div className='border-2 border-dashed bg-gray-50 p-6 m-5'><input type='file' accept='image/*' onChange={handleImageFileUpload} className='w-full' /><div className='m-5'>Upload new image</div></div><div className='grid grid-cols-1 gap-4'>{productImages.map(img => <div key={img.id} className='border border-solid p-4'><div className='bg-gray-100 p-4 m-5'><div className='w-full h-48'><img src={`data:image/jpeg;base64,${img.image_url}`} className='w-full h-full object-contain' alt={img.caption || "Product image"} /></div></div>{img.is_primary && <div className='bg-green-100 text-green-800 p-2 m-5'>Primary Image</div>}<div className='flex gap-2 m-5'>{!img.is_primary && <button onClick={() => handleSetPrimaryImage(img.id)} className='p-3'>Set Primary</button>}<button onClick={() => handleDeleteImage(img.id)} className='!bg-red-700 !text-white p-3'>Delete</button></div></div>)}</div></div></div>}{showBulkModal && <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-50' onClick={() => setShowBulkModal(false)} /><div className='relative bg-white p-6 w-full max-w-lg text-gray-900'><button onClick={() => setShowBulkModal(false)} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold'>×</button><div className='font-bold m-5'>Bulk Update</div><div className='m-5'><div className='m-5'>Selected products: {selectedProducts.length}</div><button onClick={() => {
            const newPrice = prompt("Enter new price:");
            if (newPrice) handleSubmitBulk('price', newPrice);
          }} className='w-full p-3 m-5'>Update Price</button><button onClick={() => {
            const newStock = prompt("Enter new stock quantity:");
            if (newStock) handleSubmitBulk('stock_quantity', newStock);
          }} className='w-full p-3 m-5'>Update Stock</button></div></div></div>}{showMessageModal && <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-50' onClick={() => setShowMessageModal(false)} /><div className='relative bg-white p-6 w-full max-w-lg text-gray-900'><button onClick={() => setShowMessageModal(false)} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold'>×</button><div className='m-5'>{message}</div><button onClick={() => setShowMessageModal(false)} className='w-full p-3 m-5'>Close</button></div></div>}</div>;
}