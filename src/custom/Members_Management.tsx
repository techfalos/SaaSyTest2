'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function MembersDashboard() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/members');
        if (!response.ok) {
          throw new Error('Failed to fetch members data');
        }
        const data = await response.json();
        setMembers(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);
  const calculateStatistics = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const totalMembers = members.length;
    const newMembersThisMonth = members.filter(member => {
      const joinedDate = new Date(member.joined_date);
      return joinedDate.getMonth() === currentMonth && joinedDate.getFullYear() === currentYear;
    }).length;
    const expiringMembersThisMonth = members.filter(member => {
      const expirationDate = new Date(member.expiration_date);
      return expirationDate.getMonth() === currentMonth && expirationDate.getFullYear() === currentYear;
    }).length;
    return {
      totalMembers,
      newMembersThisMonth,
      expiringMembersThisMonth
    };
  };
  const handleManageMembersClick = () => {
    router.push('/members');
  };
  if (isLoading) {
    return <div className='p-4 w-1/2'><h1 className='mb-4'>Member Dashboard</h1><p>Loading member data...</p></div>;
  }
  if (error) {
    return <div className='p-4 w-1/2'><h1 className='mb-4'>Member Dashboard</h1><p>{`Error: ${error}`}</p></div>;
  }
  const stats = calculateStatistics();
  return <div className='p-4 w-1/2'><h1 className='mb-4'>Member Dashboard</h1><div className='mb-6 border p-4 rounded'><div className='mb-4'><h2>Membership Statistics</h2></div><div className='grid grid-cols-3 gap-4'><div className='border p-3 rounded'><p className='mb-1'>Total Members</p><p>{stats.totalMembers}</p></div><div className='border p-3 rounded'><p className='mb-1'>New Members This Month</p><p>{stats.newMembersThisMonth}</p></div><div className='border p-3 rounded'><p className='mb-1'>Expiring Memberships This Month</p><p>{stats.expiringMembersThisMonth}</p></div></div></div><div className='mt-4'><button className='border rounded px-4 py-2' onClick={handleManageMembersClick}>Manage Members</button></div></div>;
}