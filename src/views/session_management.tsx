'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function SessionDashboard() {
  const [sessions, setSessions] = useState([]);
  const [sessionDetails, setSessionDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(true);
  const loadSessions = useCallback(async (page = 1, status = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');
      if (status) params.append('status', status);
      const response = await fetch(`/api/sessionslist?${params.toString()}`);
      if (response.status === 401) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to load sessions');
      }
      const data = await response.json();
      setSessions(data.data || []);
      setTotalPages(data.totalpages || 1);
      setCurrentPage(page);
      setLoading(false);
    } catch (err) {
      setError('Failed to load sessions');
      setLoading(false);
    }
  }, []);
  const loadSessionDetails = useCallback(async sessionId => {
    try {
      const response = await fetch(`/api/sessionsget?id=${sessionId}`);
      if (response.status === 401) {
        setIsAuthorized(false);
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to load session details');
      }
      const data = await response.json();
      setSessionDetails(prev => ({
        ...prev,
        [sessionId]: data
      }));
    } catch (err) {
      setError('Failed to load session details');
    }
  }, []);
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);
  const handleEditSession = session => {
    setSelectedSession(session);
    setEditFormData({
      id: session.id,
      session_date: session.session_date,
      session_time: session.session_time,
      duration: session.duration,
      status: session.status,
      notes: session.notes || ''
    });
    setShowEditModal(true);
  };
  const handleUpdateSession = async () => {
    try {
      const response = await fetch('/api/sessionsupdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });
      if (response.status === 401) {
        setError('Unauthorized to update session');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to update session');
      }
      const updatedSession = await response.json();
      setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
      setShowEditModal(false);
      setSuccessMessage('Session updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update session');
    }
  };
  const handleDeleteSession = async () => {
    try {
      const response = await fetch('/api/sessionsdelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: deleteSessionId
        })
      });
      if (response.status === 401) {
        setError('Unauthorized to cancel session');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to cancel session');
      }
      setSessions(prev => prev.filter(s => s.id !== deleteSessionId));
      setShowDeleteModal(false);
      setSuccessMessage('Session cancelled successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to cancel session');
    }
  };
  const confirmDelete = sessionId => {
    setDeleteSessionId(sessionId);
    setShowDeleteModal(true);
  };
  const handleFilterChange = status => {
    setStatusFilter(status);
    loadSessions(1, status);
  };
  const handlePageChange = page => {
    loadSessions(page, statusFilter);
  };
  const formatPrice = price => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString();
  };
  const formatTime = timeString => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      case 'completed':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };
  const upcomingSessions = sessions.filter(session => new Date(`${session.session_date}T${session.session_time}`) > new Date() && session.status !== 'cancelled');
  const pastSessions = sessions.filter(session => new Date(`${session.session_date}T${session.session_time}`) <= new Date() || session.status === 'completed');
  if (!isAuthorized) {
    return <div className='w-full p-5'><div className='text-center p-10'><h2>Unauthorized Access</h2><p className='m-3'>Please log in to access the sound library.</p></div></div>;
  }
  return <div className='w-full h-full'><div className='p-5 sm:p-3 md:p-4 lg:p-8'><div className='flex flex-col lg:flex-row justify-between items-center m-5'><h1>Your Healing Journey Dashboard</h1><div className='flex flex-col sm:flex-col md:flex-col lg:flex-row gap-3 m-3'><button onClick={() => handleFilterChange('')} className={statusFilter === '' ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 hover:border-gray-400'}>All Sessions</button><button onClick={() => handleFilterChange('confirmed')} className={statusFilter === 'confirmed' ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 hover:border-gray-400'}>Confirmed</button><button onClick={() => handleFilterChange('pending')} className={statusFilter === 'pending' ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 hover:border-gray-400'}>Pending</button><button onClick={() => handleFilterChange('completed')} className={statusFilter === 'completed' ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 hover:border-gray-400'}>Completed</button></div></div>{loading ? <div className='text-center p-10'><p>Loading your sessions...</p></div> : null}{error ? <div className='text-center p-5 m-3 bg-red-100 text-red-600'><p>{error}</p></div> : null}{successMessage ? <div className='text-center p-5 m-3 bg-green-100 text-green-600'><p>{successMessage}</p></div> : null}{!loading && !error ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 m-5'><div className='w-full h-full'><h2>Upcoming Sessions</h2>{upcomingSessions.length === 0 ? <div className='p-5 text-center'><p>No upcoming sessions scheduled</p></div> : <div className='space-y-4 m-5'>{upcomingSessions.map(session => <div key={session.id} className='border p-5 m-3'><div className='flex flex-col lg:flex-row justify-between items-start'><div className='flex-1'><p className='font-bold m-2'>{formatDate(session.session_date)} at {formatTime(session.session_time)}</p><p className='m-2'>Duration: {session.duration} minutes</p><p className={`m-2 ${getStatusColor(session.status)}`}>Status: {session.status}</p><p className='font-bold text-green-600 m-2'>Price{formatPrice(session.price)}</p>{session.notes ? <p className='m-2'><strong>Notes (Optional)</strong>{session.notes}</p> : null}</div><div className='flex flex-col gap-2 m-3'><button onClick={() => handleEditSession(session)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Reschedule</button><button onClick={() => confirmDelete(session.id)} className='!bg-red-700 !text-white p-3'>Cancel</button></div></div></div>)}</div>}</div><div className='w-full h-full'><h2>Session History</h2>{pastSessions.length === 0 ? <div className='p-5 text-center'><p>No session history available</p></div> : <div className='space-y-4 m-5'>{pastSessions.map(session => <div key={session.id} className='border p-5 m-3'><div className='flex flex-col lg:flex-row justify-between items-start'><div className='flex-1'><p className='font-bold m-2'>{formatDate(session.session_date)} at {formatTime(session.session_time)}</p><p className='m-2'>Duration: {session.duration} minutes</p><p className={`m-2 ${getStatusColor(session.status)}`}>Status: {session.status}</p><p className='font-bold text-green-600 m-2'>Price{formatPrice(session.price)}</p>{session.completed_at ? <p className='m-2 text-blue-600'>Completed: {formatDate(session.completed_at)}</p> : null}{session.notes ? <p className='m-2'><strong>Notes (Optional)</strong>{session.notes}</p> : null}</div>{session.status !== 'completed' && session.status !== 'cancelled' ? <div className='flex flex-col gap-2 m-3'><button onClick={() => handleEditSession(session)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Add Notes</button></div> : null}</div></div>)}</div>}</div></div> : null}{!loading && sessions.length > 0 ? <div className='flex justify-center items-center gap-3 m-5'><button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={currentPage === 1 ? 'border !text-gray-400 border-gray-300 !bg-transparent p-3' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3'}>Previous</button><span className='m-3'>Page{currentPage} of {totalPages}</span><button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={currentPage === totalPages ? 'border !text-gray-400 border-gray-300 !bg-transparent p-3' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3'}>Next</button></div> : null}</div>{showEditModal ? <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]'><div className='bg-white p-8 max-w-md w-full m-5'><h3 className='m-5'>Edit Session</h3><div className='m-5'><label className='block m-2'>Date: </label><input type='date' value={editFormData.session_date || ''} onChange={e => setEditFormData(prev => ({
            ...prev,
            session_date: e.target.value
          }))} className='w-full border p-3 m-2' /></div><div className='m-5'><label className='block m-2'>Time: </label><input type='time' value={editFormData.session_time || ''} onChange={e => setEditFormData(prev => ({
            ...prev,
            session_time: e.target.value
          }))} className='w-full border p-3 m-2' /></div><div className='m-5'><label className='block m-2'>Duration (minutes):</label><input type='number' value={editFormData.duration || ''} onChange={e => setEditFormData(prev => ({
            ...prev,
            duration: parseInt(e.target.value)
          }))} className='w-full border p-3 m-2' /></div><div className='m-5'><label className='block m-2'>Status:</label><select value={editFormData.status || ''} onChange={e => setEditFormData(prev => ({
            ...prev,
            status: e.target.value
          }))} className='w-full border p-3 m-2'><option value='pending'>Pending</option><option value='confirmed'>Confirmed</option><option value='completed'>Completed</option><option value='cancelled'>Cancelled</option></select></div><div className='m-5'><label className='block m-2'>Notes:</label><textarea value={editFormData.notes || ''} onChange={e => setEditFormData(prev => ({
            ...prev,
            notes: e.target.value
          }))} className='w-full border p-3 m-2' rows={4} /></div><div className='flex justify-end gap-3 m-5'><button onClick={() => setShowEditModal(false)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Cancel</button><button onClick={handleUpdateSession} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Save Changes</button></div></div></div> : null}{showDeleteModal ? <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]'><div className='bg-white p-8 max-w-sm w-full m-5'><h3 className='m-5'>Confirm Cancellation</h3><p className='m-5'>Are you sure you want to cancel this session? This action cannot be undone.</p><div className='flex justify-end gap-3 m-5'><button onClick={() => setShowDeleteModal(false)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Keep Session</button><button onClick={handleDeleteSession} className='!bg-red-700 !text-white p-3'>Cancel Session</button></div></div></div> : null}</div>;
}