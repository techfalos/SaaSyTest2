'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function EventsListView() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [eventTypes, setEventTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  useEffect(() => {
    fetchEvents();
  }, []);
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        const types = [...new Set(data.map(event => event.event_type))];
        setEventTypes(types);
      } else {
        console.error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = e => {
    setSearchTerm(e.target.value);
  };
  const handleStartDateChange = e => {
    setStartDate(e.target.value);
  };
  const handleEndDateChange = e => {
    setEndDate(e.target.value);
  };
  const handleEventTypeChange = e => {
    setSelectedEventType(e.target.value);
  };
  const resetFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setSelectedEventType('');
  };
  const openEventDetails = event => {
    setCurrentEvent(event);
    setModalMode('view');
    setShowModal(true);
  };
  const openEditModal = event => {
    setCurrentEvent({
      ...event
    });
    setModalMode('edit');
    setShowModal(true);
  };
  const openAddModal = () => {
    setCurrentEvent({
      ID: crypto.randomUUID(),
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      location: '',
      event_type: '',
      event_image: null
    });
    setModalMode('add');
    setShowModal(true);
  };
  const openDeleteModal = event => {
    setCurrentEvent(event);
    setModalMode('delete');
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setCurrentEvent(null);
  };
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setCurrentEvent({
      ...currentEvent,
      [name]: value
    });
  };
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        setCurrentEvent({
          ...currentEvent,
          event_image: event.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSaveEvent = async () => {
    try {
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const url = modalMode === 'add' ? '/api/events' : `/api/events/${currentEvent.ID}`;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentEvent)
      });
      if (response.ok) {
        if (modalMode === 'add') {
          setEvents([...events, currentEvent]);
        } else {
          setEvents(events.map(event => event.ID === currentEvent.ID ? currentEvent : event));
        }
        closeModal();
      } else {
        console.error('Failed to save event');
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };
  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`/api/events/${currentEvent.ID}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setEvents(events.filter(event => event.ID !== currentEvent.ID));
        closeModal();
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };
  const navigateToEventDetails = eventId => {
    router.push(`/event_details?EventsID=${eventId}`);
  };
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStartDate = startDate ? new Date(event.start_date) >= new Date(startDate) : true;
    const matchesEndDate = endDate ? new Date(event.end_date) <= new Date(endDate) : true;
    const matchesEventType = selectedEventType ? event.event_type === selectedEventType : true;
    return matchesSearch && matchesStartDate && matchesEndDate && matchesEventType;
  });
  const formatDate = dateString => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return <div className='p-4'><h1 className='mb-4'>Christmas Tree Association Events</h1><div className='mb-6 p-4 border rounded-md'><div className='mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'><div><label className='block mb-1'>Search by title/description:</label><input type='text' value={searchTerm} onChange={handleSearch} className='w-full p-2 border rounded' /></div><div><label className='block mb-1'>Start date:</label><input type='date' value={startDate} onChange={handleStartDateChange} className='w-full p-2 border rounded' /></div><div><label className='block mb-1'>End date:</label><input type='date' value={endDate} onChange={handleEndDateChange} className='w-full p-2 border rounded' /></div><div><label className='block mb-1'>Event type:</label><select value={selectedEventType} onChange={handleEventTypeChange} className='w-full p-2 border rounded'><option value=''>All types</option>{eventTypes.map(type => <option key={type} value={type}>{type}</option>)}</select></div></div><div className='flex justify-end'><button onClick={resetFilters} className='p-2 border rounded mr-2'>Reset Filters</button></div></div><div className='mb-4 flex justify-between items-center'><div><span>{`${filteredEvents.length} ${filteredEvents.length === 1 ? 'event' : 'events'} found`}</span></div><button onClick={openAddModal} className='p-2 border rounded'>+ Add New Event</button></div>{loading ? <div>Loading events...</div> : filteredEvents.length === 0 ? <div>No events found matching your criteria.</div> : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>{filteredEvents.map(event => <div key={event.ID} className='border rounded-md p-4'><h1 className='mb-2'>{event.title}</h1>{event.event_image && <div className='mb-3'><img src={event.event_image.startsWith('data:') ? event.event_image : `data:image/jpeg;base64,${event.event_image}`} alt={event.title} className='rounded' onError={e => {
            e.target.onerror = null;
            e.target.parentNode.innerHTML = 'Image not found';
          }} /></div>}<div className='mb-2'><strong>Dates: </strong>{`${formatDate(event.start_date)} - ${formatDate(event.end_date)}`}</div><div className='mb-2'><strong>Location: </strong>{event.location}</div><div className='mb-2'><strong>Type: </strong>{event.event_type}</div><div className='mb-3'><p>{event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}</p></div><div className='flex justify-between mt-2'><button onClick={() => openEventDetails(event)} className='p-2 border rounded'>View Details</button><div><button onClick={() => openEditModal(event)} className='p-2 border rounded mr-2'>Edit</button><button onClick={() => openDeleteModal(event)} className='p-2 border rounded'>Delete</button></div></div></div>)}</div>}{showModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50'><div className='bg-white rounded-lg p-6 w-full max-w-3xl'><div className='flex justify-between items-center mb-4'><h1>{modalMode === 'view' ? 'Event Details' : modalMode === 'edit' ? 'Edit Event' : modalMode === 'add' ? 'Add New Event' : 'Delete Event'}</h1><button onClick={closeModal} className='p-2'>×</button></div>{modalMode === 'delete' ? <div><p className='mb-4'>{`Are you sure you want to delete the event "${currentEvent.title}"?`}</p><div className='flex justify-end space-x-2'><button onClick={closeModal} className='p-2 border rounded'>Cancel</button><button onClick={handleDeleteEvent} className='p-2 border rounded'>Delete</button></div></div> : modalMode === 'view' ? <div><h1 className='mb-2'>{currentEvent.title}</h1>{currentEvent.event_image && <div className='mb-4'><img src={currentEvent.event_image.startsWith('data:') ? currentEvent.event_image : `data:image/jpeg;base64,${currentEvent.event_image}`} alt={currentEvent.title} className='rounded' onError={e => {
              e.target.onerror = null;
              e.target.parentNode.innerHTML = 'Image not found';
            }} /></div>}<div className='mb-2'><strong>Dates: </strong>{`${formatDate(currentEvent.start_date)} - ${formatDate(currentEvent.end_date)}`}</div><div className='mb-2'><strong>Location: </strong>{currentEvent.location}</div><div className='mb-2'><strong>Type: </strong>{currentEvent.event_type}</div><div className='mb-4'><strong>Description: </strong><p>{currentEvent.description}</p></div><div className='flex justify-between'><button onClick={() => navigateToEventDetails(currentEvent.ID)} className='p-2 border rounded'>Open Full Details Page</button><div><button onClick={() => {
                setModalMode('edit');
              }} className='p-2 border rounded mr-2'>Edit</button><button onClick={closeModal} className='p-2 border rounded'>Close</button></div></div></div> : <div><div className='mb-4'><label className='block mb-1'>Title:</label><input type='text' name='title' value={currentEvent.title} onChange={handleInputChange} className='w-full p-2 border rounded' required={true} /></div><div className='mb-4 grid grid-cols-1 md:grid-cols-2 gap-4'><div><label className='block mb-1'>Start Date:</label><input type='date' name='start_date' value={currentEvent.start_date ? new Date(currentEvent.start_date).toISOString().split('T')[0] : ''} onChange={handleInputChange} className='w-full p-2 border rounded' required={true} /></div><div><label className='block mb-1'>End Date:</label><input type='date' name='end_date' value={currentEvent.end_date ? new Date(currentEvent.end_date).toISOString().split('T')[0] : ''} onChange={handleInputChange} className='w-full p-2 border rounded' required={true} /></div></div><div className='mb-4'><label className='block mb-1'>Location:</label><input type='text' name='location' value={currentEvent.location || ''} onChange={handleInputChange} className='w-full p-2 border rounded' required={true} /></div><div className='mb-4'><label className='block mb-1'>Event Type:</label><input type='text' name='event_type' value={currentEvent.event_type || ''} onChange={handleInputChange} className='w-full p-2 border rounded' required={true} list='event-types' /><datalist id='event-types'>{eventTypes.map(type => <option key={type} value={type} />)}</datalist></div><div className='mb-4'><label className='block mb-1'>Description:</label><textarea name='description' value={currentEvent.description || ''} onChange={handleInputChange} className='w-full p-2 border rounded' rows={4} required={true} /></div><div className='mb-4'><label className='block mb-1'>Event Image:</label><input type='file' accept='image/*' onChange={handleImageChange} className='w-full p-2 border rounded' />{currentEvent.event_image && <div className='mt-2'><img src={currentEvent.event_image.startsWith('data:') ? currentEvent.event_image : `data:image/jpeg;base64,${currentEvent.event_image}`} alt='Event preview' className='h-32 rounded' onError={e => {
                e.target.onerror = null;
                e.target.parentNode.innerHTML = 'Image not found';
              }} /></div>}</div><div className='flex justify-end space-x-2'><button onClick={closeModal} className='p-2 border rounded'>Cancel</button><button onClick={handleSaveEvent} className='p-2 border rounded'>Save</button></div></div>}</div></div>}</div>;
}