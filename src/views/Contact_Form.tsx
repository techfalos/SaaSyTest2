'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const ContactFormView = function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    contactMethod: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const inquiryTypes = ['Sound Healing Sessions', 'Practitioner Training', 'Group Workshops', 'Corporate Wellness Programs', 'General Information', 'Partnership Opportunities'];
  const contactMethods = ['Email', 'Phone', 'Text Message'];
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.inquiryType) {
      newErrors.inquiryType = 'Please select an inquiry type';
    }
    if (!formData.contactMethod) {
      newErrors.contactMethod = 'Please select a preferred contact method';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  const handleSubmit = () => {
    if (validateForm()) {
      setModalMessage("Thank you for your message! We will get back to you within 24 hours.");
      setShowModal(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: '',
        contactMethod: '',
        message: ''
      });
    }
  };
  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
  };
  return <div className='w-full h-full flex flex-col p-5 lg:p-8'><div className='mb-8'><h1 className='mb-4'>Contact Information</h1><p>{window.processText('contact_subtitle', 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.')}</p></div><div className='flex-1 flex flex-col lg:flex-row gap-8'><div className='flex-1'><div className='flex flex-col lg:flex-row gap-5 mb-8'><div className='flex-1 m-5'><label className='block mb-2'>Name</label><input type='text' className='w-full border border-gray-300 p-3' value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder='Your full name' />{errors.name && <p className='text-red-600 text-sm mt-1'>{errors.name}</p>}</div><div className='flex-1 m-5'><label className='block mb-2'>Email</label><input type='email' className='w-full border border-gray-300 p-3' value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder='your.email@example.com' />{errors.email && <p className='text-red-600 text-sm mt-1'>{errors.email}</p>}</div></div><div className='mb-8 m-5'><label className='block mb-2'>Phone</label><input type='tel' className='w-full border border-gray-300 p-3' value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder='(555) 123-4567' />{errors.phone && <p className='text-red-600 text-sm mt-1'>{errors.phone}</p>}</div><div className='flex flex-col lg:flex-row gap-5'><div className='flex-1 m-5'><label className='block mb-2'>Inquiry Type</label><select className='w-full border border-gray-300 p-3' value={formData.inquiryType} onChange={e => handleInputChange('inquiryType', e.target.value)}><option value=''>Select an inquiry type</option>{inquiryTypes.map((type, index) => <option key={index} value={type}>{type}</option>)}</select>{errors.inquiryType && <p className='text-red-600 text-sm mt-1'>{errors.inquiryType}</p>}</div><div className='flex-1 m-5'><label className='block mb-2'>Preferred Contact Method</label><select className='w-full border border-gray-300 p-3' value={formData.contactMethod} onChange={e => handleInputChange('contactMethod', e.target.value)}><option value=''>Select contact method</option>{contactMethods.map((method, index) => <option key={index} value={method}>{method}</option>)}</select>{errors.contactMethod && <p className='text-red-600 text-sm mt-1'>{errors.contactMethod}</p>}</div></div></div><div className='flex-1 flex flex-col'><div className='flex-1 m-5'><label className='block mb-2'>Message</label><textarea className='w-full h-full border border-gray-300 p-3 resize-none' value={formData.message} onChange={e => handleInputChange('message', e.target.value)} placeholder='Please tell us about your interest in our sound healing services...' />{errors.message && <p className='text-red-600 text-sm mt-1'>{errors.message}</p>}</div><div className='m-5'><button onClick={handleSubmit} className='w-full border !text-gray-800 border-gray-300 !bg-transparent p-4 font-semibold'>Send Message</button></div></div></div>{showModal && <div className='fixed inset-0 flex items-center justify-center z-[1000]' style={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }}><div className='max-w-md w-full p-8 m-4' style={{
        backgroundColor: 'white'
      }}><h3 className='mb-4'>Message Sent!</h3><p className='mb-6'>{modalMessage}</p><button onClick={closeModal} className='w-full border !text-gray-800 border-gray-300 !bg-transparent p-3'>Close</button></div></div>}</div>;
};
ContactFormView.displayName = 'ContactFormView';
export default ContactFormView;