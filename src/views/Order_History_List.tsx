'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const OrderHistoryListView = function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (paymentStatusFilter) params.append('payment_status', paymentStatusFilter);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      params.append('sort', sortBy);
      params.append('page', currentPage.toString());
      params.append('limit', '10');
      const response = await fetch(`/api/orderslist?${params.toString()}`);
      if (response.status === 401) {
        setError('Unauthorized access');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data.data || []);
      setTotalPages(data.totalpages || 1);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, paymentStatusFilter, startDate, endDate, currentPage, sortBy]);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  const handleStatusChange = e => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };
  const handlePaymentStatusChange = e => {
    setPaymentStatusFilter(e.target.value);
    setCurrentPage(1);
  };
  const handleStartDateChange = e => {
    setStartDate(e.target.value);
    setCurrentPage(1);
  };
  const handleEndDateChange = e => {
    setEndDate(e.target.value);
    setCurrentPage(1);
  };
  const handleSortChange = e => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };
  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-green-600';
      case 'shipped':
        return 'text-blue-600';
      case 'processing':
        return 'text-orange-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  const getPaymentStatusColor = paymentStatus => {
    switch (paymentStatus?.toLowerCase()) {
      case 'paid':
        return 'text-green-600';
      case 'pending':
        return 'text-orange-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  if (error) {
    return <div className='w-full p-5'><div className='text-red-600 text-center'>{error}</div></div>;
  }
  return <div className='w-full h-full p-5'><div className='mb-5'><h1 className='mb-5'>Order History</h1><div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-5'><div><label className='block mb-2'>Order Status</label><select value={statusFilter} onChange={handleStatusChange} className='m-2 p-2 border border-gray-300 w-full'><option value=''>All Statuses</option><option value='pending'>Pending</option><option value='processing'>Processing</option><option value='shipped'>Shipped</option><option value='delivered'>Delivered</option><option value='cancelled'>Cancelled</option></select></div><div><label className='block mb-2'>Payment Status</label><select value={paymentStatusFilter} onChange={handlePaymentStatusChange} className='m-2 p-2 border border-gray-300 w-full'><option value=''>All Payment Statuses</option><option value='paid'>Paid</option><option value='pending'>Pending</option><option value='failed'>Failed</option></select></div><div><label className='block mb-2'>Start Date</label><input type='date' value={startDate} onChange={handleStartDateChange} className='m-2 p-2 border border-gray-300 w-full' /></div><div><label className='block mb-2'>End Date</label><input type='date' value={endDate} onChange={handleEndDateChange} className='m-2 p-2 border border-gray-300 w-full' /></div><div><label className='block mb-2'>Sort by</label><select value={sortBy} onChange={handleSortChange} className='m-2 p-2 border border-gray-300 w-full'><option value='created_at'>Order Date</option><option value='total_amount'>Total Amount</option><option value='status'>Status</option></select></div></div></div>{loading ? <div className='text-center p-5'>Loading featured dresses...</div> : orders.length === 0 ? <div className='text-center p-5'>No orders found</div> : <div><div className='grid grid-cols-1 gap-5'>{orders.map(order => <div key={order.id} className='border border-gray-300 p-5 grid grid-cols-1 lg:grid-cols-6 gap-5'><div><div className='font-bold mb-2'>Order Number: </div><div>{order.order_number}</div></div><div><div className='font-bold mb-2'>Order Date: </div><div>{formatDate(order.created_at)}</div></div><div><div className='font-bold mb-2'>Status</div><div className={getStatusColor(order.status)}>{order.status}</div></div><div><div className='font-bold mb-2'>Total</div><div className='font-bold text-lg'>{formatCurrency(order.total_amount, order.currency)}</div></div><div><div className='font-bold mb-2'>Payment Status: </div><div className={getPaymentStatusColor(order.payment_status)}>{order.payment_status}</div></div><div>{order.tracking_number ? <div><div className='font-bold mb-2'>Tracking</div><div className='text-blue-600'>{order.tracking_number}</div></div> : <div><div className='font-bold mb-2'>Tracking</div><div className='text-gray-500'>Not available</div></div>}</div></div>)}</div>{totalPages > 1 && <div className='flex justify-center items-center gap-5 mt-5'><button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className='border border-gray-300 !bg-transparent !text-gray-800 p-3'>Previous</button><span className='p-3'>Page </span><button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className='border border-gray-300 !bg-transparent !text-gray-800 p-3'>Next</button></div>}</div>}</div>;
};
OrderHistoryListView.displayName = 'OrderHistoryListView';
export default OrderHistoryListView;