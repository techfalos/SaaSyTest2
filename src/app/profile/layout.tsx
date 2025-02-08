
import { headers } from 'next/headers';
import Auth from '@/components/auth';

async function getAuth() {
    try {
        const headersList = await headers();
        const url = process.env.NODE_ENV === 'production' ? process.env.DOMAIN : process.env.LOCAL_DOMAIN;
        const response = await fetch(url + "/api/Auth", {
            headers: {
                cookie: headersList.get('cookie') || ''
            }
        });
        
        if (!response.ok) {
            throw new Error('Auth check failed');
        }
        
        return await response.json();
    } catch (error) {
        return null;
    }
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const auth = await getAuth();
    
    if (!auth) {
        // Redirect to login if auth fails
        return (
            <html>
                <head>
                    <meta httpEquiv="refresh" content="0;url=/login" />
                </head>
                <body>
                    <p>Redirecting to login...</p>
                </body>
            </html>
        );
    }

    return (
        <>
            <Auth auth={auth} />
            {children}
        </>
    );
}