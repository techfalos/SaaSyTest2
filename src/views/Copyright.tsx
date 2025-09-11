
export default function CopyrightView() {
    const htmlContent = '© 2025 Zizzle. All rights reserved.';
    
    return (
        <div 
            
            style={{ padding: '1.5rem', textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}