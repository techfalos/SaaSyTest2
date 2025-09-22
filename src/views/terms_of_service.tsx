import React from 'react';

interface GeneratedTermsOfServiceViewProps {
  isContainer?: boolean;
}

export default function GeneratedTermsOfServiceView({ isContainer = false }: GeneratedTermsOfServiceViewProps){
  const useCard = false;
  return (
    <div className={`${useCard ? "card" : "text-content"} ${!useCard ? "opacity-80" : ""}`} style={{ 
      margin: '5% 10%',
      padding: useCard ? undefined : '1.5rem',
      borderRadius: useCard ? undefined : '0.5rem'
    }}>
      <div className="rtext-content" dangerouslySetInnerHTML={{__html: "Sitepaige is not a licensed attorney and cannot write legal terms and conditions. Put your terms and conditions here." }} />
    </div>
  );
}