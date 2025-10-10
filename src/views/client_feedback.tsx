import React from 'react';

interface GeneratedClientFeedbackViewProps {
  isContainer?: boolean;
}

export default function GeneratedClientFeedbackView({ isContainer = false }: GeneratedClientFeedbackViewProps){
  const useCard = false;
  return (
      <div className="rtext-content" dangerouslySetInnerHTML={{__html: "<article style=\"width: 100%; padding: 48px; margin: 48px 0; background-color: #f0f8ff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);\">\n    <h2 style=\"font-size: 28px; margin-bottom: 24px;\">Creating Lasting Memories with My Video</h2>\n    <p style=\"font-size: 18px; line-height: 1.6; color: #2c3e50;\">At My Video, we understand that every visual story is a precious opportunity to capture moments that will be treasured for generations, transforming fleeting seconds into timeless memories. Our passionate team is dedicated to crafting cinematic experiences that not only document your special moments but also evoke the genuine emotions and unique narratives that make your story truly extraordinary.</p>\n</article>" }} />
  );
}