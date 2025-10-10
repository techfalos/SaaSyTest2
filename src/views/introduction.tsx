import React from 'react';

interface GeneratedIntroductionViewProps {
  isContainer?: boolean;
}

export default function GeneratedIntroductionView({ isContainer = false }: GeneratedIntroductionViewProps){
  const useCard = false;
  return (
      <div className="rtext-content" dangerouslySetInnerHTML={{__html: "<section style=\"width: 100%; margin: 48px 0; padding: 48px; background-color: #f0f8ff; display: flex; flex-direction: column; justify-content: center;\">\n    <h2 style=\"font-size: 28px; margin-bottom: 24px;\">Creative Videography by My Video</h2>\n    <p style=\"font-size: 18px; line-height: 1.6; color: #1a1a1a; padding: 16px 0;\">At My Video, we transform ordinary moments into extraordinary visual stories, capturing the essence of your most significant events with professional cinematography and innovative storytelling techniques. Our passionate team combines cutting-edge technology with artistic vision to deliver cinematic experiences that will be treasured for generations.</p>\n</section>" }} />
  );
}