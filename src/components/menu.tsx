/* 
SysArchitect Components v1.0.0
SysArchitect components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import Link from 'next/link';
import { useState } from 'react';

interface MenuItem {
  name: string;
  link?: string;
  submenu?: MenuItem[];
  requiresAuth?: boolean;
  userTier?: number;
}

/* Write Menu */
const menus: MenuItem[][] = [
  [
    {
      "name": "Login",
      "link": "/login"
    },
    {
      "name": "Contact",
      "link": "/contact"
    }
  ],
  [
    {
      "name": "Terms of Service",
      "link": "/terms_of_service"
    },
    {
      "name": "Privacy Policy",
      "link": "/privacy_policy"
    },
    {
      "name": "Contact",
      "link": "/contact"
    }
  ],
  [
    {
      "name": "Category",
      "link": "/category_list"
    },
    {
      "name": "Company Profile",
      "link": "/companyprofile_list"
    },
    {
      "name": "Job Alert",
      "link": "/jobalert_list"
    },
    {
      "name": "Job Listing",
      "link": "/joblisting_list"
    },
    {
      "name": "Resume Database",
      "link": "/resumedatabase_list"
    }
  ],
  [
    {
      "name": "Dashboard",
      "link": "/dashboard"
    },
    {
      "name": "Profile",
      "link": "/profile"
    }
  ]
];
/* End Write Menu */

interface MenuProps {
  menuType: 'header' | 'headerauth' | 'profile' | 'footer' | 'custom';
  menuIndex?: number;
  direction?: 'vertical' | 'horizontal';
  hasAuth?: boolean;
  hasUserTier?: number;
  onClick?: () => void;
}

export default function Menu({ menuType, menuIndex, direction = 'horizontal', hasAuth, hasUserTier, onClick }: MenuProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  let menuItems: MenuItem[] = [];
  
  switch(menuType) {
    case 'header':
      menuItems = menus[0];
      break;
    case 'footer':
      menuItems = menus[1];
      break;
    case 'headerauth':
      menuItems = menus[2];
      break;
    case 'profile':
      menuItems = menus[3];
      break;
    case 'custom':
      menuItems = menuIndex !== undefined ? menus[menuIndex] : [];
      break;
  }

  const renderMenuItem = (item: MenuItem, index: number) => {
    // Skip rendering if auth requirements not met
    if (item.requiresAuth && !hasAuth) {
      return null;
    }

    // Skip rendering if user tier requirements not met
    if (item.userTier && (!hasUserTier || hasUserTier < item.userTier)) {
      return null;
    }

    const handleClick = () => {
      if (onClick) onClick();
    };

    const isHeader = menuType === 'header' || menuType === 'headerauth';
    const isHovered = hoveredIndex === index;

    return (
      <div
        key={item.name}
        className={`relative ${direction === 'horizontal' ? 'inline-block' : 'block'}`}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {item.link ? (
          <Link
            href={item.link}
            onClick={handleClick}
            className={`block px-4 py-2 text-sm ${
              direction === 'horizontal' ? 'inline-block' : ''
            } ${isHeader && isHovered ? 'text-base transition-all duration-200' : ''}`}
          >
            {item.name}
          </Link>
        ) : (
          <span className={`block px-4 py-2 text-sm ${
            isHeader && isHovered ? 'text-base transition-all duration-200' : ''
          }`}>
            {item.name}
          </span>
        )}

        {item.submenu && (hoveredIndex === index || hoveredIndex === -1) && (
          <div 
            className={`${
              direction === 'horizontal' 
                ? 'absolute left-0 w-48 rounded-md shadow-lg py-1 z-50' 
                : 'ml-4'
            }`}
          >
            {item.submenu.map(subItem => renderMenuItem(subItem, -1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`${direction === 'horizontal' ? 'flex space-x-4' : 'flex flex-col'}`}>
      {menuItems.map((item, index) => renderMenuItem(item, index))}
    </nav>
  );
}
