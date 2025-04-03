/* 
SysArchitect Components v1.0.0
SysArchitect components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import { useState } from 'react';


export interface UserTier {
  name: string;
  paid: boolean;
  description: string;
  monthly_price: number;
  yearly_price: number;
}

interface PricingProps {
  tiers: UserTier[];
}

export default function Pricing({ tiers }: PricingProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const handleTierSelect = async (tier: UserTier) => {
    try {
      const response = await fetch('/api/Pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: tier.name,
          subscriptionType: billingPeriod
        }),
      });

      if (response.status === 403) {
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to process tier selection');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error selecting tier:', error);
    }
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for you
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-x-4 rounded-full p-1 bg-gray-100">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`${
                billingPeriod === 'monthly' ? 'bg-white shadow-sm' : ''
              } rounded-full px-4 py-2 text-sm font-semibold`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`${
                billingPeriod === 'annual' ? 'bg-white shadow-sm' : ''
              } rounded-full px-4 py-2 text-sm font-semibold`}
            >
              Annual billing
            </button>
          </div>
        </div>

        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-8 ring-1 ring-gray-200 ${
                index === 2 ? 'bg-gray-900 ring-gray-900' : 'bg-white'
              }`}
            >
              <h3 
                className={`text-lg font-semibold leading-8 ${
                  index === 2 ? 'text-white' : 'text-gray-900'
                }`}
              >
                {tier.name}
              </h3>
              
              <p className={`mt-4 text-sm leading-6 ${
                index === 2 ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {tier.description}
              </p>
              
              <p className={`mt-6 flex items-baseline gap-x-1 ${
                index === 2 ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="text-4xl font-bold">
                  {tier.paid ? 
                    billingPeriod === 'monthly' ? 
                      `$${tier.monthly_price}/mo` : 
                      `$${tier.yearly_price}/yr` 
                    : 'Free'}
                </span>
              </p>
              {tier.paid && (
                <button
                  onClick={() => handleTierSelect(tier)}
                  className={`mt-6 w-full rounded-md px-3 py-2 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    index === 2 
                      ? 'bg-white text-gray-900 hover:bg-gray-100 focus-visible:outline-white' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                  }`}
                >
                  Get started
                </button>
              )}

            
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
