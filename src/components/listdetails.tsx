'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { FiEdit, FiPlus } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi';

interface ModelField {
  name: string;
  datatype: string;
  datatypesize: string;
  default: string | null;
  untouchable: boolean;
  required: string;
  is_searchable: string;
  is_name: string;
  key: string;
  children: any[];
}

interface ListDetailsProps {
  modelName: string;
  showAdminFeatures?: boolean;
  fields: ModelField[];
  subFieldName?: string;
  subFieldValue?: string;
}

export default function ListDetails({ modelName, showAdminFeatures = false, fields, subFieldName, subFieldValue }: ListDetailsProps) {
  const [data, setData] = useState<Array<{ID: string, [key: string]: any}>>([]);
  const [isLoading, setIsLoading] = useState(true);
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

      if (skipCount === 0) {
        setData(Array.isArray(jsonData) ? jsonData : []);
      } else {
        setData(prev => [...prev, ...(Array.isArray(jsonData) ? jsonData : [])]);
      }
      
      setHasMore(Array.isArray(jsonData) && jsonData.length === ITEMS_PER_PAGE);
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
  }, [modelName, fields]);

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
        setData(data.filter(item => item.ID !== id));
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
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
    <div className="w-full mt-2 space-y-6">
      {Array.isArray(data) && data.map((item, index) => (
        <div key={item.ID} ref={index === data.length - 1 ? lastElementRef : null}>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {fields.map((field) => {
              // Skip UUID fields
              if (field.datatype.toUpperCase() === 'UUID') return null;
              return (
                <div key={field.name} className="mb-4">
                  <div className="mt-1 text-gray-900">{item[field.name]}</div>
                </div>
              );
            })}
            {showAdminFeatures && (
              <div className="mt-6 flex space-x-4">
                <Link
                  href={`/${modelName.toLowerCase()}_add`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <FiPlus className="w-5 h-5" />
                </Link>
                <Link
                  href={`/${modelName.toLowerCase()}_edit/${item.ID}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <FiEdit className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDelete(item.ID)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          {index < data.length - 1 && <hr className="my-6 border-gray-200" />}
        </div>
      ))}
      {isLoading && data.length > 0 && (
        <div className="p-4 text-center">Loading more...</div>
      )}
    </div>
  );
}
