
export default function PrivacyPolicyView() {
    const htmlContent = 'Sitepaige is not a licensed attorney and cannot write privacy policies. Put your privacy policy here.';
    
    return (
        <div 
            
            style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}