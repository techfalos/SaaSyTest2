'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minMoodRating, setMinMoodRating] = useState('');
  const [maxMoodRating, setMaxMoodRating] = useState('');
  const [minEnergyLevel, setMinEnergyLevel] = useState('');
  const [maxEnergyLevel, setMaxEnergyLevel] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [formData, setFormData] = useState({
    entry_date: new Date().toISOString().split('T')[0],
    mood_rating: '',
    energy_level: '',
    stress_level: '',
    sleep_quality: '',
    notes: '',
    session_feedback: '',
    goals: ''
  });
  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (minMoodRating) params.append('min_mood_rating', minMoodRating);
    if (maxMoodRating) params.append('max_mood_rating', maxMoodRating);
    if (minEnergyLevel) params.append('min_energy_level', minEnergyLevel);
    if (maxEnergyLevel) params.append('max_energy_level', maxEnergyLevel);
    params.append('page', currentPage.toString());
    params.append('limit', limit.toString());
    try {
      const response = await fetch(`/api/wellnessjournallist?${params.toString()}`);
      if (response.status === 401) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      const data = await response.json();
      setEntries(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalpages || 1);
    } catch (err) {
      setError("Failed to load journal entries");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, minMoodRating, maxMoodRating, minEnergyLevel, maxEnergyLevel, currentPage]);
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);
  const handleAddEntry = async () => {
    try {
      const response = await fetch('/api/wellnessjournalcreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          mood_rating: formData.mood_rating ? parseInt(formData.mood_rating) : undefined,
          energy_level: formData.energy_level ? parseInt(formData.energy_level) : undefined,
          stress_level: formData.stress_level ? parseInt(formData.stress_level) : undefined,
          sleep_quality: formData.sleep_quality ? parseInt(formData.sleep_quality) : undefined
        })
      });
      if (response.status === 401) {
        setError("You are not authorized to perform this action");
        return;
      }
      const newEntry = await response.json();
      setEntries(prev => [newEntry, ...prev]);
      setTotal(prev => prev + 1);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      setError("Failed to create journal entry");
    }
  };
  const handleEditEntry = async () => {
    try {
      const response = await fetch('/api/wellnessjournalupdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          id: selectedEntry.id,
          mood_rating: formData.mood_rating ? parseInt(formData.mood_rating) : undefined,
          energy_level: formData.energy_level ? parseInt(formData.energy_level) : undefined,
          stress_level: formData.stress_level ? parseInt(formData.stress_level) : undefined,
          sleep_quality: formData.sleep_quality ? parseInt(formData.sleep_quality) : undefined
        })
      });
      if (response.status === 401) {
        setError("You are not authorized to perform this action");
        return;
      }
      const updatedEntry = await response.json();
      setEntries(prev => prev.map(entry => entry.id === selectedEntry.id ? updatedEntry : entry));
      setShowEditModal(false);
      setSelectedEntry(null);
      resetForm();
    } catch (err) {
      setError("Failed to update journal entry");
    }
  };
  const handleDeleteEntry = async entryId => {
    try {
      const response = await fetch('/api/wellnessjournaldelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: entryId
        })
      });
      if (response.status === 401) {
        setError("You are not authorized to perform this action");
        return;
      }
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
      setTotal(prev => prev - 1);
    } catch (err) {
      setError("Failed to delete journal entry");
    }
  };
  const handleViewEntry = async entryId => {
    try {
      const response = await fetch(`/api/wellnessjournalget?id=${entryId}`);
      if (response.status === 401) {
        setError("You are not authorized to perform this action");
        return;
      }
      const entryDetail = await response.json();
      setSelectedEntry(entryDetail);
      setShowDetailModal(true);
    } catch (err) {
      setError("Failed to load entry details");
    }
  };
  const openEditModal = entry => {
    setSelectedEntry(entry);
    setFormData({
      entry_date: entry.entry_date || new Date().toISOString().split('T')[0],
      mood_rating: entry.mood_rating?.toString() || '',
      energy_level: entry.energy_level?.toString() || '',
      stress_level: entry.stress_level?.toString() || '',
      sleep_quality: entry.sleep_quality?.toString() || '',
      notes: entry.notes || '',
      session_feedback: entry.session_feedback || '',
      goals: entry.goals || ''
    });
    setShowEditModal(true);
  };
  const resetForm = () => {
    setFormData({
      entry_date: new Date().toISOString().split('T')[0],
      mood_rating: '',
      energy_level: '',
      stress_level: '',
      sleep_quality: '',
      notes: '',
      session_feedback: '',
      goals: ''
    });
  };
  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };
  const calculateAverages = () => {
    if (entries.length === 0) return {
      mood: 0,
      energy: 0,
      stress: 0,
      sleep: 0
    };
    const totals = entries.reduce((acc, entry) => ({
      mood: acc.mood + (entry.mood_rating || 0),
      energy: acc.energy + (entry.energy_level || 0),
      stress: acc.stress + (entry.stress_level || 0),
      sleep: acc.sleep + (entry.sleep_quality || 0)
    }), {
      mood: 0,
      energy: 0,
      stress: 0,
      sleep: 0
    });
    return {
      mood: Math.round(totals.mood / entries.length),
      energy: Math.round(totals.energy / entries.length),
      stress: Math.round(totals.stress / entries.length),
      sleep: Math.round(totals.sleep / entries.length)
    };
  };
  const averages = calculateAverages();
  if (unauthorized) {
    return <div className='w-full flex items-center justify-center p-5'><p className='text-red-600'>Please log in to access the sound library.</p></div>;
  }
  return <div className='w-full'><div className='p-5 sm:p-3 md:p-4 lg:p-5'><h1>Wellness Journal</h1><div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 m-5'><div className='border p-3 m-2'><h3>Average Mood</h3><p className='text-blue-600 font-bold'>{`${averages.mood}/10`}</p></div><div className='border p-3 m-2'><h3>Average Energy</h3><p className='text-green-600 font-bold'>{`${averages.energy}/10`}</p></div><div className='border p-3 m-2'><h3>Average Stress</h3><p className='text-orange-600 font-bold'>{`${averages.stress}/10`}</p></div><div className='border p-3 m-2'><h3>Average Sleep</h3><p className='text-purple-600 font-bold'>{`${averages.sleep}/10`}</p></div></div><div className='border p-3 m-5'><h3>Filter Entries</h3><div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-3'><div className='m-3'><label>Start Date</label><input type='date' className='border p-2 w-full m-2' value={startDate} onChange={e => setStartDate(e.target.value)} /></div><div className='m-3'><label>End Date</label><input type='date' className='border p-2 w-full m-2' value={endDate} onChange={e => setEndDate(e.target.value)} /></div><div className='m-3'><label>Mood Range</label><div className='flex'><input type='number' min='1' max='10' placeholder='Min' className='border p-2 w-full m-2' value={minMoodRating} onChange={e => setMinMoodRating(e.target.value)} /><input type='number' min='1' max='10' placeholder='Max' className='border p-2 w-full m-2' value={maxMoodRating} onChange={e => setMaxMoodRating(e.target.value)} /></div></div></div></div><div className='flex justify-center m-5'><button onClick={openAddModal} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Add New Entry</button></div></div><div className='p-5 sm:p-3 md:p-4 lg:p-5'>{loading ? <div className='flex justify-center p-5'><p>Loading practitioner profile...</p></div> : entries.length === 0 ? <div className='flex justify-center p-5'><p>No journal entries found</p></div> : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>{entries.map(entry => <div key={entry.id} className='border p-3 m-3 w-full h-full'><h3>{entry.entry_date}</h3>{entry.mood_rating && <p>{`${"Mood"}: ${entry.mood_rating}/10`}</p>}{entry.energy_level && <p>{`${"Energy"}: ${entry.energy_level}/10`}</p>}{entry.stress_level && <p>{`${"Stress"}: ${entry.stress_level}/10`}</p>}{entry.notes && <p className='text-gray-600'>{entry.notes.substring(0, 100) + (entry.notes.length > 100 ? '...' : '')}</p>}<div className='flex justify-between m-3'><button onClick={() => handleViewEntry(entry.id)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>View</button><button onClick={() => openEditModal(entry)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Edit</button><button onClick={() => handleDeleteEntry(entry.id)} className='!bg-red-700 !text-white p-3'>Delete</button></div></div>)}</div>}</div>{totalPages > 1 && <div className='flex justify-center p-5'><div className='flex'>{currentPage > 1 && <button onClick={() => setCurrentPage(prev => prev - 1)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-2'>Previous</button>}<span className='p-3'>{`${"Page"} ${currentPage} ${"of"} ${totalPages}`}</span>{currentPage < totalPages && <button onClick={() => setCurrentPage(prev => prev + 1)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-2'>Next</button>}</div></div>}{showAddModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]' onClick={() => setShowAddModal(false)}><div className='bg-white p-5 border w-full max-w-2xl m-5 max-h-full overflow-y-auto' onClick={e => e.stopPropagation()}><h2>Add New Journal Entry</h2><div className='m-5'><label>Entry Date</label><input type='date' className='border p-2 w-full m-2' value={formData.entry_date} onChange={e => setFormData({
            ...formData,
            entry_date: e.target.value
          })} /></div><div className='grid grid-cols-1 sm:grid-cols-2'><div className='m-5'><label>Mood Rating (1-10)</label><input type='number' min='1' max='10' className='border p-2 w-full m-2' value={formData.mood_rating} onChange={e => setFormData({
              ...formData,
              mood_rating: e.target.value
            })} /></div><div className='m-5'><label>Energy Level (1-10)</label><input type='number' min='1' max='10' className='border p-2 w-full m-2' value={formData.energy_level} onChange={e => setFormData({
              ...formData,
              energy_level: e.target.value
            })} /></div><div className='m-5'><label>Stress Level (1-10)</label><input type='number' min='1' max='10' className='border p-2 w-full m-2' value={formData.stress_level} onChange={e => setFormData({
              ...formData,
              stress_level: e.target.value
            })} /></div><div className='m-5'><label>Sleep Quality (1-10)</label><input type='number' min='1' max='10' className='border p-2 w-full m-2' value={formData.sleep_quality} onChange={e => setFormData({
              ...formData,
              sleep_quality: e.target.value
            })} /></div></div><div className='m-5'><label>Notes (Optional)</label><textarea className='border p-2 w-full m-2' rows={4} value={formData.notes} onChange={e => setFormData({
            ...formData,
            notes: e.target.value
          })} /></div><div className='m-5'><label>Session Feedback</label><textarea className='border p-2 w-full m-2' rows={3} value={formData.session_feedback} onChange={e => setFormData({
            ...formData,
            session_feedback: e.target.value
          })} /></div><div className='m-5'><label>Goals</label><textarea className='border p-2 w-full m-2' rows={3} value={formData.goals} onChange={e => setFormData({
            ...formData,
            goals: e.target.value
          })} /></div><div className='flex justify-end m-5'><button onClick={() => setShowAddModal(false)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-2'>Cancel</button><button onClick={handleAddEntry} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-2'>Save</button></div></div></div>}{showEditModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]' onClick={() => setShowEditModal(false)}><div className='bg-white p-5 border w-full max-w-2xl m-5 max-h-full overflow-y-auto' onClick={e => e.stopPropagation()}><h2>Edit Journal Entry</h2><div className='m-5'><label>Entry Date</label><input type='date' className='border p-2 w-full m-2' value={formData.entry_date} onChange={e => setFormData({
            ...formData,
            entry_date: e.target.value
          })} /></div><div className='grid grid-cols-1 sm:grid-cols-2'><div className='m-5'><label>Mood Rating (1-10)</label><input type='number' min='1' max='10' className='border p-2 w-full m-2' value={formData.mood_rating} onChange={e => setFormData({
              ...formData,
              mood_rating: e.target.value
            })} /></div><div className='m-5'><label>Energy Level (1-10)</label><input type='number' min='1' max='10' className='border p-2 w-full m-2' value={formData.energy_level} onChange={e => setFormData({
              ...formData,
              energy_level: e.target.value
            })} /></div><div className='m-5'><label>Stress Level (1-10)</label><input type='number' min='1' max='10' className='border p-2 w-full m-2' value={formData.stress_level} onChange={e => setFormData({
              ...formData,
              stress_level: e.target.value
            })} /></div><div className='m-5'><label>Sleep Quality (1-10)</label><input type='number' min='1' max='10' className='border p-2 w-full m-2' value={formData.sleep_quality} onChange={e => setFormData({
              ...formData,
              sleep_quality: e.target.value
            })} /></div></div><div className='m-5'><label>Notes (Optional)</label><textarea className='border p-2 w-full m-2' rows={4} value={formData.notes} onChange={e => setFormData({
            ...formData,
            notes: e.target.value
          })} /></div><div className='m-5'><label>Session Feedback</label><textarea className='border p-2 w-full m-2' rows={3} value={formData.session_feedback} onChange={e => setFormData({
            ...formData,
            session_feedback: e.target.value
          })} /></div><div className='m-5'><label>Goals</label><textarea className='border p-2 w-full m-2' rows={3} value={formData.goals} onChange={e => setFormData({
            ...formData,
            goals: e.target.value
          })} /></div><div className='flex justify-end m-5'><button onClick={() => setShowEditModal(false)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-2'>Cancel</button><button onClick={handleEditEntry} className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-2'>Save</button></div></div></div>}{showDetailModal && selectedEntry && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]' onClick={() => setShowDetailModal(false)}><div className='bg-white p-5 border w-full max-w-2xl m-5 max-h-full overflow-y-auto' onClick={e => e.stopPropagation()}><h2>Entry Details</h2><p>{`${"Date"}: ${selectedEntry.entry_date}`}</p>{selectedEntry.mood_rating && <p>{`${"Mood"}: ${selectedEntry.mood_rating}/10`}</p>}{selectedEntry.energy_level && <p>{`${"Energy"}: ${selectedEntry.energy_level}/10`}</p>}{selectedEntry.stress_level && <p>{`${"Stress"}: ${selectedEntry.stress_level}/10`}</p>}{selectedEntry.sleep_quality && <p>{`${"Sleep Quality"}: ${selectedEntry.sleep_quality}/10`}</p>}{selectedEntry.notes && <div className='m-3'><h3>Notes</h3><p>{selectedEntry.notes}</p></div>}{selectedEntry.session_feedback && <div className='m-3'><h3>Session Feedback</h3><p>{selectedEntry.session_feedback}</p></div>}{selectedEntry.goals && <div className='m-3'><h3>Goals</h3><p>{selectedEntry.goals}</p></div>}<div className='flex justify-end m-5'><button onClick={() => setShowDetailModal(false)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Close</button></div></div></div>}{error && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]' onClick={() => setError(null)}><div className='bg-white p-5 border m-5' onClick={e => e.stopPropagation()}><h2>Error</h2><p>{error}</p><div className='flex justify-end m-3'><button onClick={() => setError(null)} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>OK</button></div></div></div>}</div>;
}