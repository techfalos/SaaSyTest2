
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Auth from '@/components/auth';
import BlueprintMenuInitializer from '@/components/blueprint-menu-init';
import '../globals.css';

export const dynamic = 'force-dynamic';

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
        // Properly redirect using Next.js redirect function
        redirect('/login');
    }

    return (
        <>
            <BlueprintMenuInitializer />
            <Auth auth={auth} />
            {children}
        </>
    );
}