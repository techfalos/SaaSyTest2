/* 
SysArchitect Components v1.0.0
SysArchitect components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { makeDisplay } from '@/app/util';

interface SearchProps {
  modelName: string;
  nameField?: string;
}

export default function Search({ modelName, nameField = 'name' }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ID: string, [key: string]: any}>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add click outside listener to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchData = async () => {
      if (!query) {
        setResults([]);
        return;
      }
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('uuids', '');
        queryParams.append('search', query);
       
        const response = await fetch(`/api/${modelName}?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error('Error searching:', error);
      }
    };

    // Debounce search requests
    const timeoutId = setTimeout(searchData, 300);
    return () => clearTimeout(timeoutId);
  }, [query, modelName]);

  return (
    <div className="relative mt-2" ref={dropdownRef}>
      <input
        type="text"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={`Search ${makeDisplay(modelName.replace(/[^a-zA-Z0-9]/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))}...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {isOpen && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {results.map((result) => (
            <Link
              key={result.ID}
              href={`${modelName.toLowerCase()}_details/${result.ID}`}
              className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
            >
              {result[nameField]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
