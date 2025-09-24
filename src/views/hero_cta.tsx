'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import RCTA from '../components/cta';

export default function GeneratedHeroCtaView() {
  const router = useRouter();
  const customViewDescription = "{\"headline\":\"Heal Through the Power of Sound\",\"subheader\":\"Experience transformative wellness through ancient sound vibration therapy and modern healing techniques\",\"subsubheader\":\"\",\"buttons\":[{\"buttonTitle\":\"Explore Healing Sessions\",\"page\":\"services\"}],\"headlineStyle\":{\"fontFamily\":\"Roboto\",\"color\":\"#333333\",\"fontSize\":\"text-3xl\"},\"subheaderStyle\":{\"fontFamily\":\"Roboto\",\"color\":\"#333333\",\"fontSize\":\"\"},\"subsubheaderStyle\":{\"fontFamily\":\"Open Sans\",\"color\":\"#333333\",\"fontSize\":\"\"},\"buttonStyle\":{\"fontFamily\":\"Open Sans\",\"color\":\"#ffffff\",\"fontSize\":\"\"}}";
  
  const handleNavigate = (pageId: string) => {
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
      
      // If empty or just 'home', use root
      if (!folderName || folderName === 'home') {
        router.push('/');
      } else {
        router.push('/' + folderName);
      }
    }
  };
  
  return <RCTA custom_view_description={customViewDescription} onNavigate={handleNavigate} isPaigeLoading={false} />;
}