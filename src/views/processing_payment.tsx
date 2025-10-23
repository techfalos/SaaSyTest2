'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const paymentStatus = urlParams.get('status');
    const paymentMessage = urlParams.get('message');
    if (paymentStatus === 'success') {
      setTimeout(() => {
        setStatus('success');
        setMessage(paymentMessage || "Payment processed successfully");
        setTimeout(() => {
          router.push('/confirmed');
        }, 2000);
      }, 1500);
    } else if (paymentStatus === 'failed' || paymentStatus === 'error') {
      setTimeout(() => {
        setStatus('error');
        setMessage(paymentMessage || "Payment processing failed. Please try again.");
      }, 1500);
    } else {
      setTimeout(() => {
        setStatus('success');
        setMessage("Payment processed successfully");
        setTimeout(() => {
          router.push('/confirmed');
        }, 2000);
      }, 1500);
    }
  }, []);
  return <div className='w-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12'><div className='w-full max-w-md text-center'>{status === 'processing' && <div className='flex flex-col items-center gap-6'><div className='w-16 h-16 border-4 border-gray-300'><div className='w-full h-full border-t-4 border-gray-900' style={{
            animation: 'spin 1s linear infinite'
          }} /></div><h1>Processing Payment</h1><p>Please wait while we process your payment...</p></div>}{status === 'success' && <div className='flex flex-col items-center gap-6'><div className='w-16 h-16 flex items-center justify-center'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-full h-full'><path d='M20 6L9 17l-5-5' /></svg></div><h1>Payment Successful</h1><p>{message}</p><p>Redirecting to order confirmation...</p></div>}{status === 'error' && <div className='flex flex-col items-center gap-6'><div className='w-16 h-16 flex items-center justify-center'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-full h-full'><circle cx='12' cy='12' r='10' /><line x1='15' y1='9' x2='9' y2='15' /><line x1='9' y1='9' x2='15' y2='15' /></svg></div><h1>Payment Failed</h1><p>{message}</p><button onClick={() => router.push('/checkout')} className='p-3 m-5'>Return to Checkout</button></div>}</div><style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style></div>;
}