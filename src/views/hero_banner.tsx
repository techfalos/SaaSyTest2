'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import RCTA from '../components/cta';

export default function GeneratedHeroBannerView() {
  const router = useRouter();
  const customViewDescription = "{\"headline\":\"Transform Moments into Cinematic Memories\",\"subheader\":\"Professional video services that capture the emotion and story behind every frame of your life's most important events\",\"buttons\":[{\"buttonTitle\":\"Book Consultation\",\"page\":\"portfolio\"}],\"headlineStyle\":{\"fontFamily\":\"Inter\",\"color\":\"#ffffff\",\"fontSize\":\"text-2xl md:text-3xl\"},\"subheaderStyle\":{\"fontFamily\":\"Inter\",\"color\":\"#ffffff\",\"fontSize\":\"text-base md:text-lg\"},\"buttonStyle\":{\"fontFamily\":\"Inter\",\"color\":\"#000000\",\"backgroundColor\":\"#ffffff\"}}";
  
  const handleNavigate = (pageId: string) => {
    if (!pageId) return;
    
    // Find the page using the pageId and navigate to it
    const pages = [{"id":"home","name":"Home"},{"id":"portfolio","name":"Portfolio"},{"id":"services","name":"Services"},{"id":"about","name":"About"},{"id":"testimonials","name":"Testimonials"},{"id":"pricing","name":"Pricing"},{"id":"contact","name":"Contact"},{"id":"faq","name":"FAQ"},{"id":"a8950fb9-402a-466b-be7a-6e78b731eabe","name":"Terms of Service"},{"id":"e099afb3-80f1-4391-8b03-a01b3efb0660","name":"Privacy Policy"}];
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