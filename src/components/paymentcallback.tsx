/* 
SysArchitect Components v1.0.0
SysArchitect components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SubscriptionContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const searchParams = useSearchParams();

  useEffect(() => {
    const completeSubscription = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
          setStatus('error');
          return;
        }

        const response = await fetch(`/api/Pricing?session_id=${sessionId}`);
        const data = await response.json();

        if (data.success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error completing subscription:', error);
        setStatus('error');
      }
    };

    completeSubscription();
  }, [searchParams]);

  return (
    <div className="text-center">
      {status === 'loading' && <p>Processing your subscription...</p>}
      {status === 'success' && (
        <div>
          <h1 className="text-2xl font-bold text-green-800 mb-4">Your subscription is complete!</h1>
          <Link
            href="/dashboard" 
            className="text-[#516ab8] hover:text-blue-800 underline"
          >
            Return to Dashboard
          </Link>
        </div>
      )}
      {status === 'error' && (
        <div>
          <p className="text-xl text-red-600 mb-4">Something went wrong</p>
          <Link 
            href="/contact"
            className="text-[#516ab8] hover:text-blue-800 underline"
          >
            Contact Support
          </Link>
        </div>
      )}
    </div>
  );
}

export default function DoSub() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <Suspense fallback={<p>Loading...</p>}>
          <SubscriptionContent />
        </Suspense>
      </div>
    </div>
  );
}
