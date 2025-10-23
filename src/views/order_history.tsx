'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null
  });
  const orderStatuses = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const mockOrders = [{
    id: 'VD-2023-001',
    date: '2023-09-15',
    total: 1299.99,
    status: 'Shipped',
    items: [{
      name: 'Victorian Silk Gown',
      quantity: 1
    }]
  }, {
    id: 'VD-2023-002',
    date: '2023-10-22',
    total: 899.50,
    status: 'Delivered',
    items: [{
      name: 'Edwardian Walking Dress',
      quantity: 1
    }]
  }, {
    id: 'VD-2023-003',
    date: '2023-11-05',
    total: 599.75,
    status: 'Processing',
    items: [{
      name: 'Regency Era Ballgown',
      quantity: 1
    }]
  }];
  const getStatusColor = status => {
    switch (status) {
      case 'Shipped':
        return 'text-blue-600';
      case 'Delivered':
        return 'text-green-600';
      case 'Processing':
        return 'text-yellow-600';
      case 'Cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  const handleOrderDetails = orderId => {
    router.push(`/order_info?orderid=${orderId}`);
  };
  return <div className='h-full w-full p-4'><h1 className='text-3xl font-bold mb-6'>Order History</h1><div className='flex gap-2 mb-4'>{orderStatuses.map(status => <button key={status} onClick={() => setSelectedStatus(status === 'All' ? null : status)} className={`p-2 border ${selectedStatus === status ? 'border-2 border-blue-500' : 'border'}`}>{status}</button>)}</div><div className='flex gap-4 mb-4'><input type='date' onChange={e => setDateRange(prev => ({
        ...prev,
        start: e.target.value
      }))} className='p-2 border' /><input type='date' onChange={e => setDateRange(prev => ({
        ...prev,
        end: e.target.value
      }))} className='p-2 border' /></div><div className='grid gap-4'>{mockOrders.filter(order => !selectedStatus || order.status === selectedStatus).map(order => <div key={order.id} className='border p-4 flex justify-between items-center'><div><h3 className='font-bold'>{`Order #${order.id}`}</h3><p>{`Date: ${order.date}`}</p><p>{`Total: $${order.total.toFixed(2)}`}</p><p className={`font-semibold ${getStatusColor(order.status)}`}>{order.status}</p></div><button onClick={() => handleOrderDetails(order.id)} className='border p-2'>View Details</button></div>)}</div>{mockOrders.length === 0 && <div className='text-center p-8'><p>No orders found. Start shopping our Victorian collections!</p></div>}</div>;
}