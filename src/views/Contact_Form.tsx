'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const ContactFormView = function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(true);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
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
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contactsubmit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.status === 401) {
        setIsAuthorized(false);
        setIsSubmitting(false);
        return;
      }
      const result = await response.json();
      if (result.success) {
        setConfirmationMessage(result.message || "Thank you for your message! We'll get back to you soon.");
        setShowConfirmation(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setErrors({
          submit: result.message || "There was an error sending your message. Please try again."
        });
      }
    } catch (error) {
      setErrors({
        submit: "Network error. Please try again."
      });
    }
    setIsSubmitting(false);
  };
  const closeConfirmation = () => {
    setShowConfirmation(false);
    setConfirmationMessage('');
  };
  if (!isAuthorized) {
    return <div className='w-full h-full flex items-center justify-center p-5'><p className='text-center'>Please log in to view featured dresses</p></div>;
  }
  return <div className='w-full h-full flex flex-col p-5'><div className='flex-1 flex flex-col max-w-4xl mx-auto w-full'><div className='mb-8 text-center'><h1>Contact Us</h1><p className='mt-4'>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p></div><div className='flex-1 flex flex-col'><div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'><div className='m-5'><label className='block mb-2 font-medium'>Name</label><input type='text' value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} `} placeholder='Your full name' />{errors.name && <p className='text-red-600 text-sm mt-1'>{errors.name}</p>}</div><div className='m-5'><label className='block mb-2 font-medium'>Email</label><input type='email' value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} `} placeholder='your.email@example.com' />{errors.email && <p className='text-red-600 text-sm mt-1'>{errors.email}</p>}</div></div><div className='m-5'><label className='block mb-2 font-medium'>Subject</label><input type='text' value={formData.subject} onChange={e => handleInputChange('subject', e.target.value)} className={`w-full p-3 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} `} placeholder='What is your message about?' />{errors.subject && <p className='text-red-600 text-sm mt-1'>{errors.subject}</p>}</div><div className='m-5 flex-1'><label className='block mb-2 font-medium'>Message</label><textarea value={formData.message} onChange={e => handleInputChange('message', e.target.value)} rows={8} className={`w-full p-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} resize-none h-full min-h-32`} placeholder='Please share your questions, comments, or feedback...' />{errors.message && <p className='text-red-600 text-sm mt-1'>{errors.message}</p>}</div><div className='m-5'>{errors.submit && <p className='text-red-600 text-sm mb-3'>{errors.submit}</p>}<button onClick={handleSubmit} disabled={isSubmitting} className='w-full p-4 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'>{isSubmitting ? "Sending..." : "Send Message"}</button></div></div></div>{showConfirmation && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-5 z-50'><div className='bg-white p-8 max-w-md w-full text-center'><h2 className='text-xl font-bold mb-4'>Items Added to Cart</h2><p className='mb-6'>{confirmationMessage}</p><button onClick={closeConfirmation} className='border !text-gray-800 border-gray-300 !bg-transparent p-3'>Close</button></div></div>}</div>;
};
ContactFormView.displayName = 'ContactFormView';
export default ContactFormView;