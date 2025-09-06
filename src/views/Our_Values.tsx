
export default function OurValuesView() {
    const htmlContent = '<section class="company-values">\n    <h2>Our Principles of Elegant Design</h2>\n    <p>At the heart of our dress collection lies an unwavering commitment to excellence and sophistication. We believe that every garment tells a story, and our story is woven with four fundamental values:</p>\n\n    <h3>Exceptional Quality</h3>\n    <p>We meticulously select premium fabrics and employ skilled artisans who transform each piece into a masterpiece of craftsmanship. Our dresses are not just clothing; they are <em>precision-engineered expressions of beauty</em>.</p>\n\n    <h3>Timeless Elegance</h3>\n    <p>Our designs transcend fleeting trends, focusing instead on <strong>classic silhouettes</strong> and refined details that celebrate individual grace. We create dresses that make women feel confident and sophisticated.</p>\n\n    <h3>Sustainable Responsibility</h3>\n    <p>We are dedicated to environmentally conscious fashion. Our production processes prioritize sustainable materials, ethical manufacturing, and reduced environmental impact without compromising on style or quality.</p>\n\n    <h3>Customer Satisfaction</h3>\n    <p>Every dress is a promise of excellence. We are committed to understanding our clients\' unique desires and providing personalized experiences that exceed expectations, from selection to final fitting.</p>\n</section>';
    
    return (
        <div 
            
            style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}