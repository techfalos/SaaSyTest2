
export default function TermsOfServiceView() {
    const htmlContent = 'Sitepaige is not a licensed attorney and cannot write legal terms and conditions. Put your terms and conditions here.';
    
    return (
        <div 
            
            style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}