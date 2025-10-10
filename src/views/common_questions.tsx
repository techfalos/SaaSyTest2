import React from 'react';

interface GeneratedCommonQuestionsViewProps {
  isContainer?: boolean;
}

export default function GeneratedCommonQuestionsView({ isContainer = false }: GeneratedCommonQuestionsViewProps){
  const useCard = false;
  return (
      <div className="rtext-content" dangerouslySetInnerHTML={{__html: "<section style=\"width: 100%; padding: 48px; margin: 32px 0; background-color: #f0f8ff;\">\n    <h2 style=\"font-size: 28px; margin-bottom: 24px;\">Frequently Asked Questions</h2>\n    <p style=\"font-size: 18px; line-height: 1.6; color: #1a1a1a;\">At My Video, we understand that clients often have questions about our videography services. Our comprehensive FAQ section addresses the most common inquiries to help you better understand our process and expertise.</p>\n</section>" }} />
  );
}