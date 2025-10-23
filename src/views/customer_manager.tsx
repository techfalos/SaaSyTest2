'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [responded, setResponded] = useState(false);
  const [responseNotes, setResponseNotes] = useState('');
  const [unauthorized, setUnauthorized] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const ordersRes = await fetch('/api/orderslist?limit=1000');
      if (ordersRes.status === 401) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      const ordersData = await ordersRes.json();
      setOrders(ordersData.data || []);
      const messagesRes = await fetch('/api/contactmessageslist?limit=1000');
      if (messagesRes.status === 401) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      const messagesData = await messagesRes.json();
      setMessages(messagesData.data || []);
      const customerMap = new Map();
      ordersData.data.forEach(order => {
        const email = order.shipping_name || 'Unknown';
        if (!customerMap.has(email)) {
          customerMap.set(email, {
            name: order.shipping_name,
            email: email,
            orders: [],
            totalSpent: 0,
            orderCount: 0
          });
        }
        const customer = customerMap.get(email);
        customer.orders.push(order);
        customer.totalSpent += order.total;
        customer.orderCount += 1;
      });
      messagesData.data.forEach(message => {
        if (!customerMap.has(message.email)) {
          customerMap.set(message.email, {
            name: message.name,
            email: message.email,
            orders: [],
            totalSpent: 0,
            orderCount: 0
          });
        }
        const customer = customerMap.get(message.email);
        if (!customer.messages) {
          customer.messages = [];
        }
        customer.messages.push(message);
      });
      setCustomers(Array.from(customerMap.values()));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const handleViewCustomer = customer => {
    setSelectedCustomer(customer);
  };
  const handleViewMessage = async messageId => {
    try {
      const res = await fetch(`/api/contactmessagesget?id=${messageId}`);
      if (res.status === 401) {
        return;
      }
      const data = await res.json();
      setSelectedMessage(data);
      setResponded(data.responded || false);
      setResponseNotes(data.response_notes || '');
    } catch (error) {
      console.error('Error fetching message:', error);
    }
  };
  const handleUpdateMessage = async () => {
    if (!selectedMessage) return;
    try {
      const res = await fetch('/api/contactmessagesupdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: selectedMessage.id,
          responded: responded,
          response_notes: responseNotes
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setMessages(messages.map(m => m.id === updated.id ? {
          ...m,
          responded: updated.responded
        } : m));
        setSelectedMessage(null);
        setResponseNotes('');
        setResponded(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };
  const filteredCustomers = customers.filter(customer => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return customer.name && customer.name.toLowerCase().includes(search) || customer.email && customer.email.toLowerCase().includes(search);
  });
  if (loading) {
    return <div className='w-full flex items-center justify-center p-8'><div>Loading customer data...</div></div>;
  }
  if (unauthorized) {
    return <div className='w-full flex items-center justify-center p-8'><div className='text-red-600'>Access denied. Admin privileges required.</div></div>;
  }
  return <div className='w-full'><div className='p-4 sm:p-6 lg:p-8'><h1 className='mb-6'>Customer Management</h1><div className='mb-6'><input type='text' placeholder='Search by name or email' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className='w-full p-3 m-2 border-2 border-solid' /></div>{filteredCustomers.length === 0 ? <div className='p-4'>No customers found</div> : <div className='overflow-x-auto'><table className='w-full'><thead><tr><th className='p-3 text-left'>Name</th><th className='p-3 text-left'>Email</th><th className='p-3 text-left'>Orders</th><th className='p-3 text-left'>Total Spent</th><th className='p-3 text-left'>Actions</th></tr></thead><tbody>{filteredCustomers.map((customer, index) => <tr key={index} className='border-t-2 border-solid'><td className='p-3'>{customer.name || 'N/A'}</td><td className='p-3'>{customer.email}</td><td className='p-3'>{customer.orderCount}</td><td className='p-3'>{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(customer.totalSpent)}</td><td className='p-3'><button onClick={() => handleViewCustomer(customer)} className='p-3'>View Details</button></td></tr>)}</tbody></table></div>}</div>{selectedCustomer && <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-50' onClick={() => setSelectedCustomer(null)} /><div className='relative bg-white p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto text-gray-900'><button onClick={() => setSelectedCustomer(null)} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold'>×</button><h2 className='mb-4'>Customer Details</h2><div className='mb-6'><div className='mb-2'><strong>Name:</strong> {selectedCustomer.name || 'N/A'}</div><div className='mb-2'><strong>Email:</strong> {selectedCustomer.email}</div><div className='mb-2'><strong>Total Orders:</strong> {selectedCustomer.orderCount}</div><div className='mb-2'><strong>Lifetime Value:</strong> {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(selectedCustomer.totalSpent)}</div></div><h3 className='mb-3'>Order History</h3>{selectedCustomer.orders && selectedCustomer.orders.length > 0 ? <div className='mb-6 overflow-x-auto'><table className='w-full'><thead><tr><th className='p-2 text-left'>Order #</th><th className='p-2 text-left'>Date</th><th className='p-2 text-left'>Status</th><th className='p-2 text-left'>Total</th></tr></thead><tbody>{selectedCustomer.orders.map(order => <tr key={order.id} className='border-t-2 border-solid'><td className='p-2'>{order.order_number}</td><td className='p-2'>{new Date(order.order_date).toLocaleDateString()}</td><td className='p-2'>{order.status}</td><td className='p-2'>{new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(order.total)}</td></tr>)}</tbody></table></div> : <div className='mb-6 p-4'>No orders found</div>}<h3 className='mb-3'>Contact Messages</h3>{selectedCustomer.messages && selectedCustomer.messages.length > 0 ? <div className='overflow-x-auto'><table className='w-full'><thead><tr><th className='p-2 text-left'>Date</th><th className='p-2 text-left'>Subject</th><th className='p-2 text-left'>Status</th><th className='p-2 text-left'>Actions</th></tr></thead><tbody>{selectedCustomer.messages.map(message => <tr key={message.id} className='border-t-2 border-solid'><td className='p-2'>{new Date(message.submitted_date).toLocaleDateString()}</td><td className='p-2'>{message.subject}</td><td className='p-2'>{message.responded ? <span className='text-green-600'>Responded</span> : <span className='text-red-600'>Pending</span>}</td><td className='p-2'><button onClick={() => handleViewMessage(message.id)} className='p-3'>View</button></td></tr>)}</tbody></table></div> : <div className='p-4'>No contact messages found</div>}</div></div>}{selectedMessage && <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-50' onClick={() => setSelectedMessage(null)} /><div className='relative bg-white p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-gray-900'><button onClick={() => setSelectedMessage(null)} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold'>×</button><h2 className='mb-4'>Message Details</h2><div className='mb-4'><div className='mb-2'><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</div>{selectedMessage.phone && <div className='mb-2'><strong>Phone:</strong> {selectedMessage.phone}</div>}<div className='mb-2'><strong>Subject:</strong> {selectedMessage.subject}</div><div className='mb-2'><strong>Date:</strong> {new Date(selectedMessage.submitted_date).toLocaleString()}</div><div className='mb-4'><strong>Message:</strong><div className='mt-2 p-3 border-2 border-solid'>{selectedMessage.message}</div></div></div><div className='mb-4'><label className='flex items-center mb-3'><input type='checkbox' checked={responded} onChange={e => setResponded(e.target.checked)} className='m-2' />Mark as responded</label><div><strong>Response Notes:</strong><textarea value={responseNotes} onChange={e => setResponseNotes(e.target.value)} className='w-full p-3 m-2 border-2 border-solid' rows={4} placeholder='Enter response notes...' /></div></div><div className='flex gap-3 justify-end'><button onClick={() => setSelectedMessage(null)} className='p-3'>Cancel</button><button onClick={handleUpdateMessage} className='p-3'>Save</button></div></div></div>}</div>;
}