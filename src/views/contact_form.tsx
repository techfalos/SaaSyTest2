import React from 'react';
import RForm from '../components/form';

export default function GeneratedContactFormView() {
  const design = {"generatelogo":false,"generatefavicon":false,"logo":"","favicon":"/favicon.ico","logoPosition":"left","menuPosition":"right","menuFont":"Inter","menuFontSize":"text-lg","hideMenuOnDesktop":false,"ctaPosition":"none","loginPosition":"none","bleedColorIntoHeader":true,"textColor":"#1a1a1a","accentColor":"#000000","backgroundColor":"#ffffff","accentTextColor":"#ffffff","titleFont":"Inter","textFont":"Inter","logoFont":"Inter","ideaCloud":[],"designStyle":"compact-hero","targetLocation":"Worldwide","websiteLanguage":"English","buttonRoundedness":"rounded","titleFontSize":"text-3xl","textFontSize":"text-base","inputBackgroundColor":"#f2f2f2","inputBorderRadius":"10px","inputTextColor":"#161616","titleColor":"#000000"};
  
  return (
    <RForm 
      name="Contact Form"
      custom_view_description={"{\"submissionEmail\":\"contact@example.com\",\"useCaptcha\":true,\"fields\":[{\"id\":\"name\",\"name\":\"name\",\"label\":\"Your Name\",\"type\":\"text\",\"required\":true,\"placeholder\":\"John Doe\"},{\"id\":\"email\",\"name\":\"email\",\"label\":\"Email Address\",\"type\":\"text\",\"required\":true,\"placeholder\":\"john@example.com\"},{\"id\":\"phone\",\"name\":\"phone\",\"label\":\"Phone Number\",\"type\":\"text\",\"required\":false,\"placeholder\":\"(555) 123-4567\"},{\"id\":\"service\",\"name\":\"service\",\"label\":\"Service Interested In\",\"type\":\"dropdown\",\"required\":true,\"options\":[\"Wedding Videography\",\"Corporate Video\",\"Commercial Production\",\"Event Coverage\",\"Other\"]},{\"id\":\"date\",\"name\":\"date\",\"label\":\"Event Date (if applicable)\",\"type\":\"text\",\"required\":false,\"placeholder\":\"MM/DD/YYYY\"},{\"id\":\"budget\",\"name\":\"budget\",\"label\":\"Budget Range\",\"type\":\"dropdown\",\"required\":false,\"options\":[\"Under $2,000\",\"$2,000-$5,000\",\"$5,000-$10,000\",\"Over $10,000\",\"Not Sure Yet\"]},{\"id\":\"message\",\"name\":\"message\",\"label\":\"Project Details\",\"type\":\"textarea\",\"required\":true,\"placeholder\":\"Tell me about your project, vision, and any specific requirements...\"}]}"}
      design={design}
    />
  );
}