'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function MemberProfile() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await fetch('/api/members');
        if (!response.ok) {
          throw new Error('Failed to fetch member data');
        }
        const data = await response.json();
        if (data && data.length > 0) {
          setMember(data[0]);
          setFormData(data[0]);
        } else {
          setError('No member data found');
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
    setIsEditing(true);
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(member);
  };
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        setFormData({
          ...formData,
          profile_image: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`/api/members/${formData.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      const updatedMember = await response.json();
      setMember(updatedMember);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };
  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  if (loading) {
    return <div className='p-4'><p>Loading profile information...</p></div>;
  }
  if (error) {
    return <div className='p-4'><p>{`Error: ${error}`}</p></div>;
  }
  if (!member) {
    return <div className='p-4'><p>No member profile found.</p></div>;
  }
  const renderMemberInfo = () => {
    return <div className='p-4'><h1 className='mb-4'>Member Profile</h1><div className='mb-4 border p-4 rounded'><div className='flex flex-col md:flex-row'><div className='md:w-1/3 mb-4 md:mb-0 md:mr-4'>{member.profile_image ? <img src={member.profile_image.startsWith('data:') ? member.profile_image : `data:image/jpeg;base64,${member.profile_image}`} alt='Profile Picture' className='rounded' /> : <div className='border p-4 rounded text-center'>Image not found</div>}</div><div className='md:w-2/3'><div className='mb-2'><strong>Name: </strong>{`${member.first_name} ${member.last_name}`}</div><div className='mb-2'><strong>Email: </strong>{member.email}</div><div className='mb-2'><strong>Phone: </strong>{member.phone || 'Not provided'}</div><div className='mb-2'><strong>Address: </strong>{member.address ? `${member.address}, ${member.city}, ${member.state} ${member.zip}` : 'Not provided'}</div><div className='mb-2'><strong>Membership Type: </strong>{member.membership_type}</div><div className='mb-2'><strong>Joined Date: </strong>{formatDate(member.joined_date)}</div><div className='mb-2'><strong>Expiration Date: </strong>{formatDate(member.expiration_date)}</div></div></div><div className='mt-4'><button onClick={handleEditClick} className='border rounded px-4 py-2'>Edit Profile</button></div></div></div>;
  };
  const renderEditForm = () => {
    return <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'><div className='bg-white p-4 rounded w-full max-w-2xl overflow-y-auto max-h-screen'><h1 className='mb-4'>Edit Profile</h1><div className='mb-4'><label className='block mb-1'>First Name:</label><input type='text' name='first_name' value={formData.first_name} onChange={handleInputChange} className='border rounded p-2 w-full' /></div><div className='mb-4'><label className='block mb-1'>Last Name:</label><input type='text' name='last_name' value={formData.last_name} onChange={handleInputChange} className='border rounded p-2 w-full' /></div><div className='mb-4'><label className='block mb-1'>Email:</label><input type='email' name='email' value={formData.email} onChange={handleInputChange} className='border rounded p-2 w-full' /></div><div className='mb-4'><label className='block mb-1'>Phone:</label><input type='text' name='phone' value={formData.phone || ''} onChange={handleInputChange} className='border rounded p-2 w-full' /></div><div className='mb-4'><label className='block mb-1'>Address:</label><input type='text' name='address' value={formData.address || ''} onChange={handleInputChange} className='border rounded p-2 w-full' /></div><div className='mb-4 flex flex-wrap'><div className='w-full sm:w-1/3 pr-2 mb-4 sm:mb-0'><label className='block mb-1'>City:</label><input type='text' name='city' value={formData.city || ''} onChange={handleInputChange} className='border rounded p-2 w-full' /></div><div className='w-full sm:w-1/3 px-2 mb-4 sm:mb-0'><label className='block mb-1'>State:</label><input type='text' name='state' value={formData.state || ''} onChange={handleInputChange} className='border rounded p-2 w-full' /></div><div className='w-full sm:w-1/3 pl-2'><label className='block mb-1'>ZIP:</label><input type='text' name='zip' value={formData.zip || ''} onChange={handleInputChange} className='border rounded p-2 w-full' /></div></div><div className='mb-4'><label className='block mb-1'>Membership Type:</label><select name='membership_type' value={formData.membership_type} onChange={handleInputChange} className='border rounded p-2 w-full'><option value='Standard'>Standard</option><option value='Premium'>Premium</option><option value='Lifetime'>Lifetime</option></select></div><div className='mb-4'><label className='block mb-1'>Profile Image:</label><input type='file' onChange={handleFileChange} accept='image/*' className='border rounded p-2 w-full' />{profileImage && <img src={profileImage} alt='Profile Preview' className='mt-2 rounded' />}</div><div className='flex justify-end space-x-2'><button onClick={handleCancelEdit} className='border rounded px-4 py-2'>Cancel</button><button onClick={handleSaveProfile} className='border rounded px-4 py-2'>Save Changes</button></div></div></div>;
  };
  return <div className='p-4'>{isEditing ? renderEditForm() : renderMemberInfo()}</div>;
}