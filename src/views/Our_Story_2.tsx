
export default function OurStory2View() {
    const htmlContent = '<section class="taco-truck-story">\n    <h1>Our Family\'s Culinary Journey</h1>\n    \n    <article>\n        <h2>From Family Kitchen to Street Corner</h2>\n        \n        <p>Founded in 2008 by the Ramirez family, our taco truck represents generations of authentic Mexican culinary tradition. What began as Maria Ramirez\'s home kitchen recipes in Guadalajara has blossomed into a beloved local street food institution.</p>\n        \n        <p>Our story is rooted in <strong>generational knowledge</strong> passed down through three generations of passionate home cooks. Every recipe we serve comes directly from our family\'s treasured cookbook, carefully preserved and lovingly recreated on our truck.</p>\n    </article>\n    \n    <article>\n        <h2>Commitment to Authenticity</h2>\n        \n        <p>We pride ourselves on using only the most genuine ingredients:</p>\n        \n        <ul>\n            <li>Hand-pressed corn tortillas made fresh daily</li>\n            <li>Locally sourced meats from small-scale ranchers</li>\n            <li>Traditional spice blends imported directly from Mexico</li>\n            <li>Organic produce from regional farmers</li>\n        </ul>\n        \n        <p>Each taco tells a story of <em>tradition, craftsmanship, and heritage</em>.</p>\n    </article>\n    \n    <article>\n        <h2>Community at Our Core</h2>\n        \n        <p>Beyond serving delicious food, we\'re deeply committed to our local community. We regularly participate in neighborhood events, support local culinary schools, and provide meal programs for underserved communities.</p>\n        \n        <p>Our truck isn\'t just a business—it\'s a <strong>gathering place</strong> where food brings people together, creating connections and celebrating cultural richness.</p>\n    </article>\n</section>';
    
    return (
        <div 
            
            style={{ padding: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}