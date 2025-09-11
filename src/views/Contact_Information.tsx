
export default function ContactInformationView() {
    const htmlContent = '<section class="contact-section">\n    <h1>Contact Our Taco Truck</h1>\n    <div class="contact-details">\n        <h2>Get In Touch</h2>\n        <p>Have questions or want to place a catering order? We\'re always happy to hear from our taco lovers!</p>\n        \n        <div class="contact-info">\n            <h3>Phone</h3>\n            <p><strong>(555) 123-TACO</strong></p>\n            \n            <h3>Email</h3>\n            <p>streetfoodtacos@example.com</p>\n            \n            <h3>Business Hours</h3>\n            <ul>\n                <li>Monday: Closed</li>\n                <li>Tuesday - Thursday: 11:00 AM - 8:00 PM</li>\n                <li>Friday - Saturday: 11:00 AM - 10:00 PM</li>\n                <li>Sunday: 12:00 PM - 7:00 PM</li>\n            </ul>\n            \n            <h3>Follow Our Culinary Journey</h3>\n            <p>Street Taco Truck: Authentic flavors, mobile kitchen, community spirit</p>\n        </div>\n    </div>\n</section>';
    
    return (
        <div 
            
            style={{ padding: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}