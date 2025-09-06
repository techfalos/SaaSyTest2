
export default function ShippingInformationView() {
    const htmlContent = '<section class="shipping-info">\n    <h1>Shipping Information</h1>\n\n    <h2>Delivery Options</h2>\n    <p>At our elegant dress boutique, we offer multiple shipping methods to ensure your exquisite garment arrives perfectly and promptly:</p>\n    <ul>\n        <li><strong>Standard Shipping:</strong> 3-5 business days</li>\n        <li><strong>Express Shipping:</strong> 1-2 business days</li>\n        <li><strong>Priority Overnight:</strong> Next business day delivery</li>\n    </ul>\n\n    <h2>Shipping Costs</h2>\n    <p>We strive to provide transparent and competitive shipping rates:</p>\n    <ul>\n        <li>Standard Shipping: Complimentary on orders over $250</li>\n        <li>Express Shipping: $15 flat rate</li>\n        <li>Priority Overnight: $25 flat rate</li>\n    </ul>\n\n    <h2>International Shipping</h2>\n    <p>We proudly offer international shipping to select countries, ensuring our luxurious dresses can be enjoyed worldwide. Please note:</p>\n    <ul>\n        <li>Delivery times vary by destination: 5-10 business days</li>\n        <li>Additional customs fees may apply</li>\n        <li>International shipping rates calculated at checkout</li>\n    </ul>\n\n    <h2>Package Protection</h2>\n    <p><em>Every dress is carefully packaged in protective garment bags and insured for its full value, guaranteeing safe and secure delivery.</em></p>\n</section>';
    
    return (
        <div 
            
            style={{ padding: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}