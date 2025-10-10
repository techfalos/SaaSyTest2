import React from 'react';

interface GeneratedHeaderBlankViewProps {
  isContainer?: boolean;
}

export default function GeneratedHeaderBlankView({ isContainer = false }: GeneratedHeaderBlankViewProps){
  const useCard = false;
  return (
      <div className="rtext-content" dangerouslySetInnerHTML={{__html: "" }} />
  );
}