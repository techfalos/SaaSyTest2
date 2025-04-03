'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function MembersListView() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [membershipFilter, setMembershipFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [modalMode, setModalMode] = useState('');
  useEffect(() => {
    fetchMembers();
  }, []);
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/members');
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddMember = () => {
    setCurrentMember({
      ID: crypto.randomUUID(),
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      membership_type: '',
      joined_date: new Date().toISOString().split('T')[0],
      expiration_date: '',
      profile_image: null
    });
    setModalMode('add');
    setShowModal(true);
  };
  const handleEditMember = member => {
    setCurrentMember({
      ...member
    });
    setModalMode('edit');
    setShowModal(true);
  };
  const handleDeleteMember = member => {
    setCurrentMember(member);
    setModalMode('delete');
    setShowModal(true);
  };
  const handleViewDetails = member => {
    router.push(`/member_details?MembersID=${member.ID}`);
  };
  const handleSaveMember = async () => {
    try {
      let url = '/api/members';
      let method = 'POST';
      if (modalMode === 'edit') {
        url = `/api/members/${currentMember.ID}`;
        method = 'PUT';
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentMember)
      });
      if (!response.ok) {
        throw new Error(`Failed to ${modalMode === 'add' ? 'add' : 'update'} member`);
      }
      if (modalMode === 'add') {
        const newMember = await response.json();
        setMembers([...members, newMember]);
      } else {
        setMembers(members.map(m => m.ID === currentMember.ID ? currentMember : m));
      }
      setShowModal(false);
    } catch (error) {
      console.error(`Error ${modalMode === 'add' ? 'adding' : 'updating'} member:`, error);
    }
  };
  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/members/${currentMember.ID}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete member');
      }
      setMembers(members.filter(m => m.ID !== currentMember.ID));
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setCurrentMember({
        ...currentMember,
        profile_image: base64String
      });
    };
    reader.readAsDataURL(file);
  };
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setCurrentMember({
      ...currentMember,
      [name]: value
    });
  };
  const filteredMembers = members.filter(member => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const matchesSearch = searchTerm === '' || fullName.includes(searchTerm.toLowerCase()) || member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMembershipType = membershipFilter === '' || member.membership_type && member.membership_type === membershipFilter;
    const matchesDate = dateFilter === '' || member.expiration_date && member.expiration_date.includes(dateFilter);
    return matchesSearch && matchesMembershipType && matchesDate;
  });
  const membershipTypes = Array.from(new Set(members.filter(m => m.membership_type).map(m => m.membership_type)));
  return <div className='p-4'><h1 className='mb-6'>Members Directory</h1><div className='mb-6'><button className='p-2 border rounded mb-4' onClick={handleAddMember}>Add New Member</button></div><div className='mb-6 flex flex-wrap gap-4'><div className='flex-1 min-w-[200px]'><input type='text' placeholder='Search by name or email' className='w-full p-2 border rounded' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div><div className='flex-1 min-w-[200px]'><select className='w-full p-2 border rounded' value={membershipFilter} onChange={e => setMembershipFilter(e.target.value)}><option value=''>All Membership Types</option>{membershipTypes.map(type => <option key={type} value={type}>{type}</option>)}</select></div><div className='flex-1 min-w-[200px]'><input type='date' className='w-full p-2 border rounded' value={dateFilter} onChange={e => setDateFilter(e.target.value)} placeholder='Filter by expiration date' /></div></div>{loading ? <p>Loading members...</p> : filteredMembers.length === 0 ? <p>No members found.</p> : <div className='overflow-x-auto'><table className='w-full border-collapse'><thead><tr className='border-b'><th className='p-2 text-left'>Name</th><th className='p-2 text-left'>Email</th><th className='p-2 text-left'>Membership Type</th><th className='p-2 text-left'>Joined Date</th><th className='p-2 text-left'>Expiration Date</th><th className='p-2 text-left'>Actions</th></tr></thead><tbody>{filteredMembers.map(member => <tr key={member.ID} className='border-b'><td className='p-2'>{`${member.first_name} ${member.last_name}`}</td><td className='p-2'>{member.email}</td><td className='p-2'>{member.membership_type}</td><td className='p-2'>{new Date(member.joined_date).toLocaleDateString()}</td><td className='p-2'>{new Date(member.expiration_date).toLocaleDateString()}</td><td className='p-2 flex gap-2'><button className='p-1 border rounded' onClick={() => handleViewDetails(member)}>View</button><button className='p-1 border rounded' onClick={() => handleEditMember(member)}>Edit</button><button className='p-1 border rounded' onClick={() => handleDeleteMember(member)}>Delete</button></td></tr>)}</tbody></table></div>}{showModal && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'><div className='bg-white p-6 rounded w-full max-w-lg'><h2 className='mb-4'>{modalMode === 'add' ? 'Add New Member' : modalMode === 'edit' ? 'Edit Member' : 'Confirm Delete'}</h2>{modalMode === 'delete' ? <p className='mb-4'>{`Are you sure you want to delete ${currentMember.first_name} ${currentMember.last_name}?`}</p> : <div className='space-y-4'><div><label className='block mb-1'>First Name *</label><input type='text' name='first_name' value={currentMember.first_name} onChange={handleInputChange} className='w-full p-2 border rounded' required={true} /></div><div><label className='block mb-1'>Last Name *</label><input type='text' name='last_name' value={currentMember.last_name} onChange={handleInputChange} className='w-full p-2 border rounded' required={true} /></div><div><label className='block mb-1'>Email *</label><input type='email' name='email' value={currentMember.email} onChange={handleInputChange} className='w-full p-2 border rounded' required={true} /></div><div><label className='block mb-1'>Phone</label><input type='tel' name='phone' value={currentMember.phone || ''} onChange={handleInputChange} className='w-full p-2 border rounded' /></div><div><label className='block mb-1'>Address</label><input type='text' name='address' value={currentMember.address || ''} onChange={handleInputChange} className='w-full p-2 border rounded' /></div><div className='flex gap-4'><div className='flex-1'><label className='block mb-1'>City</label><input type='text' name='city' value={currentMember.city || ''} onChange={handleInputChange} className='w-full p-2 border rounded' /></div><div className='w-24'><label className='block mb-1'>State</label><input type='text' name='state' value={currentMember.state || ''} onChange={handleInputChange} className='w-full p-2 border rounded' /></div><div className='w-24'><label className='block mb-1'>ZIP</label><input type='text' name='zip' value={currentMember.zip || ''} onChange={handleInputChange} className='w-full p-2 border rounded' /></div></div><div><label className='block mb-1'>Membership Type *</label><select name='membership_type' value={currentMember.membership_type || ''} onChange={handleInputChange} className='w-full p-2 border rounded' required={true}><option value=''>Select Membership Type</option><option value='Standard'>Standard</option><option value='Premium'>Premium</option><option value='Lifetime'>Lifetime</option></select></div><div><label className='block mb-1'>Joined Date *</label><input type='date' name='joined_date' value={currentMember.joined_date || ''} onChange={handleInputChange} className='w-full p-2 border rounded' required={true} /></div><div><label className='block mb-1'>Expiration Date *</label><input type='date' name='expiration_date' value={currentMember.expiration_date || ''} onChange={handleInputChange} className='w-full p-2 border rounded' required={true} /></div><div><label className='block mb-1'>Profile Image</label><input type='file' accept='image/*' onChange={handleFileChange} className='w-full p-2 border rounded' />{currentMember.profile_image && <div className='mt-2 border p-2 rounded'><img src={currentMember.profile_image.startsWith('data:') ? currentMember.profile_image : `data:image/jpeg;base64,${currentMember.profile_image}`} alt='Profile Preview' className='h-24' /></div>}</div></div>}<div className='flex justify-end gap-2 mt-6'><button className='p-2 border rounded' onClick={() => setShowModal(false)}>Cancel</button>{modalMode === 'delete' ? <button className='p-2 border rounded' onClick={handleDeleteConfirm}>Delete</button> : <button className='p-2 border rounded' onClick={handleSaveMember}>Save</button>}</div></div></div>}</div>;
}