import React from 'react';

interface GeneratedAboutOurCollectionViewProps {
  isContainer?: boolean;
}

export default function GeneratedAboutOurCollectionView({ isContainer = false }: GeneratedAboutOurCollectionViewProps){
  const useCard = false;
  return (
      <div className="rtext-content" dangerouslySetInnerHTML={{__html: "<section style=\"width: 100%;\">\n    <div style=\"margin: 48px 0; padding: 40px; width: 100%; background-color: #fefbff;\">\n        <h1 style=\"font-size: 2.5rem; margin-bottom: 32px;\">Victorian Era: Authentic Period Dress Craftsmanship</h1>\n        \n        <article style=\"margin-bottom: 48px;\">\n            <h2 style=\"font-size: 1.8rem; margin-bottom: 24px;\">The Artistry of Victorian Fashion</h2>\n            <p style=\"font-size: 18px; line-height: 1.8; margin-bottom: 24px;\">At <strong>Victorian Era</strong>, we specialize in meticulously recreating the sartorial elegance of 19th-century British fashion. Our commitment to historical authenticity means each garment is a precise reflection of the era's intricate design principles, from the structured bodices of day dresses to the elaborate evening gowns that defined social hierarchy.</p>\n        </article>\n\n        <div style=\"padding: 32px; background-color: #f4f4f4; border-radius: 8px; margin-bottom: 48px;\">\n            <h2 style=\"font-size: 1.8rem; margin-bottom: 24px;\">Craftsmanship Beyond Comparison</h2>\n            <p style=\"font-size: 18px; line-height: 1.8;\">Our skilled artisans employ traditional techniques passed down through generations, ensuring every stitch, seam, and embellishment meets the exacting standards of Victorian haute couture. We source period-authentic fabrics like fine silk, delicate muslin, and rich velvet, recreating the luxurious textures that made <strong>Victorian Era</strong> fashion truly extraordinary.</p>\n        </div>\n    </div>\n</section>" }} />
  );
}