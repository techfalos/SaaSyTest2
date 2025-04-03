'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function MemberDetailView() {
  const router = useRouter();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
        const memberId = urlParams.get('MembersID');
        if (!memberId) {
          throw new Error('Member ID not found in URL');
        }
        const response = await fetch(`/api/members?ID=${memberId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch member data');
        }
        const data = await response.json();
        if (data && data.length > 0) {
          setMember(data[0]);
          setEditFormData(data[0]);
        } else {
          throw new Error('Member not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMemberData();
  }, []);
  const handleEditClick = () => {
    setShowEditModal(true);
  };
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };
  const handleCloseModal = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
  };
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setSelectedImage(base64String);
        setEditFormData({
          ...editFormData,
          profile_image: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/members/${member.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });
      if (!response.ok) {
        throw new Error('Failed to update member');
      }
      setMember(editFormData);
      setShowEditModal(false);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleDeleteMember = async () => {
    try {
      const response = await fetch(`/api/members/${member.ID}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete member');
      }
      router.push('/members');
    } catch (err) {
      setError(err.message);
    }
  };
  if (loading) {
    return <div className='p-4'><p>Loading member information...</p></div>;
  }
  if (error) {
    return <div className='p-4'><p>{`Error: ${error}`}</p></div>;
  }
  if (!member) {
    return <div className='p-4'><p>Member not found</p></div>;
  }
  return <div className='p-4'><div className='mb-6'><h1 className='mb-4'>{`${member.first_name} ${member.last_name}`}</h1><div className='flex flex-col md:flex-row'><div className='mb-4 md:mr-6'>{member.profile_image ? <img src={member.profile_image.startsWith('data:') ? member.profile_image : `data:image/jpeg;base64,${member.profile_image}`} alt='Member profile' className='mb-2 border' /> : <div className='border p-4'>No profile image available</div>}</div><div><div className='mb-2'><strong>Email: </strong><span>{member.email || 'Not provided'}</span></div><div className='mb-2'><strong>Phone: </strong><span>{member.phone || 'Not provided'}</span></div><div className='mb-2'><strong>Address: </strong><span>{[member.address, member.city, member.state, member.zip].filter(Boolean).join(', ') || 'Not provided'}</span></div><div className='mb-2'><strong>Membership Type: </strong><span>{member.membership_type || 'Not specified'}</span></div><div className='mb-2'><strong>Joined Date: </strong><span>{member.joined_date ? new Date(member.joined_date).toLocaleDateString() : 'Not specified'}</span></div><div className='mb-2'><strong>Expiration Date: </strong><span>{member.expiration_date ? new Date(member.expiration_date).toLocaleDateString() : 'Not specified'}</span></div></div></div><div className='mt-4 flex'><button className='mr-2 border p-2' onClick={handleEditClick}>Edit Member</button><button className='border p-2' onClick={handleDeleteClick}>Delete Member</button></div></div>{showEditModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10'><div className='bg-white p-6 border w-full max-w-2xl'><h2 className='mb-4'>Edit Member</h2><div className='mb-4 grid grid-cols-1 md:grid-cols-2 gap-4'><div className='mb-2'><label className='block mb-1'>First Name *</label><input type='text' name='first_name' value={editFormData.first_name || ''} onChange={handleInputChange} className='w-full border p-2' required={true} /></div><div className='mb-2'><label className='block mb-1'>Last Name *</label><input type='text' name='last_name' value={editFormData.last_name || ''} onChange={handleInputChange} className='w-full border p-2' required={true} /></div><div className='mb-2'><label className='block mb-1'>Email *</label><input type='email' name='email' value={editFormData.email || ''} onChange={handleInputChange} className='w-full border p-2' required={true} /></div><div className='mb-2'><label className='block mb-1'>Phone</label><input type='tel' name='phone' value={editFormData.phone || ''} onChange={handleInputChange} className='w-full border p-2' /></div><div className='mb-2'><label className='block mb-1'>Address</label><input type='text' name='address' value={editFormData.address || ''} onChange={handleInputChange} className='w-full border p-2' /></div><div className='mb-2'><label className='block mb-1'>City</label><input type='text' name='city' value={editFormData.city || ''} onChange={handleInputChange} className='w-full border p-2' /></div><div className='mb-2'><label className='block mb-1'>State</label><input type='text' name='state' value={editFormData.state || ''} onChange={handleInputChange} className='w-full border p-2' /></div><div className='mb-2'><label className='block mb-1'>ZIP</label><input type='text' name='zip' value={editFormData.zip || ''} onChange={handleInputChange} className='w-full border p-2' /></div><div className='mb-2'><label className='block mb-1'>Membership Type *</label><input type='text' name='membership_type' value={editFormData.membership_type || ''} onChange={handleInputChange} className='w-full border p-2' required={true} /></div><div className='mb-2'><label className='block mb-1'>Joined Date *</label><input type='date' name='joined_date' value={editFormData.joined_date ? new Date(editFormData.joined_date).toISOString().split('T')[0] : ''} onChange={handleInputChange} className='w-full border p-2' required={true} /></div><div className='mb-2'><label className='block mb-1'>Expiration Date *</label><input type='date' name='expiration_date' value={editFormData.expiration_date ? new Date(editFormData.expiration_date).toISOString().split('T')[0] : ''} onChange={handleInputChange} className='w-full border p-2' required={true} /></div><div className='mb-2 col-span-1 md:col-span-2'><label className='block mb-1'>Profile Image</label><input type='file' accept='image/*' onChange={handleImageChange} className='w-full border p-2' />{(selectedImage || editFormData.profile_image) && <div className='mt-2'><img src={selectedImage || (editFormData.profile_image && editFormData.profile_image.startsWith('data:') ? editFormData.profile_image : `data:image/jpeg;base64,${editFormData.profile_image}`)} alt='Profile Preview' className='mt-2 border' /></div>}</div></div><div className='flex justify-end mt-4'><button className='mr-2 border p-2' onClick={handleCloseModal}>Cancel</button><button className='border p-2' onClick={handleSaveChanges}>Save Changes</button></div></div></div>}{showDeleteModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10'><div className='bg-white p-6 border'><h2 className='mb-4'>Confirm Deletion</h2><p className='mb-4'>{`Are you sure you want to delete ${member.first_name} ${member.last_name}? This action cannot be undone.`}</p><div className='flex justify-end'><button className='mr-2 border p-2' onClick={handleCloseModal}>Cancel</button><button className='border p-2' onClick={handleDeleteMember}>Delete</button></div></div></div>}</div>;
}