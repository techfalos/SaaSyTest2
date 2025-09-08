'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const OrdersDashboardView = function OrderManagementComponent() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unauthorized, setUnauthorized] = useState(false);
  const loadOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (paymentStatusFilter) params.append('payment_status', paymentStatusFilter);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      const response = await fetch(`/api/orderslist?${params.toString()}`);
      if (response.status === 401) {
        setUnauthorized(true);
        return;
      }
      const data = await response.json();
      setOrders(data.data || []);
      setTotalPages(data.totalpages || 1);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }, [currentPage, statusFilter, paymentStatusFilter, startDate, endDate]);
  const loadUserInfo = useCallback(async () => {
    try {
      const response = await fetch('/api/user');
      if (response.status === 401) {
        setUnauthorized(true);
        return;
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  }, []);
  const loadOrderDetails = useCallback(async orderId => {
    try {
      const response = await fetch(`/api/ordersget?id=${orderId}`);
      if (response.status === 401) {
        setUnauthorized(true);
        return;
      }
      const orderData = await response.json();
      setSelectedOrder(orderData);
      const itemsResponse = await fetch(`/api/orderitemslist?order_id=${orderId}&page=1&limit=100`);
      if (itemsResponse.status !== 401) {
        const itemsData = await itemsResponse.json();
        setOrderItems(itemsData.data || []);
      }
      setShowOrderModal(true);
    } catch (error) {
      console.error('Error loading order details:', error);
    }
  }, []);
  const updateOrderStatus = useCallback(async (orderId, newStatus, trackingNumber, notes) => {
    try {
      const response = await fetch('/api/ordersupdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
          tracking_number: trackingNumber,
          notes: notes
        })
      });
      if (response.status === 401) {
        setUnauthorized(true);
        return;
      }
      const updatedOrder = await response.json();
      setOrders(orders.map(order => order.id === orderId ? {
        ...order,
        ...updatedOrder
      } : order));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
      loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  }, [orders, selectedOrder, loadOrders]);
  useEffect(() => {
    loadUserInfo();
    loadOrders();
  }, [loadUserInfo, loadOrders]);
  if (unauthorized) {
    return <div className='w-full h-full flex items-center justify-center p-5'><div className='text-center'><p className='text-lg m-5'>Please log in to view dresses.</p><p>Please log in with admin privileges to continue.</p></div></div>;
  }
  return <div className='w-full h-full p-3 sm:p-5 lg:p-5'><div className='m-5'><h1>Order Management Dashboard</h1></div><div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 m-5'><div><label className='block m-2'>Status Filter</label><select className='m-5 p-3 border w-full' value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value=''>All Statuses</option><option value='pending'>Pending</option><option value='confirmed'>Confirmed</option><option value='shipped'>Shipped</option><option value='delivered'>Delivered</option><option value='cancelled'>Cancelled</option></select></div><div><label className='block m-2'>Payment Status</label><select className='m-5 p-3 border w-full' value={paymentStatusFilter} onChange={e => setPaymentStatusFilter(e.target.value)}><option value=''>All Payment Statuses</option><option value='pending'>Pending</option><option value='paid'>Paid</option><option value='failed'>Failed</option><option value='refunded'>Refunded</option></select></div><div><label className='block m-2'>Start Date</label><input type='date' className='m-5 p-3 border w-full' value={startDate} onChange={e => setStartDate(e.target.value)} /></div><div><label className='block m-2'>End Date</label><input type='date' className='m-5 p-3 border w-full' value={endDate} onChange={e => setEndDate(e.target.value)} /></div></div><div className='m-5'>{orders.length === 0 ? <p>No orders found</p> : <div className='overflow-x-auto'><table className='w-full border border-gray-300'><thead><tr className='bg-gray-100'><th className='border p-3 text-left'>Order #</th><th className='border p-3 text-left'>Status</th><th className='border p-3 text-left'>Payment Status</th><th className='border p-3 text-left'>Total</th><th className='border p-3 text-left'>Created</th><th className='border p-3 text-left'>Actions</th></tr></thead><tbody>{orders.map(order => <tr key={order.id}><td className='border p-3'>{order.order_number || 'N/A'}</td><td className='border p-3'><span className={`px-2 py-1 rounded text-sm ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span></td><td className='border p-3'><span className={`px-2 py-1 rounded text-sm ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : order.payment_status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.payment_status}</span></td><td className='border p-3 font-bold text-green-600'>{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: order.currency || 'USD'
                }).format(order.total_amount)}</td><td className='border p-3'>{new Date(order.created_at).toLocaleDateString()}</td><td className='border p-3'><button className='border !text-gray-800 border-gray-300 !bg-transparent p-3' onClick={() => loadOrderDetails(order.id)}>View Details</button></td></tr>)}</tbody></table></div>}</div>{totalPages > 1 && <div className='flex flex-col sm:flex-row justify-center items-center m-5 gap-3'><button className='border !text-gray-800 border-gray-300 !bg-transparent p-3' disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button><span className='m-3'>Page </span><button className='border !text-gray-800 border-gray-300 !bg-transparent p-3' disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button></div>}{showOrderModal && selectedOrder && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-5 z-50'><div className='bg-white p-5 rounded max-w-4xl w-full max-h-full overflow-y-auto'><div className='flex flex-col sm:flex-row justify-between items-center m-5'><h2>Order Details - ${selectedOrder.order_number}</h2><button className='border !text-gray-800 border-gray-300 !bg-transparent p-3' onClick={() => setShowOrderModal(false)}>Close</button></div><div className='grid grid-cols-1 lg:grid-cols-2 gap-5 m-5'><div><h3>Order Information</h3><p className='m-2'>{`${"Status"}: ${selectedOrder.status}`}</p><p className='m-2'>{`${"Payment Status"}: ${selectedOrder.payment_status}`}</p><p className='m-2 font-bold text-green-600'>{`${"Total"}: ${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: selectedOrder.currency || 'USD'
              }).format(selectedOrder.total_amount)}`}</p>{selectedOrder.tracking_number && <p className='m-2'>{`${"Tracking"}: ${selectedOrder.tracking_number}`}</p>}{selectedOrder.notes && <p className='m-2'>{`${"Notes"}: ${selectedOrder.notes}`}</p>}</div><div><h3>Update Order</h3><div className='m-5'><label className='block m-2'>Status</label><select className='m-5 p-3 border w-full' id='statusUpdate' defaultValue={selectedOrder.status}><option value='pending'>Pending</option><option value='confirmed'>Confirmed</option><option value='shipped'>Shipped</option><option value='delivered'>Delivered</option><option value='cancelled'>Cancelled</option></select></div><div className='m-5'><label className='block m-2'>Tracking Number</label><input type='text' className='m-5 p-3 border w-full' id='trackingUpdate' defaultValue={selectedOrder.tracking_number || ''} /></div><div className='m-5'><label className='block m-2'>Notes</label><textarea className='m-5 p-3 border w-full' id='notesUpdate' defaultValue={selectedOrder.notes || ''} rows={3} /></div><button className='border !text-gray-800 border-gray-300 !bg-transparent p-3 m-5' onClick={() => {
              const status = document.getElementById('statusUpdate').value;
              const tracking = document.getElementById('trackingUpdate').value;
              const notes = document.getElementById('notesUpdate').value;
              updateOrderStatus(selectedOrder.id, status, tracking, notes);
            }}>Update Order</button></div></div><div className='m-5'><h3>Order Items</h3>{orderItems.length === 0 ? <p>No items in cart</p> : <div className='overflow-x-auto'><table className='w-full border border-gray-300 m-3'><thead><tr className='bg-gray-100'><th className='border p-3 text-left'>Item</th><th className='border p-3 text-left'>Size</th><th className='border p-3 text-left'>Color</th><th className='border p-3 text-left'>Qty</th><th className='border p-3 text-left'>Price</th><th className='border p-3 text-left'>Total</th></tr></thead><tbody>{orderItems.map(item => <tr key={item.id}><td className='border p-3'><div className='flex items-center gap-3'>{item.dress_image && <img src={`${item.dress_image}`} className='w-16 h-16 max-w-full max-h-full h-auto w-auto' />}<div><p className='font-semibold'>{item.dress_name || 'Dress'}</p><p className='text-sm'>{`ID: ${item.dressesid}`}</p></div></div></td><td className='border p-3'>{item.size}</td><td className='border p-3'>{item.color}</td><td className='border p-3'>{item.quantity}</td><td className='border p-3'>{new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: selectedOrder.currency || 'USD'
                    }).format(item.price_at_time)}</td><td className='border p-3 font-bold text-green-600'>{new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: selectedOrder.currency || 'USD'
                    }).format(item.line_total)}</td></tr>)}</tbody></table></div>}</div></div></div>}</div>;
};
OrdersDashboardView.displayName = 'OrdersDashboardView';
export default OrdersDashboardView;