/* 
SysArchitect Components v1.0.0
SysArchitect components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Menu from './menu';
import { useUserStore } from '@/store/user';

interface HeaderProps {
  companyName: string;
}

export default function Header({ companyName }: HeaderProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { userName, avatarURL, userLevel, isAuthenticated } = useUserStore();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/Auth', {
        method: 'DELETE'
      });
      if (response.ok) {
        useUserStore.getState().clearUser();
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 shadow-md classHeaderLinkSize classHeaderFontType classHeaderBackground">
      <div className="flex items-center">
        <button onClick={() => {
          router.push('/');
        }}>   
          <div className="rounded-sm flex items-center justify-center">
            {/* Logo */}
            {/* End Logo */}
            <span className="font-semibold ml-5 text-2xl tracking-wide">{companyName}</span>
          </div>
          
        </button>
      </div>
      
      <div className="flex items-center">
        <nav className="relative">
          {/* Hamburger button for mobile */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">
            {isAuthenticated && <Menu menuType="headerauth" direction="horizontal" hasAuth={true} hasUserTier={parseInt(userLevel)} />}
            {!isAuthenticated && <Menu menuType="header" direction="horizontal" hasAuth={false} hasUserTier={0} />}
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 md:hidden">
              {isAuthenticated && (
                <>
                  <div className="px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center">
                      {avatarURL && (
                        <img 
                          src={avatarURL}
                          alt="User avatar" 
                          className="w-8 h-8 rounded-full mr-2"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                        />
                      )}
                      <span className="text-gray-700">{userName}</span>
                    </div>
                  </div>
                  <Menu menuType="profile" onClick={() => setIsMenuOpen(false)} direction="vertical" hasAuth={true} hasUserTier={parseInt(userLevel)} />
                </>
              )}
              {isAuthenticated && (
                <div className="border-t border-gray-200">
                  <Menu menuType="headerauth" hasAuth={true} hasUserTier={parseInt(userLevel)} />
                </div>
              )}
              {!isAuthenticated && (
                <div className="border-t border-gray-200">
                  <Menu menuType="header" hasAuth={false} hasUserTier={0} />
                </div>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 border-t border-gray-200"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </nav>

        {isAuthenticated && (
          <div className="relative ml-4 hidden md:block">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center focus:outline-none"
            >
              <span className="mr-2">{userName}</span>
              {avatarURL && (
                <img 
                  src={avatarURL}
                  alt="User avatar" 
                  className="w-8 h-8 rounded-full"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              )}
            </button>

            {/* Desktop user menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Menu menuType="profile" onClick={() => setShowUserMenu(false)} direction="vertical" hasAuth={true} hasUserTier={parseInt(userLevel)} />
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
