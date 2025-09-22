
export default function CopyrightView() {
    const htmlContent = '© 2025 Vitalisona. All rights reserved.';
    
    return (
        <div 
            
            style={{ paddingLeft: '5px', paddingRight: '10px', paddingBottom: '25px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}