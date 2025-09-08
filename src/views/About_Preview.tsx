
export default function AboutPreviewView() {
    const htmlContent = '<section class="heritage-section">\n    <h2>A Legacy of Timeless Elegance</h2>\n    <p>Founded in the heart of Paris in 1923, our boutique has been a sanctuary of refined fashion for generations. Each gown we create is a testament to our unwavering commitment to exquisite craftsmanship and <em>extraordinary design</em>.</p>\n\n    <p>Our master artisans bring decades of expertise to every stitch, carefully selecting luxurious fabrics and meticulously constructing each dress with <strong>unparalleled precision</strong>. We believe that true elegance transcends trends, celebrating the enduring beauty of classic silhouettes and impeccable tailoring.</p>\n\n    <h3>Our Dedication</h3>\n    <ul>\n        <li>Handcrafted excellence</li>\n        <li>Timeless design principles</li>\n        <li>Exceptional quality materials</li>\n        <li>Personalized attention to every detail</li>\n    </ul>\n\n    <p>From sophisticated evening gowns to delicate bridal wear, we continue to honor our heritage by creating garments that are not just worn, but <em>experienced</em>—pieces that tell a story of grace, sophistication, and timeless allure.</p>\n</section>';
    
    return (
        <div 
            className="view-about_preview-title"
            style={{ padding: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}