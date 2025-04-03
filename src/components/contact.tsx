/* 
SysArchitect Components v1.0.0
SysArchitect components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface ContactProps {
  useRecaptcha?: boolean;
  companyName: string;
  companyWebsite: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyZip: string;
  companyCountry: string;
}

export default function Contact({ 
  useRecaptcha = true,
  companyName,
  companyWebsite,
  companyEmail,
  companyPhone,
  companyAddress,
  companyCity,
  companyState,
  companyZip,
  companyCountry
}: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (useRecaptcha) {
      // Load reCAPTCHA script
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [useRecaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      let token = null;
      if (useRecaptcha) {
        // Execute reCAPTCHA
        token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
          action: 'contact_form'
        });
      }
      // Send form data and recaptcha token to API endpoint
      const response = await fetch('/api/Contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          name: formData.name,
          email: formData.email, 
          message: formData.message
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to submit contact form');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
  
    <div className="max-w-7xl mt-10 mx-auto">
        <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Send Us a Message</h1>
        <p className="text-lg">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 xxl:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
                </label>
                <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
                </label>
                <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
                </label>
                <textarea
                name="message"
                id="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 classButtonRounding classButtonBackground classButtonFontType classButtonFontSize"
                >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
            </div>
å
            {status === 'success' && (
                <p className="text-green-600 text-center">Message sent successfully!</p>
            )}
            {status === 'error' && (
                <p className="text-red-600 text-center">Error sending message. Please try again.</p>
            )}
            </form>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Company Information</h2>
            <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900">{companyName}</h3>
                <p className="mt-2 text-gray-600">
                {companyAddress}<br />
                {companyCity}, {companyState} {companyZip}<br />
                {companyCountry}
                </p>
            </div>
            <div>
                <h3 className="text-lg font-medium text-gray-900">Contact</h3>
                <p className="mt-2 text-gray-600">
                Email: {companyEmail}<br />
                Phone: {companyPhone}<br />
                Website: <a href={companyWebsite} className="text-blue-600 hover:text-blue-800">{companyWebsite}</a>
                </p>
            </div>
            </div>
        </div>
        </div>
    </div>
      
  );
}
