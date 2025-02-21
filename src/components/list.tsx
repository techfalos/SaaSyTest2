/* 
SysArchitect Components v1.0.0
SysArchitect components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { makeDisplay } from '@/app/util';
import { FiEdit } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { FiPlus } from 'react-icons/fi';

interface ListProps {
  modelName: string;
  showAdminFeatures?: boolean;
  nameField?: string;
  subFieldName?: string;
  subFieldValue?: string;
}

export default function List({ modelName, showAdminFeatures = false, nameField = 'name', subFieldName, subFieldValue }: ListProps) {
  const [data, setData] = useState<Array<{ID: string, [key: string]: any}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const ITEMS_PER_PAGE = 30;

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setSkip(prevSkip => prevSkip + ITEMS_PER_PAGE);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const fetchData = async (skipCount: number) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('uuids', '');
      queryParams.append('limit', ITEMS_PER_PAGE.toString());
      queryParams.append('skip', skipCount.toString());
      if (subFieldName && subFieldValue) {
        queryParams.append('subname', subFieldName);
        queryParams.append('subvalue', subFieldValue);
      }
      const response = await fetch(`/api/${modelName}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const jsonData = await response.json();
      
      // Ensure jsonData is an array before sorting
      const dataArray = Array.isArray(jsonData) ? jsonData : [];
      
      // Sort data
      const sortedData = dataArray.sort((a, b) => {
        const aValue = String(a[nameField]).toLowerCase();
        const bValue = String(b[nameField]).toLowerCase();
        return sortDirection === 'asc' ? 
          aValue.localeCompare(bValue) : 
          bValue.localeCompare(aValue);
      });

      if (skipCount === 0) {
        setData(sortedData);
      } else {
        setData(prev => [...prev, ...sortedData]);
      }
      
      setHasMore(dataArray.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setData([]);
    setSkip(0);
    setHasMore(true);
    fetchData(0);
  }, [modelName, nameField]);

  useEffect(() => {
    if (skip > 0) {
      fetchData(skip);
    }
  }, [skip]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Warning: This deletion is irreversible. Do you want to proceed?')) {
      try {
        await fetch(`/api/${modelName}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uuids: [id] })
        });
        // Remove deleted item from state
        setData(data.filter(item => item.ID !== id));
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleSort = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setData([]);
    setSkip(0);
    setHasMore(true);
    fetchData(0);
  };

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

  return (
    <div className="w-full mt-2">
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          {showAdminFeatures ? (
            <div className="bg-gray-100 grid grid-cols-[1fr,auto,auto] gap-4 p-4">
              <div 
                className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center cursor-pointer"
                onClick={handleSort}
              >
                {makeDisplay(nameField)}
                <span className="ml-2">
                  {sortDirection === 'asc' ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                </span>
              </div>
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Link
                  href={`/${modelName.toLowerCase()}_add`}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiPlus className="w-4 h-4 mr-1" />
                  Add New
                </Link>
              </div>
            </div>
          ) : null}

          {/* List Items */}
          <div className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <div 
                key={item.ID} 
                ref={index === data.length - 1 ? lastElementRef : null}
                className="grid grid-cols-[1fr,auto,auto] gap-4 p-4 items-center"
              >
                <div className="whitespace-nowrap">
                  <Link 
                    href={`/${modelName.toLowerCase()}_details/${item.ID}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {item[nameField]}
                  </Link>
                </div>
                {showAdminFeatures && (
                  <>
                    <div className="whitespace-nowrap">
                      <Link
                        href={`/${modelName.toLowerCase()}_edit/${item.ID}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FiEdit className="w-5 h-5" />
                      </Link>
                    </div>
                    <div className="whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(item.ID)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {isLoading && data.length > 0 && (
              <div className="p-4 text-center">Loading more...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
