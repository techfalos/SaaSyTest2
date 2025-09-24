
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// Icon definitions as inline SVG strings
const ICON_SVGS: { [key: string]: string } = {
  'shopping-cart': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  'search': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  'user': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  'bell': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  'settings': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m4.22-13.22 4.24 4.24M1.54 1.54l4.24 4.24M20.46 20.46l-4.24-4.24M1.54 20.46l4.24-4.24"/></svg>',
  'home': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  'menu': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  'heart': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  'mail': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  'phone': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  'help': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  'info': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  'star': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  'bookmark': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
  'download': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  'upload': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  'share': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
  'logout': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  'calendar': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  'chart': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>'
};

interface IconItem {
  icon: string;
  text: string;
  pageId: string;
}

export default function GeneratedHeaderIconBarLoggedInView() {
  const router = useRouter();
  const customViewDescription = "[{\"icon\":\"mail\",\"text\":\"Contact\",\"pageId\":\"contact\"}]";
  const align = 'Right';
  
  let items: IconItem[] = [];

  try {
    const parsed = customViewDescription ? JSON.parse(customViewDescription) : [];
    items = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    // Error parsing icon bar data - no MCP logging in client component
    items = [];
  }

  if (items.length === 0) {
    return (
      <div>
       &nbsp;
      </div>
    );
  }

  const alignmentClasses = {
    'Left': 'justify-start',
    'Center': 'justify-center',
    'Right': 'justify-end'
  };

  const handleClick = (pageId: string) => {
    if (!pageId) return;
    
    // Find the page using the pageId and navigate to it
    const pages = [{"id":"3d4050bd-9cc8-404f-8eb0-e0ec33278c74","name":"Dashboard"},{"id":"eb594b19-ebe5-4bd8-9795-eb62f3de58b7","name":"Admin Dashboard"},{"id":"home","name":"Home"},{"id":"services","name":"Services"},{"id":"service_detail","name":"Service Detail"},{"id":"booking","name":"Book Session"},{"id":"about","name":"About"},{"id":"practitioners","name":"Our Practitioners"},{"id":"practitioner_detail","name":"Practitioner Profile"},{"id":"sound_library","name":"Sound Library"},{"id":"wellness_resources","name":"Wellness Resources"},{"id":"testimonials","name":"Testimonials"},{"id":"contact","name":"Contact"},{"id":"my_sessions","name":"My Sessions"},{"id":"wellness_journal","name":"Wellness Journal"},{"id":"admin_sessions","name":"Session Management"},{"id":"admin_practitioners","name":"Practitioner Management"},{"id":"admin_content","name":"Content Management"},{"id":"b5ddfbf3-d05f-4ba6-826f-cda452a3bc27","name":"Terms of Service"},{"id":"0f7a704e-3408-42b8-97fa-ee84d2c402bc","name":"Privacy Policy"},{"id":"d0467735-83eb-4e1f-9853-c431fda1390c","name":"Login"}];
    const page = pages.find(p => p.id === pageId);
    if (page) {
      // Use page name for URL, replace non-alphanumeric with underscore
      let folderName = page.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
      
      // Replace multiple consecutive underscores with a single underscore
      folderName = folderName.replace(/_+/g, '_');
      
      // Remove leading and trailing underscores
      folderName = folderName.replace(/^_+|_+$/g, '');
      
      // If folder name is empty or starts with underscore after trimming, prefix with 'p'
      if (!folderName || folderName.startsWith('_')) {
        folderName = 'p' + folderName;
      }
      
      router.push('/' + folderName);
    }
  };

  return (
    <>
      <div className={`hidden md:flex gap-4 p-2 ${alignmentClasses[align as keyof typeof alignmentClasses]}`}>
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => handleClick(item.pageId)}
            disabled={!item.pageId}
            className="!bg-transparent flex-shrink-0 flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              height: '40px',
              width: '40px'
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6"
              dangerouslySetInnerHTML={{ __html: ICON_SVGS[item.icon] || ICON_SVGS['bell'] }}
            />
          </button>
        ))}
      </div>
    </>
  );
}