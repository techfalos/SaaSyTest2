'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function AdminSessionsDashboard() {
  const [sessions, setSessions] = useState([]);
  const [services, setServices] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    status: '',
    service_id: '',
    practitioner_id: ''
  });
  const [editingSession, setEditingSession] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [unauthorized, setUnauthorized] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    completed: 0,
    scheduled: 0,
    cancelled: 0
  });
  const loadSessions = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      if (filters.status) params.append('status', filters.status);
      if (filters.service_id) params.append('service_id', filters.service_id);
      if (filters.practitioner_id) params.append('practitioner_id', filters.practitioner_id);
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      const response = await fetch(`/api/sessionslist?${params.toString()}`);
      if (response.status === 401) {
        setUnauthorized(true);
        return;
      }
      const data = await response.json();
      setSessions(data.data || []);
      setTotalPages(data.totalpages || 1);
      setTotalSessions(data.total || 0);
      const stats = (data.data || []).reduce((acc, session) => {
        if (session.status === 'completed') acc.completed++;else if (session.status === 'scheduled') acc.scheduled++;else if (session.status === 'cancelled') acc.cancelled++;
        return acc;
      }, {
        completed: 0,
        scheduled: 0,
        cancelled: 0
      });
      setSessionStats(stats);
    } catch (err) {
      setError(err.message);
    }
  }, [currentPage, filters]);
  const loadServices = useCallback(async () => {
    try {
      const response = await fetch('/api/serviceslist?limit=100');
      const data = await response.json();
      setServices(data.data || []);
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  }, []);
  const loadPractitioners = useCallback(async () => {
    try {
      const response = await fetch('/api/practitionerslist?limit=100');
      const data = await response.json();
      setPractitioners(data.data || []);
    } catch (err) {
      console.error('Failed to load practitioners:', err);
    }
  }, []);
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([loadSessions(), loadServices(), loadPractitioners()]);
      setLoading(false);
    };
    loadAllData();
  }, [loadSessions, loadServices, loadPractitioners]);
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };
  const handleEditSession = session => {
    setEditingSession(session);
    setEditForm({
      id: session.id,
      session_date: session.session_date,
      session_time: session.session_time,
      duration: session.duration,
      status: session.status,
      notes: session.notes || ''
    });
    setShowEditModal(true);
  };
  const handleDeleteSession = session => {
    setSessionToDelete(session);
    setShowDeleteModal(true);
  };
  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const submitEdit = async () => {
    try {
      const response = await fetch('/api/sessionsupdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      if (response.status === 401) {
        setUnauthorized(true);
        return;
      }
      const updatedSession = await response.json();
      setSessions(prev => prev.map(session => session.id === updatedSession.id ? updatedSession : session));
      setShowEditModal(false);
      setEditingSession(null);
    } catch (err) {
      setError(err.message);
    }
  };
  const confirmDelete = async () => {
    try {
      const response = await fetch('/api/sessionsdelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: sessionToDelete.id
        })
      });
      if (response.status === 401) {
        setUnauthorized(true);
        return;
      }
      setSessions(prev => prev.filter(session => session.id !== sessionToDelete.id));
      setTotalSessions(prev => prev - 1);
      setShowDeleteModal(false);
      setSessionToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };
  const getServiceName = serviceId => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : serviceId;
  };
  const getPractitionerName = practitionerId => {
    const practitioner = practitioners.find(p => p.id === practitionerId);
    return practitioner ? practitioner.name : practitionerId;
  };
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  if (loading) {
    return <div className='w-full flex items-center justify-center p-8'>Loading admin dashboard...</div>;
  }
  if (unauthorized) {
    return <div className='w-full flex items-center justify-center p-8'>Access denied. Admin privileges required.</div>;
  }
  return <div className='w-full p-4 lg:p-6'><div className='flex flex-col lg:flex-row justify-between items-start lg:items-center m-5'><h1 className='text-3xl font-bold'>Your Healing Journey Dashboard</h1><div className='flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0'><div className='text-sm'>Total Sessions: <span className='font-semibold'>{totalSessions}</span></div></div></div><div className='grid grid-cols-1 sm:grid-cols-3 gap-4 m-5'><div className='border border-gray-300 p-4'><h3 className='font-semibold text-green-600'>Completed</h3><div className='text-2xl font-bold'>{sessionStats.completed}</div></div><div className='border border-gray-300 p-4'><h3 className='font-semibold text-blue-600'>Scheduled</h3><div className='text-2xl font-bold'>{sessionStats.scheduled}</div></div><div className='border border-gray-300 p-4'><h3 className='font-semibold text-red-600'>Cancelled</h3><div className='text-2xl font-bold'>{sessionStats.cancelled}</div></div></div><div className='border border-gray-300 p-4 m-5'><h2 className='text-xl font-semibold mb-4'>Filters</h2><div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'><div><label className='block text-sm font-medium mb-1'>Start Date</label><input type='date' value={filters.start_date} onChange={e => handleFilterChange('start_date', e.target.value)} className='m-2' /></div><div><label className='block text-sm font-medium mb-1'>End Date</label><input type='date' value={filters.end_date} onChange={e => handleFilterChange('end_date', e.target.value)} className='m-2' /></div><div><label className='block text-sm font-medium mb-1'>Status: </label><select value={filters.status} onChange={e => handleFilterChange('status', e.target.value)} className='m-2'><option value=''>All Statuses</option><option value='scheduled'>Scheduled</option><option value='completed'>Completed</option><option value='cancelled'>Cancelled</option></select></div><div><label className='block text-sm font-medium mb-1'>Service: </label><select value={filters.service_id} onChange={e => handleFilterChange('service_id', e.target.value)} className='m-2'><option value=''>All Services</option>{services.map(service => <option key={service.id} value={service.id}>{service.name}</option>)}</select></div><div><label className='block text-sm font-medium mb-1'>Practitioner: </label><select value={filters.practitioner_id} onChange={e => handleFilterChange('practitioner_id', e.target.value)} className='m-2'><option value=''>All Practitioners</option>{practitioners.map(practitioner => <option key={practitioner.id} value={practitioner.id}>{practitioner.name}</option>)}</select></div></div></div><div className='border border-gray-300 m-5'><div className='overflow-x-auto'><table className='w-full'><thead className='border-b border-gray-300'><tr><th className='text-left p-3'>Date & Time</th><th className='text-left p-3'>Service</th><th className='text-left p-3'>Practitioner</th><th className='text-left p-3'>Duration</th><th className='text-left p-3'>Status</th><th className='text-left p-3'>Price</th><th className='text-left p-3'>Actions</th></tr></thead><tbody>{sessions.length === 0 ? <tr><td colSpan={7} className='text-center p-8'>No sessions found</td></tr> : sessions.map(session => <tr key={session.id} className='border-b border-gray-200'><td className='p-3'><div>{session.session_date}</div><div className='text-sm text-gray-600'>{session.session_time}</div></td><td className='p-3'>{getServiceName(session.servicesid)}</td><td className='p-3'>{getPractitionerName(session.practitionersid)}</td><td className='p-3'>{`${session.duration} min`}</td><td className='p-3'><span className={session.status === 'completed' ? 'text-green-600 font-semibold' : session.status === 'scheduled' ? 'text-blue-600 font-semibold' : session.status === 'cancelled' ? 'text-red-600 font-semibold' : ''}>{session.status}</span></td><td className='p-3 font-semibold'>{formatCurrency(session.price)}</td><td className='p-3'><div className='flex gap-2'><button onClick={() => handleEditSession(session)} className='border !text-gray-800 border-gray-300 !bg-transparent p-2 text-sm'>Edit</button><button onClick={() => handleDeleteSession(session)} className='!bg-red-700 !text-white p-2 text-sm'>Delete</button></div></td></tr>)}</tbody></table></div></div>{totalPages > 1 && <div className='flex justify-center items-center gap-2 m-5'><button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Previous</button><span className='p-3'>{`${"Page"} ${currentPage} ${" of "} ${totalPages}`}</span><button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Next</button></div>}{showEditModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 max-w-md w-full max-h-full overflow-y-auto'><h2 className='text-xl font-semibold mb-4'>Edit Session</h2><div className='space-y-4'><div><label className='block text-sm font-medium mb-1'>Session Date</label><input type='date' value={editForm.session_date || ''} onChange={e => handleEditFormChange('session_date', e.target.value)} className='m-2' /></div><div><label className='block text-sm font-medium mb-1'>Session Time</label><input type='time' value={editForm.session_time || ''} onChange={e => handleEditFormChange('session_time', e.target.value)} className='m-2' /></div><div><label className='block text-sm font-medium mb-1'>Duration: </label><input type='number' value={editForm.duration || ''} onChange={e => handleEditFormChange('duration', parseInt(e.target.value))} className='m-2' /></div><div><label className='block text-sm font-medium mb-1'>Status</label><select value={editForm.status || ''} onChange={e => handleEditFormChange('status', e.target.value)} className='m-2'><option value='scheduled'>Scheduled</option><option value='completed'>Completed</option><option value='cancelled'>Cancelled</option></select></div><div><label className='block text-sm font-medium mb-1'>Notes (Optional)</label><textarea value={editForm.notes || ''} onChange={e => handleEditFormChange('notes', e.target.value)} rows={4} className='m-2' /></div></div><div className='flex gap-3 mt-6'><button onClick={submitEdit} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Save Changes</button><button onClick={() => setShowEditModal(false)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Cancel</button></div></div></div>}{showDeleteModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 max-w-sm w-full'><h2 className='text-xl font-semibold mb-4'>Confirm Delete</h2><p className='mb-6'>Are you sure you want to delete this session? This action cannot be undone.</p><div className='flex gap-3'><button onClick={confirmDelete} className='!bg-red-700 !text-white p-3'>Delete</button><button onClick={() => setShowDeleteModal(false)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Cancel</button></div></div></div>}{error && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-6 max-w-sm w-full'><h2 className='text-xl font-semibold mb-4'>Error</h2><p className='mb-4'>{error}</p><button onClick={() => setError(null)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Close</button></div></div>}</div>;
}