
export default function OurStoryView() {
    const htmlContent = '<section class="taco-story">\n    <div class="story-container">\n        <h1>Authentic Street Tacos, Born from Tradition</h1>\n        \n        <article class="origin-narrative">\n            <h2>Our Journey Begins</h2>\n            <p>Founded in the vibrant streets of Los Angeles, our family-owned taco truck carries generations of culinary passion. What started as my grandmother\'s cherished street food recipe in Jalisco, Mexico, has transformed into a mobile kitchen celebrating authentic Mexican street cuisine.</p>\n        </article>\n\n        <article class="commitment">\n            <h2>Commitment to Authenticity</h2>\n            <p>Every taco we serve is a testament to traditional cooking methods. We source local, fresh ingredients and prepare each dish with the same <em>amor</em> and <strong>respect for heritage</strong> that has defined our family\'s cooking for decades.</p>\n        </article>\n\n        <article class="ingredients">\n            <h2>Our Promise</h2>\n            <ul>\n                <li>Hand-pressed tortillas made daily</li>\n                <li>Locally sourced, premium meats</li>\n                <li>Homemade salsas and marinades</li>\n                <li>Authentic regional recipes</li>\n            </ul>\n        </article>\n    </div>\n</section>';
    
    return (
        <div 
            className="view-truck_story-title"
            style={{ padding: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}