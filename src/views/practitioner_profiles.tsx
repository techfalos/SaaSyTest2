'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function PractitionersDisplay() {
  const router = useRouter();
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [filterAvailable, setFilterAvailable] = useState('');
  const [filterMinExperience, setFilterMinExperience] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const fetchPractitioners = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterSpecialization) params.append('specialization', filterSpecialization);
      if (filterAvailable) params.append('available', filterAvailable);
      if (filterMinExperience) params.append('min_experience', filterMinExperience);
      params.append('page', currentPage.toString());
      params.append('limit', '12');
      const response = await fetch(`/api/practitionerslist?${params.toString()}`);
      if (response.status === 401) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch practitioners');
      }
      const result = await response.json();
      setPractitioners(result.data || []);
      setTotal(result.total || 0);
      setTotalPages(result.totalpages || 1);
      setUnauthorized(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterSpecialization, filterAvailable, filterMinExperience, currentPage]);
  useEffect(() => {
    fetchPractitioners();
  }, [fetchPractitioners]);
  const handlePractitionerClick = practitionerId => {
    router.push(`/practitioner_profile?practitionersid=${practitionerId}`);
  };
  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    if (filterType === 'specialization') {
      setFilterSpecialization(value);
    } else if (filterType === 'available') {
      setFilterAvailable(value);
    } else if (filterType === 'min_experience') {
      setFilterMinExperience(value);
    }
  };
  const handlePageChange = page => {
    setCurrentPage(page);
  };
  if (loading) {
    return <div className='w-full h-full flex items-center justify-center'>Loading practitioners...</div>;
  }
  if (error) {
    return <div className='w-full h-full flex items-center justify-center'>Error loading practitioners</div>;
  }
  if (unauthorized) {
    return <div className='w-full h-full flex items-center justify-center'>Please log in to view practitioners</div>;
  }
  return <div className='w-full h-full p-4 sm:p-6 lg:p-8'><div key='header-filters' className='flex flex-col lg:flex-row justify-between items-start lg:items-center m-5'><div key='header' className='m-2'><h1 key='title' className='m-2'>Our Certified Practitioners</h1><p key='subtitle' className='m-2'>Discover our team of expert sound healing practitioners</p></div><div key='filters' className='flex flex-col sm:flex-row gap-4 m-2'><select key='specialization-filter' value={filterSpecialization} onChange={e => handleFilterChange('specialization', e.target.value)} className='m-2 p-3 border border-gray-300'><option key='all-specializations' value=''>All Specializations</option><option key='tibetan-bowls' value='Tibetan Singing Bowls'>Tibetan Singing Bowls</option><option key='crystal-bowls' value='Crystal Bowl Therapy'>Crystal Bowl Therapy</option><option key='gong-therapy' value='Gong Therapy'>Gong Therapy</option><option key='tuning-forks' value='Tuning Fork Therapy'>Tuning Fork Therapy</option></select><select key='available-filter' value={filterAvailable} onChange={e => handleFilterChange('available', e.target.value)} className='m-2 p-3 border border-gray-300'><option key='all-availability' value=''>All Availability</option><option key='available-only' value='true'>Available Now</option><option key='unavailable' value='false'>Currently Unavailable</option></select><select key='experience-filter' value={filterMinExperience} onChange={e => handleFilterChange('min_experience', e.target.value)} className='m-2 p-3 border border-gray-300'><option key='all-experience' value=''>All Experience Levels</option><option key='min-2-years' value='2'>2+ Years</option><option key='min-5-years' value='5'>5+ Years</option><option key='min-10-years' value='10'>10+ Years</option></select></div></div><div key='results-count' className='m-5'>{`${total} ${"practitioners found"}`}</div>{practitioners.length === 0 ? <div key='no-practitioners' className='flex items-center justify-center h-64'>No practitioners found matching your criteria</div> : <div key='practitioners-grid' className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 m-5'>{practitioners.map(practitioner => <div key={practitioner.id} className='border border-gray-300 p-4 flex flex-col h-full cursor-pointer' onClick={() => handlePractitionerClick(practitioner.id)} tabIndex={0} onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          handlePractitionerClick(practitioner.id);
        }
      }}>{practitioner.profile_image && <img key='profile-image' src={`data:image/jpeg;base64,${practitioner.profile_image}`} alt={practitioner.name} className='w-full h-48 object-cover m-2' />}<h3 key='name' className='m-2'>{practitioner.name}</h3><div key='availability' className={`m-2 text-sm font-semibold ${practitioner.available ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} p-2`}>{practitioner.available ? "Available" : "Currently Unavailable"}</div>{practitioner.experience_years && <div key='experience' className='m-2 text-blue-600 font-medium'>{`${practitioner.experience_years} ${"years of experience"}`}</div>}{practitioner.specializations && <div key='specializations' className='m-2'><strong key='spec-label'>Specializations: </strong><span key='spec-value'>{practitioner.specializations}</span></div>}{practitioner.certifications && <div key='certifications' className='m-2'><strong key='cert-label'>Certifications: </strong><span key='cert-value'>{practitioner.certifications}</span></div>}{practitioner.bio && <div key='bio' className='m-2 flex-grow'><strong key='bio-label'>About: </strong><span key='bio-value'>{practitioner.bio.length > 100 ? `${practitioner.bio.substring(0, 100)}...` : practitioner.bio}</span></div>}<div key='contact-info' className='m-2'>{practitioner.email && <div key='email' className='text-sm'>{practitioner.email}</div>}{practitioner.phone && <div key='phone' className='text-sm'>{practitioner.phone}</div>}</div></div>)}</div>}{totalPages > 1 && <div key='pagination' className='flex justify-center items-center gap-2 m-5'><button key='prev-button' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Previous</button><span key='page-info' className='m-3'>{`${"Page"} ${currentPage} ${"of"} ${totalPages}`}</span><button key='next-button' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Next</button></div>}</div>;
}