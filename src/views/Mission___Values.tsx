
export default function MissionValuesView() {
    const htmlContent = '<section class="mission-section">\n    <div class="mission-content">\n        <h1>Our Culinary Journey</h1>\n        <h2>Authentic Flavors, Genuine Passion</h2>\n        \n        <p>At <strong>Street Tacos Truck</strong>, our mission is simple yet profound: to bring the vibrant, genuine taste of traditional Mexican street food to our community, one handcrafted taco at a time.</p>\n        \n        <h3>Our Core Values</h3>\n        <ul>\n            <li><em>Quality Ingredients</em>: We source locally, selecting the freshest produce and highest-grade meats to ensure every bite tells a story of authenticity.</li>\n            \n            <li><em>Traditional Recipes</em>: Our recipes are direct descendants of generations-old family traditions, honoring the rich culinary heritage of Mexico.</li>\n            \n            <li><em>Community Connection</em>: We believe food is more than sustenance—it\'s a bridge that connects people, cultures, and hearts.</li>\n        </ul>\n        \n        <p>From our carefully seasoned meats to our hand-pressed tortillas, every element of our cuisine reflects our commitment to excellence and respect for culinary tradition.</p>\n    </div>\n</section>';
    
    return (
        <div 
            
            style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}