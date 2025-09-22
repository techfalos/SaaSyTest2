import React from 'react';

interface GeneratedPrivacyPolicyViewProps {
  isContainer?: boolean;
}

export default function GeneratedPrivacyPolicyView({ isContainer = false }: GeneratedPrivacyPolicyViewProps){
  const useCard = false;
  return (
    <div className={`${useCard ? "card" : "text-content"} ${!useCard ? "opacity-80" : ""}`} style={{ 
      margin: '5% 10%',
      padding: useCard ? undefined : '1.5rem',
      borderRadius: useCard ? undefined : '0.5rem'
    }}>
      <div className="rtext-content" dangerouslySetInnerHTML={{__html: "Sitepaige is not a licensed attorney and cannot write privacy policies. Put your privacy policy here." }} />
    </div>
  );
}