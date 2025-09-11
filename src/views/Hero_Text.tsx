
export default function HeroTextView() {
    const htmlContent = '<section class="welcome-section">\n    <h1>Authentic Street Tacos, Fresh to You</h1>\n    <h2>Where Tradition Meets Flavor on Every Plate</h2>\n    <p>Our family-recipes bring the vibrant spirit of Mexican street cuisine directly to your neighborhood. Each taco is crafted with passion, using hand-pressed tortillas, locally sourced ingredients, and time-honored cooking techniques passed down through generations.</p>\n    <p>From sizzling <strong>carne asada</strong> to tender <em>al pastor</em>, every bite tells a story of culinary heritage and bold, fresh flavors that transport you straight to the streets of Mexico.</p>\n</section>';
    
    return (
        <div 
            
            style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}