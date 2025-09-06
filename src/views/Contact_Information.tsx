
export default function ContactInformationView() {
    const htmlContent = '<section class="contact-section">\n    <h1>Contact Haute Couture Dresses</h1>\n    \n    <div class="contact-details">\n        <h2>Store Location</h2>\n        <p><strong>Haute Couture Dresses Flagship Store</strong><br>\n        123 Elegance Boulevard<br>\n        City Center, Metropolitan Area 54321</p>\n        \n        <h2>Connect With Us</h2>\n        <p>Phone: (555) 237-9810<br>\n        Email: customercare@hautecouturedresses.com</p>\n        \n        <h2>Business Hours</h2>\n        <p>Monday - Saturday: 10:00 AM - 7:00 PM<br>\n        Sunday: 12:00 PM - 5:00 PM</p>\n        \n        <h2>Customer Service</h2>\n        <p>Our dedicated customer service team is committed to providing personalized assistance. We\'re here to help you find the perfect dress and ensure your shopping experience is exceptional.</p>\n        \n        <p><em>Complimentary consultations available by appointment.</em></p>\n    </div>\n</section>';
    
    return (
        <div 
            
            style={{ padding: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}