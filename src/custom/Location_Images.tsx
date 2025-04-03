'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function LocationImagesGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    ID: "",
    LocationsID: "",
    image: "",
    caption: ""
  });
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    setIsAdmin(true);
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const locationId = urlParams.get("LocationsID");
    if (!locationId) {
      setError("Location ID not found in URL");
      setLoading(false);
      return;
    }
    fetchImages(locationId);
  }, []);
  const fetchImages = async locationId => {
    try {
      setLoading(true);
      const response = await fetch(`/api/locationimages`);
      if (!response.ok) {
        throw new Error(`Error fetching images: ${response.statusText}`);
      }
      const data = await response.json();
      const locationImages = data.filter(img => img.LocationsID === locationId);
      setImages(locationImages);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  const handleOpenAddModal = () => {
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const locationId = urlParams.get("LocationsID");
    setFormData({
      ID: crypto.randomUUID(),
      LocationsID: locationId,
      image: "",
      caption: ""
    });
    setModalMode("add");
    setShowModal(true);
  };
  const handleOpenEditModal = image => {
    setSelectedImage(image);
    setFormData({
      ID: image.ID,
      LocationsID: image.LocationsID,
      image: image.image,
      caption: image.caption || ""
    });
    setModalMode("edit");
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
    setFormData({
      ID: "",
      LocationsID: "",
      image: "",
      caption: ""
    });
  };
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData(prev => ({
        ...prev,
        image: base64String
      }));
    };
    reader.readAsDataURL(file);
  };
  const handleSubmit = async () => {
    try {
      let response;
      if (modalMode === "add") {
        response = await fetch('/api/locationimages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      } else {
        response = await fetch(`/api/locationimages/${formData.ID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      }
      if (!response.ok) {
        throw new Error(`Error ${modalMode === "add" ? "adding" : "updating"} image: ${response.statusText}`);
      }
      if (modalMode === "add") {
        setImages(prev => [...prev, formData]);
      } else {
        setImages(prev => prev.map(img => img.ID === formData.ID ? formData : img));
      }
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };
  const handleDelete = async imageId => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }
    try {
      const response = await fetch(`/api/locationimages/${imageId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Error deleting image: ${response.statusText}`);
      }
      setImages(prev => prev.filter(img => img.ID !== imageId));
    } catch (err) {
      setError(err.message);
    }
  };
  if (loading) {
    return <div className='p-4'>Loading images...</div>;
  }
  if (error) {
    return <div className='p-4 border border-red-500'>{error}</div>;
  }
  return <div className='p-4'><h1 className='mb-6'>Location Images</h1>{isAdmin && <div className='mb-6'><button className='border p-2 mb-4' onClick={handleOpenAddModal}>Add New Image</button></div>}<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>{images.length > 0 ? images.map(image => <div key={image.ID} className='border p-4'>{image.image ? <img src={image.image.startsWith("data:") ? image.image : `data:image/jpeg;base64,${image.image}`} alt={image.caption || "Location image"} className='mb-2' onError={e => {
          e.target.outerHTML = "Image not found";
        }} /> : <div>Image not found</div>}<p className='mb-2'>{image.caption || "No caption"}</p>{isAdmin && <div className='flex space-x-2 mt-2'><button className='border p-1' onClick={() => handleOpenEditModal(image)}>Edit</button><button className='border p-1' onClick={() => handleDelete(image.ID)}>Delete</button></div>}</div>) : <p>No images found for this location.</p>}</div>{showModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4' style={{
      zIndex: 1000
    }}><div className='bg-white p-6 border max-w-lg w-full'><h1 className='mb-4'>{modalMode === "add" ? "Add New Image" : "Edit Image"}</h1><div className='space-y-4'><div className='mb-4'><label className='block mb-1'>Image:</label><input type='file' accept='image/*' onChange={handleImageUpload} />{formData.image && <div className='mt-2'><img src={formData.image} alt='Preview' className='mt-2 max-h-40' /></div>}</div><div className='mb-4'><label className='block mb-1'>Caption:</label><input type='text' name='caption' value={formData.caption} onChange={handleInputChange} className='border p-2 w-full' /></div><div className='flex justify-end space-x-2 mt-6'><button className='border p-2' onClick={handleCloseModal}>Cancel</button><button className='border p-2' onClick={handleSubmit} disabled={!formData.image}>{modalMode === "add" ? "Add Image" : "Update Image"}</button></div></div></div></div>}</div>;
}