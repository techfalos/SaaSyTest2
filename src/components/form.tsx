/* 
SysArchitect Components v1.0.0
SysArchitect components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import { useState, useEffect } from 'react';
import { makeDisplay } from '@/app/util';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';


interface ModelField {
  name: string;
  datatype: string;
  datatypesize: string | null;
  children: ModelField[];
  default: any;
  untouchable: boolean;
  required: string;
  is_name: string;
  is_searchable: string | boolean;
  key: string | null;
}

interface FormProps {
  modelName: string;
  fields: ModelField[];
  mode: 'add' | 'edit';
  id?: string;
}

function validate(fields: ModelField[], data: Record<string, any>): string[] {
  const errors: string[] = [];

  fields.forEach(field => {
    // Skip validation if field is not required and value is empty/undefined
    if (!field.required && (typeof data[field.name] === 'undefined' || data[field.name] === null)) {
      return;
    }

    switch (field.datatype.toUpperCase()) {
      case 'UUID':
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data[field.name])) {
          errors.push(`${field.name} must be a valid UUID`);
        }
        break;

      case 'TINYINT':
      case 'SMALLINT':
      case 'BIGINT':
      case 'INT128':
        if (!Number.isInteger(data[field.name])) {
          errors.push(`${field.name} must be an integer`);
        }
        break;

      case 'VARCHAR':
        if (typeof data[field.name] !== 'string') {
          errors.push(`${field.name} must be a string`);
        }
        if (data[field.name].trim().length === 0) {
          errors.push(`${field.name} is required`);
        }
        if (field.datatypesize && data[field.name].length > field.datatypesize) {
          errors.push(`${field.name} exceeds maximum length of ${field.datatypesize}`);
        }
        break;

      case 'TEXT':
        if (typeof data[field.name] !== 'string') {
          errors.push(`${field.name} must be a string`);
        }
        break;

      case 'BINARY':
        if (!(data[field.name] instanceof Buffer || typeof data[field.name] === 'string')) {
          errors.push(`${field.name} must be binary data`);
        }
        break;

      case 'DATE':
        if (isNaN(Date.parse(data[field.name]))) {
          errors.push(`${field.name} must be a valid date`);
        }
        break;

      case 'TIME':
        if (!/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(data[field.name])) {
          errors.push(`${field.name} must be a valid time in format HH:MM:SS`);
        }
        break;

      case 'DATETIME':
        if (isNaN(Date.parse(data[field.name]))) {
          errors.push(`${field.name} must be a valid datetime`);
        }
        break;

      case 'DOUBLE':
      case 'FLOAT':
        if (typeof data[field.name] !== 'number') {
          errors.push(`${field.name} must be a number`);
        }
        break;
    }
  });

  return errors;
}

function toLocalISOString(date: Date) {
  const pad = (num: number) => String(num).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are zero-based
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}


export default function Form({ modelName, fields, mode, id }: FormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [dropdownOptions, setDropdownOptions] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Fetch initial data for edit mode and populate dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for foreign key dropdowns
        const foreignFields = fields.filter(field => field.key === 'foreign' && field.name !== 'UserID');
        const dropdownPromises = foreignFields.map(async field => {
          const foreignModel = field.name.replace(/ID$/, '');
          const response = await fetch(`/api/${foreignModel}?uuids=`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          const data = await response.json();
          
          // Find first text field in result set
          const processedData = data.map((item: any) => {
            // Find first VARCHAR or TEXT field
            let displayText = '';
            for (const [key, value] of Object.entries(item)) {
              if (typeof value === 'string' && key !== 'ID') {
                displayText = value;
                break;
              }
            }
            return {
              ...item,
              displayText
            };
          });
          
          return { [field.name]: processedData };
        });

        const dropdownResults = await Promise.all(dropdownPromises);
        const combinedDropdowns = dropdownResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setDropdownOptions(combinedDropdowns);

        // If edit mode, fetch existing data
        if (mode === 'edit' && id) {
          const response = await fetch(`/api/${modelName}?uuids=${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          
          const data = await response.json();
          if (data && data.length > 0) {
            // Format date fields before setting form data
            const formattedData = { ...data[0] };
            fields.forEach(field => {
              if ((field.datatype === 'DATE' || field.datatype === 'DATETIME') && formattedData[field.name]) {
                const date = new Date(formattedData[field.name]+"Z");
                formattedData[field.name] = toLocalISOString(date);
    
              }
            });
            setFormData(formattedData);
            console.log(formData);
          } else {
            setError('Record not found');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load form data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [modelName, fields, mode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (mode === 'edit' && id) {
      formData.ID = id;
    }
    if (mode === 'add') {
      formData.ID = uuidv4();   
    }

    // Convert local time back to UTC for submission
    const submitData = { ...formData };
    fields.forEach(field => {
      if ((field.datatype === 'DATE' || field.datatype === 'DATETIME') && submitData[field.name]) {
        const localDate = new Date(submitData[field.name]);
        submitData[field.name] = localDate.toISOString();
      }
    });

    const errors = validate(fields, submitData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);

    try {
      const response = await fetch(`/api/${modelName}`, {
        method: mode === 'add' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.errors) {
          setValidationErrors(data.errors);
        } else {
          setError('Failed to submit form');
        }
        return;
      }

      // Redirect or show success message
      router.back();
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit form');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
    <form onSubmit={handleSubmit} className="space-y-6 mt-2 w-[300px] md:w-[600px] lg:w-[800px] mx-auto">
      <h1 className="text-2xl font-bold mt-6 text-center">{mode === 'add' ? 'Add' : 'Edit'} {makeDisplay(modelName.replace(/[^a-zA-Z0-9_\s]/g, '').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))}</h1>
      
      {(validationErrors.length > 0 || error) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <ul className="list-disc list-inside">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
            {error && <li>{error}</li>}
          </ul>
        </div>
      )}

      {fields
        .filter(field => field.name !== 'ID' && field.name !== 'UserID') // Exclude ID and UserID fields
        .map(field => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm text-gray-700 font-medium">
              {makeDisplay(field.name.replace(/[^a-zA-Z0-9_\s]/g, '').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/ID$/, ''))}
              {field.required.toString() === "true" && <span className="text-red-500">*</span>}
            </label>
            
            {field.key === 'foreign' ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                required={field.required.toString() === "true"}
                className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select {makeDisplay(field.name.replace(/[^a-zA-Z0-9_\s]/g, '').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/ID$/, ''))}</option>
                {dropdownOptions[field.name]?.map(option => (
                  <option key={option.ID} value={option.ID}>
                    {option.displayText}
                  </option>
                ))}
              </select>
            ) : field.datatype === 'TEXT' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                required={field.required.toString() === "true"}
                rows={4}
                className="mt-1 block w-full rounded-md border-2 shadow-sm classInputBackground classInputRounding classInputFontColor classInputFontSize"
              />
            ) : (
              <input
                type={getInputType(field.datatype)}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                required={field.required.toString() === "true"}
                maxLength={field.datatypesize ? parseInt(field.datatypesize) : undefined}
                className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm classInputBackground classInputRounding classInputFontColor classInputFontSize"
              />
            )}
          </div>
        ))}

      <div className="flex justify-end">
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 classButtonRounding classButtonBackground classButtonFontType classButtonFontColor classButtonFontSize"
          >
          {mode === 'add' ? 'Create' : 'Update'}
        </button>
      </div>
    </form>
  );
}

function getInputType(datatype: string): string {
  switch (datatype.toUpperCase()) {
    case 'INT':
    case 'TINYINT':
    case 'SMALLINT':
    case 'BIGINT':
    case 'INT128':
      return 'number';
    case 'DATE':
      return 'date';
    case 'TIME':
      return 'time';
    case 'DATETIME':
      return 'datetime-local';
    default:
      return 'text';
  }
}
