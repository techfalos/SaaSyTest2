
export default function BrandStoryView() {
    const htmlContent = '<section class="brand-story">\n    <h1>The Eloise Co. Story: Crafting Elegance, Celebrating Femininity</h1>\n    \n    <h2>Our Origin</h2>\n    <p>Founded in 2012 by designer Elena Rodriguez, Eloise Co. emerged from a profound passion for transformative fashion and timeless feminine design. Elena\'s vision was simple yet revolutionary: to create dresses that aren\'t just garments, but expressions of individual grace and sophistication.</p>\n    \n    <h2>Our Mission</h2>\n    <p>At Eloise Co., we believe that every woman deserves a dress that makes her feel <em>extraordinary</em>. Our mission is to design and craft garments that seamlessly blend:</p>\n    <ul>\n        <li>Exquisite craftsmanship</li>\n        <li>Refined silhouettes</li>\n        <li>Luxurious, carefully sourced fabrics</li>\n        <li>Attention to intricate details</li>\n    </ul>\n    \n    <h2>Commitment to Craftsmanship</h2>\n    <p>Each Eloise Co. dress represents <strong>hundreds of hours</strong> of meticulous design and precision tailoring. Our skilled artisans, many with generations of textile expertise, transform premium materials into wearable art that celebrates the female form.</p>\n    \n    <h2>Our Promise</h2>\n    <p>We don\'t just sell dresses—we create confidence, memories, and moments of pure elegance. Every stitch, every seam, every carefully selected fabric tells a story of dedication to exceptional design.</p>\n</section>';
    
    return (
        <div 
            
            style={{ padding: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}