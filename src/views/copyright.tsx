import React from 'react';

interface GeneratedCopyrightViewProps {
  isContainer?: boolean;
}

export default function GeneratedCopyrightView({ isContainer = false }: GeneratedCopyrightViewProps){
  const useCard = false;
  return (
    <div className={`${useCard ? "card" : "text-content"} ${!useCard ? "opacity-80" : ""}`} style={{ 
      margin: '5% 10%',
      padding: useCard ? undefined : '1.5rem',
      borderRadius: useCard ? undefined : '0.5rem'
    }}>
      <div className="rtext-content" dangerouslySetInnerHTML={{__html: "© 2025 Vitalisona. All rights reserved." }} />
    </div>
  );
}