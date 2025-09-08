
export default function HeroTextView() {
    const htmlContent = '<section class="hero-section">\n    <h1>Timeless Elegance, Extraordinary Style</h1>\n    <h2>Curate Your Perfect Moment with Bespoke Designer Dresses</h2>\n    <p>Discover a world of refined sophistication where every dress tells a story of grace and individuality. Our meticulously crafted collection transforms special occasions into unforgettable memories.</p>\n    <p><strong>Elevate Your Wardrobe</strong> with handpicked designs that celebrate your unique essence.</p>\n</section>';
    
    return (
        <div 
            
            style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}