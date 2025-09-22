
'use client';

import { useEffect } from 'react';

export default function BlueprintMenuInitializer() {
    useEffect(() => {
        // Initialize blueprint menu data in localStorage
        try {
            const profileMenuData = [
  {
    "label": "Dashboard",
    "link": "/dashboard"
  },
  {
    "label": "Admin Dashboard",
    "link": "/admin_dashboard"
  }
];
            localStorage.setItem('blueprint_profile_menu', JSON.stringify(profileMenuData));
            console.log('Blueprint profile menu data initialized');
        } catch (error) {
            console.error('Failed to initialize blueprint menu data:', error);
        }
    }, []);
    
    // This component doesn't render anything
    return null;
}
