'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [soundLibrary, setSoundLibrary] = useState([]);
  const [wellnessResources, setWellnessResources] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [servicesPage, setServicesPage] = useState(1);
  const [soundLibraryPage, setSoundLibraryPage] = useState(1);
  const [wellnessResourcesPage, setWellnessResourcesPage] = useState(1);
  const [testimonialsPage, setTestimonialsPage] = useState(1);
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [serviceBenefits, setServiceBenefits] = useState('');
  const [serviceImage, setServiceImage] = useState('');
  const [serviceAvailable, setServiceAvailable] = useState(true);
  const [serviceDisplayOrder, setServiceDisplayOrder] = useState('');
  const [soundTitle, setSoundTitle] = useState('');
  const [soundDescription, setSoundDescription] = useState('');
  const [soundAudioFile, setSoundAudioFile] = useState('');
  const [soundCategory, setSoundCategory] = useState('');
  const [soundDuration, setSoundDuration] = useState('');
  const [soundBenefits, setSoundBenefits] = useState('');
  const [soundIsGuided, setSoundIsGuided] = useState(false);
  const [soundThumbnail, setSoundThumbnail] = useState('');
  const [soundPublished, setSoundPublished] = useState(true);
  const [soundDisplayOrder, setSoundDisplayOrder] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceContent, setResourceContent] = useState('');
  const [resourceCategory, setResourceCategory] = useState('');
  const [resourceAuthor, setResourceAuthor] = useState('');
  const [resourcePublishedDate, setResourcePublishedDate] = useState('');
  const [resourceTags, setResourceTags] = useState('');
  const [resourceFeaturedImage, setResourceFeaturedImage] = useState('');
  const [resourcePublished, setResourcePublished] = useState(true);
  const [resourceFeatured, setResourceFeatured] = useState(false);
  const [resourceDisplayOrder, setResourceDisplayOrder] = useState('');
  const [testimonialClientName, setTestimonialClientName] = useState('');
  const [testimonialContent, setTestimonialContent] = useState('');
  const [testimonialRating, setTestimonialRating] = useState('');
  const [testimonialServiceName, setTestimonialServiceName] = useState('');
  const [testimonialDateGiven, setTestimonialDateGiven] = useState('');
  const [testimonialFeatured, setTestimonialFeatured] = useState(false);
  const [testimonialApproved, setTestimonialApproved] = useState(false);
  const [testimonialClientPhoto, setTestimonialClientPhoto] = useState('');
  const [testimonialDisplayOrder, setTestimonialDisplayOrder] = useState('');
  const handleUnauthorized = () => {
    setIsUnauthorized(true);
    setModalMessage("Please log in to access the sound library.");
    setShowModal(true);
  };
  const fetchServices = async () => {
    try {
      const response = await fetch(`/api/serviceslist?page=${servicesPage}&limit=20`);
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await response.json();
      setServices(data.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
  const fetchSoundLibrary = async () => {
    try {
      const response = await fetch(`/api/soundlibrarylist?page=${soundLibraryPage}&limit=20`);
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await response.json();
      setSoundLibrary(data.data || []);
    } catch (error) {
      console.error('Error fetching sound library:', error);
    }
  };
  const fetchWellnessResources = async () => {
    try {
      const response = await fetch(`/api/wellnessresourceslist?page=${wellnessResourcesPage}&limit=20`);
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await response.json();
      setWellnessResources(data.data || []);
    } catch (error) {
      console.error('Error fetching wellness resources:', error);
    }
  };
  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`/api/testimonialslist?page=${testimonialsPage}&limit=20`);
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await response.json();
      setTestimonials(data.data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  useEffect(() => {
    fetchServices();
    fetchSoundLibrary();
    fetchWellnessResources();
    fetchTestimonials();
    fetchUsers();
  }, [servicesPage, soundLibraryPage, wellnessResourcesPage, testimonialsPage]);
  const clearServiceForm = () => {
    setServiceName('');
    setServiceDescription('');
    setServiceDuration('');
    setServicePrice('');
    setServiceCategory('');
    setServiceBenefits('');
    setServiceImage('');
    setServiceAvailable(true);
    setServiceDisplayOrder('');
  };
  const clearSoundForm = () => {
    setSoundTitle('');
    setSoundDescription('');
    setSoundAudioFile('');
    setSoundCategory('');
    setSoundDuration('');
    setSoundBenefits('');
    setSoundIsGuided(false);
    setSoundThumbnail('');
    setSoundPublished(true);
    setSoundDisplayOrder('');
  };
  const clearResourceForm = () => {
    setResourceTitle('');
    setResourceContent('');
    setResourceCategory('');
    setResourceAuthor('');
    setResourcePublishedDate('');
    setResourceTags('');
    setResourceFeaturedImage('');
    setResourcePublished(true);
    setResourceFeatured(false);
    setResourceDisplayOrder('');
  };
  const clearTestimonialForm = () => {
    setTestimonialClientName('');
    setTestimonialContent('');
    setTestimonialRating('');
    setTestimonialServiceName('');
    setTestimonialDateGiven('');
    setTestimonialFeatured(false);
    setTestimonialApproved(false);
    setTestimonialClientPhoto('');
    setTestimonialDisplayOrder('');
  };
  const populateServiceForm = service => {
    setServiceName(service.name || '');
    setServiceDescription(service.description || '');
    setServiceDuration(service.duration?.toString() || '');
    setServicePrice(service.price?.toString() || '');
    setServiceCategory(service.category || '');
    setServiceBenefits(service.benefits || '');
    setServiceImage(service.service_image || '');
    setServiceAvailable(service.available ?? true);
    setServiceDisplayOrder(service.display_order?.toString() || '');
  };
  const populateSoundForm = sound => {
    setSoundTitle(sound.title || '');
    setSoundDescription(sound.description || '');
    setSoundAudioFile(sound.audio_file || '');
    setSoundCategory(sound.category || '');
    setSoundDuration(sound.duration?.toString() || '');
    setSoundBenefits(sound.benefits || '');
    setSoundIsGuided(sound.is_guided_meditation ?? false);
    setSoundThumbnail(sound.thumbnail_image || '');
    setSoundPublished(sound.published ?? true);
    setSoundDisplayOrder(sound.display_order?.toString() || '');
  };
  const populateResourceForm = resource => {
    setResourceTitle(resource.title || '');
    setResourceContent(resource.content || '');
    setResourceCategory(resource.category || '');
    setResourceAuthor(resource.author || '');
    setResourcePublishedDate(resource.published_date || '');
    setResourceTags(resource.tags || '');
    setResourceFeaturedImage(resource.featured_image || '');
    setResourcePublished(resource.published ?? true);
    setResourceFeatured(resource.featured ?? false);
    setResourceDisplayOrder(resource.display_order?.toString() || '');
  };
  const populateTestimonialForm = testimonial => {
    setTestimonialClientName(testimonial.client_name || '');
    setTestimonialContent(testimonial.content || '');
    setTestimonialRating(testimonial.rating?.toString() || '');
    setTestimonialServiceName(testimonial.service_name || '');
    setTestimonialDateGiven(testimonial.date_given || '');
    setTestimonialFeatured(testimonial.featured ?? false);
    setTestimonialApproved(testimonial.approved ?? false);
    setTestimonialClientPhoto(testimonial.client_photo || '');
    setTestimonialDisplayOrder(testimonial.display_order?.toString() || '');
  };
  const handleAddService = () => {
    clearServiceForm();
    setEditingItem(null);
    setModalType('service');
    setShowModal(true);
  };
  const handleEditService = service => {
    populateServiceForm(service);
    setEditingItem(service);
    setModalType('service');
    setShowModal(true);
  };
  const handleAddSound = () => {
    clearSoundForm();
    setEditingItem(null);
    setModalType('sound');
    setShowModal(true);
  };
  const handleEditSound = sound => {
    populateSoundForm(sound);
    setEditingItem(sound);
    setModalType('sound');
    setShowModal(true);
  };
  const handleAddResource = () => {
    clearResourceForm();
    setEditingItem(null);
    setModalType('resource');
    setShowModal(true);
  };
  const handleEditResource = resource => {
    populateResourceForm(resource);
    setEditingItem(resource);
    setModalType('resource');
    setShowModal(true);
  };
  const handleEditTestimonial = testimonial => {
    populateTestimonialForm(testimonial);
    setEditingItem(testimonial);
    setModalType('testimonial');
    setShowModal(true);
  };
  const handleServiceSubmit = async () => {
    try {
      const serviceData = {
        name: serviceName,
        description: serviceDescription,
        duration: parseInt(serviceDuration) || 0,
        price: parseFloat(servicePrice) || 0,
        category: serviceCategory,
        benefits: serviceBenefits,
        service_image: serviceImage,
        available: serviceAvailable,
        display_order: parseInt(serviceDisplayOrder) || 0
      };
      if (editingItem) {
        serviceData.id = editingItem.id;
        const response = await fetch('/api/servicesupdate', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(serviceData)
        });
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        if (response.ok) {
          const updatedService = await response.json();
          setServices(services.map(s => s.id === editingItem.id ? updatedService : s));
          setModalMessage("Service updated successfully");
        }
      } else {
        const response = await fetch('/api/servicescreate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(serviceData)
        });
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        if (response.ok) {
          const newService = await response.json();
          setServices([...services, newService]);
          setModalMessage("Service created successfully");
        }
      }
    } catch (error) {
      setModalMessage("Error saving service");
    }
    setShowModal(false);
    setTimeout(() => {
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    }, 100);
  };
  const handleSoundSubmit = async () => {
    try {
      const soundData = {
        title: soundTitle,
        description: soundDescription,
        audio_file: soundAudioFile,
        category: soundCategory,
        duration: parseInt(soundDuration) || 0,
        benefits: soundBenefits,
        is_guided_meditation: soundIsGuided,
        thumbnail_image: soundThumbnail,
        published: soundPublished,
        display_order: parseInt(soundDisplayOrder) || 0
      };
      if (editingItem) {
        soundData.id = editingItem.id;
        const response = await fetch('/api/soundlibraryupdate', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(soundData)
        });
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        if (response.ok) {
          const updatedSound = await response.json();
          setSoundLibrary(soundLibrary.map(s => s.id === editingItem.id ? updatedSound : s));
          setModalMessage("Sound updated successfully");
        }
      } else {
        const response = await fetch('/api/soundlibrarycreate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(soundData)
        });
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        if (response.ok) {
          const newSound = await response.json();
          setSoundLibrary([...soundLibrary, newSound]);
          setModalMessage("Sound created successfully");
        }
      }
    } catch (error) {
      setModalMessage("Error saving sound");
    }
    setShowModal(false);
    setTimeout(() => {
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    }, 100);
  };
  const handleResourceSubmit = async () => {
    try {
      const resourceData = {
        title: resourceTitle,
        content: resourceContent,
        category: resourceCategory,
        author: resourceAuthor,
        published_date: resourcePublishedDate,
        tags: resourceTags,
        featured_image: resourceFeaturedImage,
        published: resourcePublished,
        featured: resourceFeatured,
        display_order: parseInt(resourceDisplayOrder) || 0
      };
      if (editingItem) {
        resourceData.id = editingItem.id;
        const response = await fetch('/api/wellnessresourcesupdate', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(resourceData)
        });
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        if (response.ok) {
          const updatedResource = await response.json();
          setWellnessResources(wellnessResources.map(r => r.id === editingItem.id ? updatedResource : r));
          setModalMessage("Resource updated successfully");
        }
      } else {
        const response = await fetch('/api/wellnessresourcescreate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(resourceData)
        });
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        if (response.ok) {
          const newResource = await response.json();
          setWellnessResources([...wellnessResources, newResource]);
          setModalMessage("Resource created successfully");
        }
      }
    } catch (error) {
      setModalMessage("Error saving resource");
    }
    setShowModal(false);
    setTimeout(() => {
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    }, 100);
  };
  const handleTestimonialSubmit = async () => {
    try {
      const testimonialData = {
        id: editingItem.id,
        client_name: testimonialClientName,
        content: testimonialContent,
        rating: parseInt(testimonialRating) || 0,
        service_name: testimonialServiceName,
        date_given: testimonialDateGiven,
        featured: testimonialFeatured,
        approved: testimonialApproved,
        client_photo: testimonialClientPhoto,
        display_order: parseInt(testimonialDisplayOrder) || 0
      };
      const response = await fetch('/api/testimonialsupdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testimonialData)
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (response.ok) {
        const updatedTestimonial = await response.json();
        setTestimonials(testimonials.map(t => t.id === editingItem.id ? updatedTestimonial : t));
        setModalMessage("Testimonial updated successfully");
      }
    } catch (error) {
      setModalMessage("Error saving testimonial");
    }
    setShowModal(false);
    setTimeout(() => {
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    }, 100);
  };
  const handleDeleteService = async serviceId => {
    try {
      const response = await fetch('/api/servicesdelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: serviceId
        })
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (response.ok) {
        setServices(services.filter(s => s.id !== serviceId));
        setModalMessage("Service deleted successfully");
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
      }
    } catch (error) {
      setModalMessage("Failed to delete journal entry");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    }
  };
  const handleDeleteSound = async soundId => {
    try {
      const response = await fetch('/api/soundlibrarydelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: soundId
        })
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (response.ok) {
        setSoundLibrary(soundLibrary.filter(s => s.id !== soundId));
        setModalMessage("Sound deleted successfully");
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
      }
    } catch (error) {
      setModalMessage("Failed to delete journal entry");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    }
  };
  const handleDeleteResource = async resourceId => {
    try {
      const response = await fetch('/api/wellnessresourcesdelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: resourceId
        })
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (response.ok) {
        setWellnessResources(wellnessResources.filter(r => r.id !== resourceId));
        setModalMessage("Resource deleted successfully");
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
      }
    } catch (error) {
      setModalMessage("Failed to delete journal entry");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    }
  };
  const handleDeleteTestimonial = async testimonialId => {
    try {
      const response = await fetch('/api/testimonialsdelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: testimonialId
        })
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (response.ok) {
        setTestimonials(testimonials.filter(t => t.id !== testimonialId));
        setModalMessage("Testimonial deleted successfully");
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
      }
    } catch (error) {
      setModalMessage("Failed to delete journal entry");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    }
  };
  const handleFileUpload = (event, setFileState) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setFileState(e.target.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };
  if (isUnauthorized && !showModal) {
    return <div className='w-full h-full flex items-center justify-center'><div className='p-10 text-center'>Access Denied</div></div>;
  }
  const renderServiceForm = () => {
    return <div className='flex flex-col p-5'><input type='text' placeholder='Service Name' value={serviceName} onChange={e => setServiceName(e.target.value)} className='m-5 p-3 border' /><textarea placeholder='Service Description' value={serviceDescription} onChange={e => setServiceDescription(e.target.value)} className='m-5 p-3 border' rows={4} /><input type='number' placeholder='Duration (minutes)' value={serviceDuration} onChange={e => setServiceDuration(e.target.value)} className='m-5 p-3 border' /><input type='number' step='0.01' placeholder='Price' value={servicePrice} onChange={e => setServicePrice(e.target.value)} className='m-5 p-3 border' /><input type='text' placeholder='Category' value={serviceCategory} onChange={e => setServiceCategory(e.target.value)} className='m-5 p-3 border' /><textarea placeholder='Benefits' value={serviceBenefits} onChange={e => setServiceBenefits(e.target.value)} className='m-5 p-3 border' rows={3} /><input type='file' accept='image/*' onChange={e => handleFileUpload(e, setServiceImage)} className='m-5 p-3 border' /><label className='m-5 flex items-center'><input type='checkbox' checked={serviceAvailable} onChange={e => setServiceAvailable(e.target.checked)} className='mr-3' />Available</label><input type='number' placeholder='Display Order' value={serviceDisplayOrder} onChange={e => setServiceDisplayOrder(e.target.value)} className='m-5 p-3 border' /><button onClick={handleServiceSubmit} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-5'>{editingItem ? "Update Service" : "Create Service"}</button></div>;
  };
  const renderSoundForm = () => {
    return <div className='flex flex-col p-5'><input type='text' placeholder='Title' value={soundTitle} onChange={e => setSoundTitle(e.target.value)} className='m-5 p-3 border' /><textarea placeholder='Description' value={soundDescription} onChange={e => setSoundDescription(e.target.value)} className='m-5 p-3 border' rows={4} /><input type='file' accept='audio/*' onChange={e => handleFileUpload(e, setSoundAudioFile)} className='m-5 p-3 border' /><input type='text' placeholder='Category' value={soundCategory} onChange={e => setSoundCategory(e.target.value)} className='m-5 p-3 border' /><input type='number' placeholder='Duration (seconds)' value={soundDuration} onChange={e => setSoundDuration(e.target.value)} className='m-5 p-3 border' /><textarea placeholder='Benefits' value={soundBenefits} onChange={e => setSoundBenefits(e.target.value)} className='m-5 p-3 border' rows={3} /><label className='m-5 flex items-center'><input type='checkbox' checked={soundIsGuided} onChange={e => setSoundIsGuided(e.target.checked)} className='mr-3' />Is Guided Meditation</label><input type='file' accept='image/*' onChange={e => handleFileUpload(e, setSoundThumbnail)} className='m-5 p-3 border' /><label className='m-5 flex items-center'><input type='checkbox' checked={soundPublished} onChange={e => setSoundPublished(e.target.checked)} className='mr-3' />Published</label><input type='number' placeholder='Display Order' value={soundDisplayOrder} onChange={e => setSoundDisplayOrder(e.target.value)} className='m-5 p-3 border' /><button onClick={handleSoundSubmit} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-5'>{editingItem ? "Update Sound" : "Create Sound"}</button></div>;
  };
  const renderResourceForm = () => {
    return <div className='flex flex-col p-5'><input type='text' placeholder='Title' value={resourceTitle} onChange={e => setResourceTitle(e.target.value)} className='m-5 p-3 border' /><textarea placeholder='Content' value={resourceContent} onChange={e => setResourceContent(e.target.value)} className='m-5 p-3 border' rows={6} /><input type='text' placeholder='Category' value={resourceCategory} onChange={e => setResourceCategory(e.target.value)} className='m-5 p-3 border' /><input type='text' placeholder='Author' value={resourceAuthor} onChange={e => setResourceAuthor(e.target.value)} className='m-5 p-3 border' /><input type='date' placeholder='Published Date' value={resourcePublishedDate} onChange={e => setResourcePublishedDate(e.target.value)} className='m-5 p-3 border' /><input type='text' placeholder='Tags' value={resourceTags} onChange={e => setResourceTags(e.target.value)} className='m-5 p-3 border' /><input type='file' accept='image/*' onChange={e => handleFileUpload(e, setResourceFeaturedImage)} className='m-5 p-3 border' /><label className='m-5 flex items-center'><input type='checkbox' checked={resourcePublished} onChange={e => setResourcePublished(e.target.checked)} className='mr-3' />Published</label><label className='m-5 flex items-center'><input type='checkbox' checked={resourceFeatured} onChange={e => setResourceFeatured(e.target.checked)} className='mr-3' />Featured</label><input type='number' placeholder='Display Order' value={resourceDisplayOrder} onChange={e => setResourceDisplayOrder(e.target.value)} className='m-5 p-3 border' /><button onClick={handleResourceSubmit} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-5'>{editingItem ? "Update Resource" : "Create Resource"}</button></div>;
  };
  const renderTestimonialForm = () => {
    return <div className='flex flex-col p-5'><input type='text' placeholder='Client Name' value={testimonialClientName} onChange={e => setTestimonialClientName(e.target.value)} className='m-5 p-3 border' /><textarea placeholder='Testimonial Content' value={testimonialContent} onChange={e => setTestimonialContent(e.target.value)} className='m-5 p-3 border' rows={4} /><input type='number' min='1' max='5' placeholder='Rating (1-5)' value={testimonialRating} onChange={e => setTestimonialRating(e.target.value)} className='m-5 p-3 border' /><input type='text' placeholder='Service Name' value={testimonialServiceName} onChange={e => setTestimonialServiceName(e.target.value)} className='m-5 p-3 border' /><input type='date' placeholder='Date Given' value={testimonialDateGiven} onChange={e => setTestimonialDateGiven(e.target.value)} className='m-5 p-3 border' /><label className='m-5 flex items-center'><input type='checkbox' checked={testimonialFeatured} onChange={e => setTestimonialFeatured(e.target.checked)} className='mr-3' />Featured</label><label className='m-5 flex items-center'><input type='checkbox' checked={testimonialApproved} onChange={e => setTestimonialApproved(e.target.checked)} className='mr-3' />Approved</label><input type='file' accept='image/*' onChange={e => handleFileUpload(e, setTestimonialClientPhoto)} className='m-5 p-3 border' /><input type='number' placeholder='Display Order' value={testimonialDisplayOrder} onChange={e => setTestimonialDisplayOrder(e.target.value)} className='m-5 p-3 border' /><button onClick={handleTestimonialSubmit} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-5'>Update Testimonial</button></div>;
  };
  const renderModal = () => {
    if (!showModal) return null;
    let modalContent;
    if (modalType === 'service') {
      modalContent = renderServiceForm();
    } else if (modalType === 'sound') {
      modalContent = renderSoundForm();
    } else if (modalType === 'resource') {
      modalContent = renderResourceForm();
    } else if (modalType === 'testimonial') {
      modalContent = renderTestimonialForm();
    } else {
      modalContent = <div className='p-5 text-center'>{modalMessage}</div>;
    }
    return <div className='fixed inset-0 !bg-black !bg-opacity-50 flex items-center justify-center z-[1000]'><div className='max-w-2xl w-full max-h-full overflow-y-auto !bg-white p-5 m-5'>{modalContent}<button onClick={() => setShowModal(false)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-5'>Close</button></div></div>;
  };
  const formatPrice = price => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  const renderServicesTab = () => {
    return <div className='p-5'><div className='flex justify-between items-center mb-5'><h2>Services Management</h2><button onClick={handleAddService} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Add Service</button></div>{services.length === 0 ? <p>No services found matching your criteria.</p> : <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>{services.map(service => <div key={service.id} className='border p-5 w-full h-full'><h3>{service.name}</h3><p className='text-green-600 font-bold'>{formatPrice(service.price)}</p><p>{service.category}</p>{service.service_image && <img src={`data:image/jpeg;base64,${service.service_image}`} alt={service.name} className='w-auto h-auto max-w-full max-h-full' />}<p>{`${"Duration: "}: ${service.duration} ${" minutes"}`}</p><p className={service.available ? 'text-green-600' : 'text-red-600'}>{service.available ? "Available" : "Currently Unavailable"}</p><div className='flex gap-3 mt-3'><button onClick={() => handleEditService(service)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Edit</button><button onClick={() => handleDeleteService(service.id)} className='!bg-red-700 !text-white p-3'>Delete</button></div></div>)}</div>}</div>;
  };
  const renderSoundLibraryTab = () => {
    return <div className='p-5'><div className='flex justify-between items-center mb-5'><h2>Sound Library Management</h2><button onClick={handleAddSound} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Add Sound</button></div>{soundLibrary.length === 0 ? <p>No sounds found</p> : <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>{soundLibrary.map(sound => <div key={sound.id} className='border p-5 w-full h-full'><h3>{sound.title}</h3><p>{sound.category}</p>{sound.thumbnail_image && <img src={`data:image/jpeg;base64,${sound.thumbnail_image}`} alt={sound.title} className='w-auto h-auto max-w-full max-h-full' />}{sound.duration && <p>{`${"Duration: "}: ${sound.duration} ${"seconds"}`}</p>}<p className={sound.is_guided_meditation ? 'text-blue-600' : ''}>{sound.is_guided_meditation ? "Guided Meditation" : "Sound Healing"}</p><p className={sound.published ? 'text-green-600' : 'text-red-600'}>{sound.published ? "Published" : "Unpublished"}</p><div className='flex gap-3 mt-3'><button onClick={() => handleEditSound(sound)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Edit</button><button onClick={() => handleDeleteSound(sound.id)} className='!bg-red-700 !text-white p-3'>Delete</button></div></div>)}</div>}</div>;
  };
  const renderWellnessResourcesTab = () => {
    return <div className='p-5'><div className='flex justify-between items-center mb-5'><h2>Wellness Resources Management</h2><button onClick={handleAddResource} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Add Resource</button></div>{wellnessResources.length === 0 ? <p>No resources found matching your criteria.</p> : <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>{wellnessResources.map(resource => <div key={resource.id} className='border p-5 w-full h-full'><h3>{resource.title}</h3><p>{resource.category}</p>{resource.author && <p>{`${"Author"}: ${resource.author}`}</p>}{resource.featured_image && <img src={`data:image/jpeg;base64,${resource.featured_image}`} alt={resource.title} className='w-auto h-auto max-w-full max-h-full' />}<p>{`${"Published"}: ${resource.published_date}`}</p><p className={resource.featured ? 'text-blue-600 font-bold' : ''}>{resource.featured ? "Featured" : ''}</p><p className={resource.published ? 'text-green-600' : 'text-red-600'}>{resource.published ? "Published" : "Unpublished"}</p><div className='flex gap-3 mt-3'><button onClick={() => handleEditResource(resource)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Edit</button><button onClick={() => handleDeleteResource(resource.id)} className='!bg-red-700 !text-white p-3'>Delete</button></div></div>)}</div>}</div>;
  };
  const renderTestimonialsTab = () => {
    return <div className='p-5'><h2 className='mb-5'>Testimonials Management</h2>{testimonials.length === 0 ? <p>No testimonials found matching your criteria.</p> : <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>{testimonials.map(testimonial => <div key={testimonial.id} className='border p-5 w-full h-full'><h3>{testimonial.client_name}</h3><p className='text-yellow-600 font-bold'>{`${"Rating"}: ${testimonial.rating}/5`}</p>{testimonial.service_name && <p>{`${"Service: "}: ${testimonial.service_name}`}</p>}{testimonial.client_photo && <img src={`data:image/jpeg;base64,${testimonial.client_photo}`} alt={testimonial.client_name} className='w-auto h-auto max-w-full max-h-full' />}<p>{`${"Date: "}: ${testimonial.date_given}`}</p><p className={testimonial.featured ? 'text-blue-600 font-bold' : ''}>{testimonial.featured ? "Featured" : ''}</p><p className={testimonial.approved ? 'text-green-600' : 'text-red-600'}>{testimonial.approved ? "Approved" : "Pending Approval"}</p><div className='flex gap-3 mt-3'><button onClick={() => handleEditTestimonial(testimonial)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Edit</button><button onClick={() => handleDeleteTestimonial(testimonial.id)} className='!bg-red-700 !text-white p-3'>Delete</button></div></div>)}</div>}</div>;
  };
  const renderUsersTab = () => {
    return <div className='p-5'><h2 className='mb-5'>Users Management</h2>{users.length === 0 ? <p>No users found</p> : <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>{users.map(user => <div key={user.id} className='border p-5 w-full h-full'><h3>{user.username}</h3>{user.avatarurl && <img src={user.avatarurl} alt={user.username} className='w-auto h-auto max-w-full max-h-full' />}<p>{`${"Level"}: ${user.userlevel}`}</p><p className={user.isadmin ? 'text-blue-600 font-bold' : ''}>{user.isadmin ? "Admin User" : "Regular User"}</p><p>{`${"OAuth ID"}: ${user.oauthid}`}</p></div>)}</div>}</div>;
  };
  return <div className='w-full h-full flex flex-col'><div className='flex flex-col lg:flex-row border-b'><button onClick={() => setActiveTab('services')} className={`border !text-gray-800 border-gray-300 !bg-transparent p-3 ${activeTab === 'services' ? 'border-2 border-blue-500 !text-black !bg-blue-100' : ''}`}>Services</button><button onClick={() => setActiveTab('sounds')} className={`border !text-gray-800 border-gray-300 !bg-transparent p-3 ${activeTab === 'sounds' ? 'border-2 border-blue-500 !text-black !bg-blue-100' : ''}`}>Sound Library</button><button onClick={() => setActiveTab('resources')} className={`border !text-gray-800 border-gray-300 !bg-transparent p-3 ${activeTab === 'resources' ? 'border-2 border-blue-500 !text-black !bg-blue-100' : ''}`}>Wellness Resources</button><button onClick={() => setActiveTab('testimonials')} className={`border !text-gray-800 border-gray-300 !bg-transparent p-3 ${activeTab === 'testimonials' ? 'border-2 border-blue-500 !text-black !bg-blue-100' : ''}`}>Testimonials</button><button onClick={() => setActiveTab('users')} className={`border !text-gray-800 border-gray-300 !bg-transparent p-3 ${activeTab === 'users' ? 'border-2 border-blue-500 !text-black !bg-blue-100' : ''}`}>Users</button></div><div className='flex-1 overflow-y-auto'>{activeTab === 'services' && renderServicesTab()}{activeTab === 'sounds' && renderSoundLibraryTab()}{activeTab === 'resources' && renderWellnessResourcesTab()}{activeTab === 'testimonials' && renderTestimonialsTab()}{activeTab === 'users' && renderUsersTab()}</div>{renderModal()}</div>;
}