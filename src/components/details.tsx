/* 
SysArchitect Components v1.0.0
SysArchitect components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import { makeDisplay } from '@/app/util';
import { useState, useEffect } from 'react';

interface DetailsProps {
  modelName: string;
  id: string;
}

export default function Details({ modelName, id }: DetailsProps) {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('uuids', id);
        const response = await fetch(`/api/${modelName}?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const jsonData = await response.json();
        setData(jsonData[0]); // Get first item since we're fetching a single record
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [modelName, id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <svg className="animate-spin h-8 w-8 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <div className="w-full mt-2">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Details</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl className="grid grid-cols-2 gap-4 pt-4 pb-4">
            {Object.entries(data).map(([key, value]) => {
              // Skip UUID fields
            
              if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i.test(value)) {
                return null;
              }
            
              return (
                <div key={key} className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-bold text-gray-500">
                    {makeDisplay(key.replace(/[^a-zA-Z0-9_\s]/g, '').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))}:
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {String(value)}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </div>
  );
}
