'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const CustomersDashboardView = function () {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [addressType, setAddressType] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/user');
      if (response.status === 401) {
        setError("You are not authorized to perform this action");
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch users');
      const userData = await response.json();
      const usersArray = Array.isArray(userData) ? userData : [userData];
      setUsers(usersArray);
      if (usersArray.length > 0 && !selectedUser) {
        setSelectedUser(usersArray[0]);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [selectedUser]);
  const fetchAddresses = useCallback(async () => {
    if (!selectedUser) return;
    try {
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', '10');
      if (addressType) params.append('type', addressType);
      const response = await fetch(`/api/addresseslist?${params.toString()}`);
      if (response.status === 401) {
        setError("Unauthorized to view addresses");
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch addresses');
      const data = await response.json();
      setAddresses(data.data || []);
    } catch (err) {
      setError(err.message);
    }
  }, [selectedUser, addressType]);
  const fetchOrders = useCallback(async () => {
    if (!selectedUser) return;
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '10');
      if (orderStatus) params.append('status', orderStatus);
      if (paymentStatus) params.append('payment_status', paymentStatus);
      params.append('sort', 'created_at');
      const response = await fetch(`/api/orderslist?${params.toString()}`);
      if (response.status === 401) {
        setError("Unauthorized to view orders");
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.data || []);
      setTotalPages(data.totalpages || 0);
    } catch (err) {
      setError(err.message);
    }
  }, [selectedUser, currentPage, orderStatus, paymentStatus]);
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUsers();
      setLoading(false);
    };
    loadData();
  }, [fetchUsers]);
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  const filteredUsers = users.filter(user => user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || user.oauthid?.toLowerCase().includes(searchTerm.toLowerCase()));
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  const handleUserSelect = user => {
    setSelectedUser(user);
    setCurrentPage(1);
  };
  if (loading) {
    return <div className='w-full flex justify-center items-center p-10'>Loading featured dresses...</div>;
  }
  if (error) {
    return <div className='w-full flex justify-center items-center p-10 text-red-600'>{error}</div>;
  }
  return <div className='w-full'><div className='flex flex-col lg:flex-row'><div className='w-full lg:w-1/3 p-4 border-r'><h2 className='text-xl font-bold m-4'>Customer List</h2><input type='text' placeholder='Search customers...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className='m-4 p-3 border w-full' /><div className='space-y-2'>{filteredUsers.map(user => <div key={user.id} className={`p-3 border cursor-pointer ${selectedUser?.id === user.id ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}`} onClick={() => handleUserSelect(user)}><div className='font-semibold'>{user.username}</div><div className='text-sm text-gray-600'>{user.oauthid}</div><div className={`text-xs ${user.isadmin ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'} p-1 rounded`}>{user.isadmin ? "Admin" : "Customer"}</div></div>)}</div></div><div className='w-full lg:w-2/3 p-4'>{selectedUser ? [<div key='customer-info' className='m-4'><h2 className='text-xl font-bold m-4'>Customer Details</h2><div className='border p-4 rounded'><div className='grid grid-cols-1 md:grid-cols-2 gap-4'><div><strong>Username: </strong>{selectedUser.username}</div><div><strong>OAuth ID: </strong>{selectedUser.oauthid}</div><div><strong>User Level: </strong>{selectedUser.userlevel}</div><div><strong>Admin Status: </strong><span className={selectedUser.isadmin ? 'text-red-600 font-bold' : 'text-green-600'}>{selectedUser.isadmin ? "Admin" : "Customer"}</span></div></div>{selectedUser.avatarurl && <div className='m-4'><img src={`${selectedUser.avatarurl}`} alt='User Avatar' className='w-20 h-20 rounded-full' /></div>}</div></div>, <div key='addresses' className='m-4'><div className='flex flex-col sm:flex-row justify-between items-center m-4'><h3 className='text-lg font-semibold'>Customer Addresses</h3><select value={addressType} onChange={e => setAddressType(e.target.value)} className='m-4 p-3 border'><option value=''>All Types</option><option value='shipping'>Shipping</option><option value='billing'>Billing</option></select></div><div className='grid grid-cols-1 md:grid-cols-2 gap-4'>{addresses.length === 0 ? <div className='col-span-full text-center p-8 text-gray-500'>No addresses found</div> : addresses.map(address => <div key={address.id} className='border p-4 rounded'><div className='flex justify-between items-start m-2'><span className={`text-xs ${address.type === 'shipping' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} p-2 rounded`}>{address.type}</span>{address.is_default && <span className='text-xs bg-yellow-100 text-yellow-800 p-2 rounded font-bold'>Default</span>}</div><div className='space-y-1'><div className='font-semibold'>{`${address.first_name} ${address.last_name}`}</div>{address.company && <div>{address.company}</div>}<div>{address.address_line_1}</div>{address.address_line_2 && <div>{address.address_line_2}</div>}<div>{`${address.city}, ${address.state_province} ${address.postal_code}`}</div><div>{address.country}</div>{address.phone && <div>{address.phone}</div>}</div></div>)}</div></div>, <div key='orders' className='m-4'><div className='flex flex-col lg:flex-row justify-between items-center m-4'><h3 className='text-lg font-semibold'>Order History</h3><div className='flex flex-col sm:flex-row gap-4'><select value={orderStatus} onChange={e => setOrderStatus(e.target.value)} className='m-2 p-3 border'><option value=''>All Statuses</option><option value='pending'>Pending</option><option value='processing'>Processing</option><option value='shipped'>Shipped</option><option value='delivered'>Delivered</option><option value='cancelled'>Cancelled</option></select><select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className='m-2 p-3 border'><option value=''>All Payments</option><option value='pending'>Pending</option><option value='paid'>Paid</option><option value='failed'>Failed</option><option value='refunded'>Refunded</option></select></div></div><div className='space-y-4'>{orders.length === 0 ? <div className='text-center p-8 text-gray-500'>No orders found</div> : orders.map(order => <div key={order.id} className='border p-4 rounded'><div className='flex flex-col sm:flex-row justify-between items-start m-2'><div><div className='font-semibold text-lg'>{order.order_number}</div><div className='text-sm text-gray-600'>{new Date(order.created_at).toLocaleDateString()}</div></div><div className='text-right'><div className='text-lg font-bold text-green-600'>{formatCurrency(order.total_amount, order.currency)}</div><div className={`text-xs p-2 rounded ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</div></div></div><div className='grid grid-cols-2 md:grid-cols-4 gap-4 m-2'><div><div className='text-sm text-gray-600'>Subtotal</div><div>{formatCurrency(order.subtotal, order.currency)}</div></div><div><div className='text-sm text-gray-600'>Tax</div><div>{formatCurrency(order.tax_amount, order.currency)}</div></div><div><div className='text-sm text-gray-600'>Shipping</div><div>{formatCurrency(order.shipping_amount, order.currency)}</div></div><div><div className='text-sm text-gray-600'>Payment Status</div><div className={`text-xs ${order.payment_status === 'paid' ? 'text-green-600' : order.payment_status === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>{order.payment_status}</div></div></div>{(order.tracking_number || order.shipped_at || order.delivered_at) && <div className='border-t pt-2 mt-2'><div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>{order.tracking_number && <div><span className='text-gray-600'>Tracking</span>{order.tracking_number}</div>}{order.shipped_at && <div><span className='text-gray-600'>Shipped: </span>{new Date(order.shipped_at).toLocaleDateString()}</div>}{order.delivered_at && <div><span className='text-gray-600'>Delivered: </span>{new Date(order.delivered_at).toLocaleDateString()}</div>}</div></div>}</div>)}</div>{totalPages > 1 && <div className='flex justify-center items-center m-4 space-x-2'><button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className='p-2 border disabled:opacity-50'>Previous</button><span className='p-2'>{`${"Page"} ${currentPage} ${" of "} ${totalPages}`}</span><button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className='p-2 border disabled:opacity-50'>Next</button></div>}</div>] : <div className='text-center p-8 text-gray-500'>Select a customer to view details</div>}</div></div></div>;
};
CustomersDashboardView.displayName = 'CustomersDashboardView';
export default CustomersDashboardView;