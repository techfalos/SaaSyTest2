
// Blueprint Menu Data Initializer
// This script initializes localStorage with blueprint profile menu data
(function() {
    'use strict';
    
    // Only run in browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
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
            console.log('Blueprint profile menu data initialized in localStorage');
        } catch (error) {
            console.error('Failed to initialize blueprint menu data:', error);
        }
    }
})();
