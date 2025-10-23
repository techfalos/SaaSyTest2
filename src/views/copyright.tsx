import React from 'react';

interface GeneratedCopyrightViewProps {
  isContainer?: boolean;
}

export default function GeneratedCopyrightView({ isContainer = false }: GeneratedCopyrightViewProps){
  const useCard = false;
  return (
      <div className="rtext-content" dangerouslySetInnerHTML={{__html: "© 2025 Victorian Era. All rights reserved." }} />
  );
}