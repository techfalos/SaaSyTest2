'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
const SizeChartView = function SizeGuideComponent() {
  const [selectedSize, setSelectedSize] = useState('US');
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const sizingData = {
    'US': [{
      size: 'XS',
      bust: '32-34',
      waist: '24-26',
      hips: '34-36',
      length: '35'
    }, {
      size: 'S',
      bust: '34-36',
      waist: '26-28',
      hips: '36-38',
      length: '35.5'
    }, {
      size: 'M',
      bust: '36-38',
      waist: '28-30',
      hips: '38-40',
      length: '36'
    }, {
      size: 'L',
      bust: '38-40',
      waist: '30-32',
      hips: '40-42',
      length: '36.5'
    }, {
      size: 'XL',
      bust: '40-42',
      waist: '32-34',
      hips: '42-44',
      length: '37'
    }, {
      size: 'XXL',
      bust: '42-44',
      waist: '34-36',
      hips: '44-46',
      length: '37.5'
    }],
    'UK': [{
      size: '6',
      bust: '32-34',
      waist: '24-26',
      hips: '34-36',
      length: '35'
    }, {
      size: '8',
      bust: '34-36',
      waist: '26-28',
      hips: '36-38',
      length: '35.5'
    }, {
      size: '10',
      bust: '36-38',
      waist: '28-30',
      hips: '38-40',
      length: '36'
    }, {
      size: '12',
      bust: '38-40',
      waist: '30-32',
      hips: '40-42',
      length: '36.5'
    }, {
      size: '14',
      bust: '40-42',
      waist: '32-34',
      hips: '42-44',
      length: '37'
    }, {
      size: '16',
      bust: '42-44',
      waist: '34-36',
      hips: '44-46',
      length: '37.5'
    }],
    'EU': [{
      size: '34',
      bust: '32-34',
      waist: '24-26',
      hips: '34-36',
      length: '35'
    }, {
      size: '36',
      bust: '34-36',
      waist: '26-28',
      hips: '36-38',
      length: '35.5'
    }, {
      size: '38',
      bust: '36-38',
      waist: '28-30',
      hips: '38-40',
      length: '36'
    }, {
      size: '40',
      bust: '38-40',
      waist: '30-32',
      hips: '40-42',
      length: '36.5'
    }, {
      size: '42',
      bust: '40-42',
      waist: '32-34',
      hips: '42-44',
      length: '37'
    }, {
      size: '44',
      bust: '42-44',
      waist: '34-36',
      hips: '44-46',
      length: '37.5'
    }]
  };
  const measurementGuide = [{
    name: 'Bust',
    instruction: 'Measure around the fullest part of your bust, keeping the measuring tape horizontal.'
  }, {
    name: 'Waist',
    instruction: 'Measure around your natural waistline, typically the narrowest part of your torso.'
  }, {
    name: 'Hips',
    instruction: 'Measure around the fullest part of your hips, approximately 8-9 inches below your waist.'
  }, {
    name: 'Length',
    instruction: 'Measure from the shoulder seam down to your desired hemline length.'
  }];
  const handleSizeSystemChange = system => {
    setSelectedSize(system);
  };
  const handleMeasurementSelect = measurement => {
    setSelectedMeasurement(selectedMeasurement === measurement ? null : measurement);
  };
  return <div className='w-full h-full p-5 lg:p-8'><div key='header' className='flex flex-col items-center m-5'><h1 key='title' className='text-center m-5'>Size Guide & Measurements</h1><p key='subtitle' className='text-center m-3'>Find your perfect fit with our comprehensive sizing guide</p></div><div key='size-selector' className='flex flex-col lg:flex-row items-center justify-center m-5'><p key='selector-label' className='m-3'>Select Sizing System:</p><div key='size-buttons' className='flex flex-wrap justify-center'>{['US', 'UK', 'EU'].map(system => <button key={system} onClick={() => handleSizeSystemChange(system)} className={selectedSize === system ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3 m-2' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 m-2 hover:border-gray-400'} aria-pressed={selectedSize === system}>{system}</button>)}</div></div><div key='size-chart' className='w-full m-5'><h2 key='chart-title' className='text-center m-5'>Size Chart - ${selectedSize} Sizing</h2><div key='table-container' className='w-full flex justify-center'><table key='size-table' className='border border-gray-300 m-5'><thead key='table-head'><tr key='header-row'><th key='size-header' className='border border-gray-300 p-3'>Size</th><th key='bust-header' className='border border-gray-300 p-3'>Bust (inches)</th><th key='waist-header' className='border border-gray-300 p-3'>Waist (inches)</th><th key='hips-header' className='border border-gray-300 p-3'>Hips (inches)</th><th key='length-header' className='border border-gray-300 p-3'>Length (inches)</th></tr></thead><tbody key='table-body'>{sizingData[selectedSize].map((row, index) => <tr key={`row-${index}`}><td key={`size-${index}`} className='border border-gray-300 p-3 text-center font-bold'>{row.size}</td><td key={`bust-${index}`} className='border border-gray-300 p-3 text-center'>{row.bust}</td><td key={`waist-${index}`} className='border border-gray-300 p-3 text-center'>{row.waist}</td><td key={`hips-${index}`} className='border border-gray-300 p-3 text-center'>{row.hips}</td><td key={`length-${index}`} className='border border-gray-300 p-3 text-center'>{row.length}</td></tr>)}</tbody></table></div></div><div key='measurement-guide' className='w-full m-5'><h2 key='guide-title' className='text-center m-5'>How to Measure</h2><div key='guide-grid' className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 m-5'>{measurementGuide.map((guide, index) => <div key={`guide-${index}`} className='border border-gray-300 p-5 w-full'><button key={`guide-button-${index}`} onClick={() => handleMeasurementSelect(guide.name)} className={selectedMeasurement === guide.name ? 'border-2 border-blue-500 !text-black !bg-blue-100 p-3 w-full' : 'border !text-gray-800 border-gray-300 !bg-transparent p-3 w-full hover:border-gray-400'} aria-pressed={selectedMeasurement === guide.name}></button>{selectedMeasurement === guide.name && <p key={`instruction-${index}`} className='text-center m-3'></p>}</div>)}</div></div><div key='tips' className='w-full m-5'><h3 key='tips-title' className='text-center m-5'>Fitting Tips</h3><div key='tips-content' className='flex flex-col items-center'><p key='tip1' className='m-3 text-center'>Use a flexible measuring tape for the most accurate measurements.</p><p key='tip2' className='m-3 text-center'>Measure over your undergarments, but not over thick clothing.</p><p key='tip3' className='m-3 text-center'>If you are between sizes, we recommend choosing the larger size for comfort.</p><p key='tip4' className='m-3 text-center'>All measurements are approximate and may vary by style and cut.</p></div></div></div>;
};
SizeChartView.displayName = 'SizeChartView';
export default SizeChartView;