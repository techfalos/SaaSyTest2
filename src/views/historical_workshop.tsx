import React from 'react';

export default function GeneratedHistoricalWorkshopView(){
  const imageSrc = "/images/d610a8fb-e8d1-4904-a405-b2e8e6d55f33.jpg";
  const altText = "Image";
  const textColor = "#1f1b2e";
  const height = null;
  
  return (
    <>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={altText || 'Image'}
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center',
            height: height ? `${height}px` : 'auto',
            display: 'block'
          }}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      ) : (
        altText && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: textColor || '#666',
            textAlign: 'center',
            minHeight: height ? `${height}px` : '100px',
            fontSize: '1rem'
          }}>
            {altText.length > 15 ? altText.slice(0, 15) + '…' : altText}
          </div>
        )
      )}
    </>
  );
}