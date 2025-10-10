import React from 'react';

interface GeneratedPortfolioIntroductionViewProps {
  isContainer?: boolean;
}

export default function GeneratedPortfolioIntroductionView({ isContainer = false }: GeneratedPortfolioIntroductionViewProps){
  const useCard = false;
  return (
      <div className="rtext-content" dangerouslySetInnerHTML={{__html: "<article style=\"width: 100%; margin: 48px 0; padding: 40px; background-color: #f0f8ff; color: #1a1a1a; line-height: 1.8; font-size: 18px;\">\n    <h2 style=\"margin-bottom: 24px;\">Capturing Life's Moments with My Video</h2>\n    <p>At My Video, we transform ordinary moments into extraordinary visual narratives, specializing in dynamic videography that spans wedding celebrations, corporate events, artistic documentaries, and cinematic personal stories. Our versatile team captures each unique moment with precision, creativity, and emotional depth, ensuring every project reflects the distinct personality and vision of our clients. With state-of-the-art equipment and a passion for storytelling, My Video crafts compelling visual experiences that resonate and endure.</p>\n</article>" }} />
  );
}