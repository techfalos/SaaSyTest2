import React from 'react';
import RForm from '../components/form';

export default function GeneratedContactFormView() {
  const design = {"generatelogo":false,"generatefavicon":false,"logo":"/logo.png","favicon":"/favicon.ico","logoPosition":"left","menuPosition":"right","menuFont":"Nunito","menuFontSize":"text-lg","hideMenuOnDesktop":false,"ctaPosition":"none","loginPosition":"none","bleedColorIntoHeader":true,"textColor":"#1f1b2e","accentColor":"#9333ea","backgroundColor":"#fefbff","accentTextColor":"#ffffff","titleFont":"Poppins","textFont":"Nunito","logoFont":"Poppins","ideaCloud":[],"designStyle":"slideshow","targetLocation":"Worldwide","websiteLanguage":"English","buttonRoundedness":"rounded","titleFontSize":"text-3xl","textFontSize":"text-base","inputBackgroundColor":"#f1eef2","inputBorderRadius":"10px","inputTextColor":"#1a1627","titleColor":"#9333ea"};
  
  return (
    <RForm 
      name="Contact Form"
      custom_view_description={"{\"submissionEmail\":\"contact@example.com\",\"useCaptcha\":true,\"fields\":[{\"id\":\"name\",\"name\":\"name\",\"label\":\"Your Name\",\"type\":\"text\",\"required\":true,\"placeholder\":\"Lady Catherine Smith\"},{\"id\":\"email\",\"name\":\"email\",\"label\":\"Email Address\",\"type\":\"text\",\"required\":true,\"placeholder\":\"catherine@example.com\"},{\"id\":\"subject\",\"name\":\"subject\",\"label\":\"Subject\",\"type\":\"dropdown\",\"required\":true,\"options\":[\"General Inquiry\",\"Custom Order\",\"Sizing Question\",\"Shipping Information\",\"Returns & Exchanges\",\"Other\"]},{\"id\":\"message\",\"name\":\"message\",\"label\":\"Message\",\"type\":\"textarea\",\"required\":true,\"placeholder\":\"Please share your questions or custom requirements...\"}]}"}
      design={design}
    />
  );
}