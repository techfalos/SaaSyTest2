import React from 'react';

export default function GeneratedFeaturedWorkView(){
  const imageSrc = "/images/07e7f230-9650-4755-8b7e-3d938421900f.jpg";
  const altText = "Image";
  const textColor = "#1a1a1a";
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
            width: '100%',
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