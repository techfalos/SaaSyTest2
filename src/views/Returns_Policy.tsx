
export default function ReturnsPolicyView() {
    const htmlContent = '<section class="returns-policy">\n    <h1>Returns & Exchanges Policy</h1>\n    \n    <h2>Overview</h2>\n    <p>At our elegant dress boutique, we are committed to ensuring your complete satisfaction with every purchase. Our comprehensive returns and exchanges policy is designed to provide you with a seamless and hassle-free experience.</p>\n    \n    <h2>Return Eligibility</h2>\n    <ul>\n        <li>Items must be unworn, unwashed, and in original condition with all tags attached</li>\n        <li>Returns are accepted within <strong>14 days</strong> of the original purchase date</li>\n        <li>Sale and clearance items are final sale and not eligible for return</li>\n    </ul>\n    \n    <h2>Exchange Process</h2>\n    <ol>\n        <li>Contact our customer service team within 14 days of purchase</li>\n        <li>Obtain a Return Merchandise Authorization (RMA) number</li>\n        <li>Pack the item securely in its original packaging</li>\n        <li>Include the RMA number and original receipt</li>\n        <li>Ship the item to our designated return center</li>\n    </ol>\n    \n    <h2>Refund Details</h2>\n    <p>Refunds will be processed to the original method of payment within <strong>5-7 business days</strong> after receiving the returned item. The refund amount will reflect the full purchase price of the dress, excluding original shipping costs.</p>\n    \n    <h2>Special Considerations</h2>\n    <p><em>Please note that custom or made-to-order dresses are not eligible for return or exchange unless there is a significant manufacturing defect.</em></p>\n</section>';
    
    return (
        <div 
            
            style={{ padding: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}