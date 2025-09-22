'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const HealingAudioCollectionView = function () {
  const [audioList, setAudioList] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    is_guided_meditation: '',
    published: 'true',
    min_duration: '',
    max_duration: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const audioRef = useRef(null);
  const loadAudioList = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.is_guided_meditation !== '') params.append('is_guided_meditation', filters.is_guided_meditation);
      if (filters.published !== '') params.append('published', filters.published);
      if (filters.min_duration) params.append('min_duration', filters.min_duration);
      if (filters.max_duration) params.append('max_duration', filters.max_duration);
      params.append('page', page.toString());
      params.append('limit', '20');
      const response = await fetch(`/api/soundlibrarylist?${params.toString()}`);
      if (response.status === 401) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to load audio library');
      }
      const data = await response.json();
      setAudioList(data.data || []);
      setTotalPages(data.totalpages || 1);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);
  const loadAudioDetails = useCallback(async id => {
    try {
      const response = await fetch(`/api/soundlibraryget?id=${id}`);
      if (response.status === 401) {
        setUnauthorized(true);
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to load audio details');
      }
      const audioData = await response.json();
      setCurrentAudio(audioData);
      if (audioRef.current) {
        audioRef.current.src = audioData.audio_file;
        audioRef.current.load();
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);
  const handlePlayPause = () => {
    if (!audioRef.current || !currentAudio) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  const handleSeek = e => {
    if (!audioRef.current) return;
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  const handleVolumeChange = e => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setPage(1);
  };
  const handlePageChange = newPage => {
    setPage(newPage);
  };
  const handleAudioSelect = audio => {
    loadAudioDetails(audio.id);
  };
  useEffect(() => {
    loadAudioList();
  }, [loadAudioList]);
  if (unauthorized) {
    return <div className='w-full p-5'><p>Please log in to access the sound library.</p></div>;
  }
  return <div className='w-full h-full flex flex-col'><div className='p-5 sm:p-3 md:p-4 lg:p-5 border-b'><h1>Healing Sound Library</h1><p className='mt-2'>Discover our collection of healing sounds, guided meditations, and frequency therapy tracks designed to promote wellness and inner peace.</p></div><div className='p-5 sm:p-3 md:p-4 lg:p-5 border-b flex flex-col lg:flex-row gap-5'><div className='flex flex-col'><label className='mb-2 font-semibold'>Category</label><select className='m-2 sm:m-3 md:m-4 lg:m-5 p-3 border' value={filters.category} onChange={e => handleFilterChange('category', e.target.value)}><option value=''>All Categories</option><option value='healing_sounds'>Healing Sounds</option><option value='guided_meditation'>Guided Meditation</option><option value='sound_bath'>Sound Bath</option><option value='frequency_therapy'>Frequency Therapy</option></select></div><div className='flex flex-col'><label className='mb-2 font-semibold'>Type</label><select className='m-2 sm:m-3 md:m-4 lg:m-5 p-3 border' value={filters.is_guided_meditation} onChange={e => handleFilterChange('is_guided_meditation', e.target.value)}><option value=''>All Types</option><option value='true'>Guided Only</option><option value='false'>Ambient Only</option></select></div><div className='flex flex-col'><label className='mb-2 font-semibold'>Min Duration (minutes)</label><input type='number' className='m-2 sm:m-3 md:m-4 lg:m-5 p-3 border' value={filters.min_duration} onChange={e => handleFilterChange('min_duration', e.target.value)} min='0' /></div><div className='flex flex-col'><label className='mb-2 font-semibold'>Max Duration (minutes)</label><input type='number' className='m-2 sm:m-3 md:m-4 lg:m-5 p-3 border' value={filters.max_duration} onChange={e => handleFilterChange('max_duration', e.target.value)} min='0' /></div></div><div className='flex-1 flex flex-col lg:flex-row'><div className='flex-1 p-5 sm:p-3 md:p-4 lg:p-5'>{loading ? <p>Loading audio library...</p> : error ? <p className='text-red-600'>{error}</p> : audioList.length === 0 ? <p>No audio content found.</p> : <div><div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>{audioList.map(audio => <div key={audio.id} className='border p-5 sm:p-3 md:p-4 lg:p-5 cursor-pointer hover:border-gray-400 w-full h-full' onClick={() => handleAudioSelect(audio)}>{audio.thumbnail_image && <img src={`${audio.thumbnail_image}`} alt={audio.title} className='w-full h-auto max-h-full mb-3' />}<h3 className='font-semibold mb-2'>{audio.title}</h3>{audio.description && <p className='text-sm mb-2'>{audio.description}</p>}<div className='flex justify-between items-center mb-2'><span className='text-sm font-medium text-blue-600'>{audio.category}</span>{audio.duration && <span className='text-sm text-gray-600'>{formatTime(audio.duration * 60)}</span>}</div>{audio.benefits && <p className='text-sm mt-2 text-green-600'>{audio.benefits}</p>}{audio.is_guided_meditation && <span className='inline-block mt-2 bg-green-100 text-green-800 text-xs px-2 py-1'>Guided</span>}</div>)}</div>{totalPages > 1 && <div className='flex justify-center mt-5 gap-2'>{page > 1 && <button className='border !text-gray-800 border-gray-300 !bg-transparent p-3' onClick={() => handlePageChange(page - 1)}>Previous</button>}<span className='p-3'>{`${page} / ${totalPages}`}</span>{page < totalPages && <button className='border !text-gray-800 border-gray-300 !bg-transparent p-3' onClick={() => handlePageChange(page + 1)}>Next</button>}</div>}</div>}</div>{currentAudio && <div className='w-full lg:w-80 border-l p-5 sm:p-3 md:p-4 lg:p-5'><div className='sticky top-0'><h2 className='font-bold mb-3'>Now Playing</h2>{currentAudio.thumbnail_image && <img src={`${currentAudio.thumbnail_image}`} alt={currentAudio.title} className='w-full h-auto max-h-full mb-3' />}<h3 className='font-semibold mb-2'>{currentAudio.title}</h3>{currentAudio.description && <p className='text-sm mb-3'>{currentAudio.description}</p>}<audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={() => setIsPlaying(false)} /><div className='mt-5'><div className='w-full h-2 bg-gray-200 cursor-pointer mb-3' onClick={handleSeek}><div className='h-full bg-blue-500' style={{
                width: duration > 0 ? `${currentTime / duration * 100}%` : '0%'
              }} /></div><div className='flex justify-between text-sm mb-3'><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div><div className='flex justify-center mb-3'><button className='border !text-gray-800 border-gray-300 !bg-transparent p-3' onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button></div><div className='mb-3'><label className='block text-sm mb-1'>Volume</label><input type='range' min='0' max='1' step='0.1' value={volume} onChange={handleVolumeChange} className='w-full' /></div><div className='text-sm'><p className='mb-2'>{`${"Category"}: `}<span className='text-blue-600 font-medium'>{currentAudio.category}</span></p>{currentAudio.duration && <p className='mb-2'>{`${"Duration: "}: ${formatTime(currentAudio.duration * 60)}`}</p>}{currentAudio.benefits && <p className='text-green-600 mb-2 font-medium'>{`${"Benefits:"}: ${currentAudio.benefits}`}</p>}{currentAudio.is_guided_meditation && <div className='mt-2'><span className='bg-green-100 text-green-800 text-xs px-2 py-1'>Guided Meditation</span></div>}</div></div></div></div>}</div></div>;
};
HealingAudioCollectionView.displayName = 'HealingAudioCollectionView';
export default HealingAudioCollectionView;