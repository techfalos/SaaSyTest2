/* 
SysArchitect Components v1.0.0
SysArchitect components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Menu from './menu';
import { useUserStore } from '@/store/user';
import Link from 'next/link';

// Define the Design interface locally
interface Design {
  generatelogo?: boolean;
  generatefavicon?: boolean;
  logo?: string;
  favicon?: string;
  logoPosition?: string;
  menuPosition?: string;
  hideMenuOnDesktop?: boolean;
  ctaPosition?: string;
  loginPosition?: string;
  heroLayout?: string;
  bleedColorIntoHeader?: boolean;
  titleColor?: string;
  textColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  accentTextColor?: string;
  useGradient?: boolean;
  gradientColor?: string;
  titleFont?: string;
  textFont?: string;
  logoFont?: string;
  websiteLanguage?: string;
}

interface HeaderProps {
  companyName: string;
  design?: Design;
}

export default function Header({ companyName, design = {
  logoPosition: 'left',
  menuPosition: 'right',
  hideMenuOnDesktop: false,
  ctaPosition: 'right',
  loginPosition: 'right',
  bleedColorIntoHeader: true,
  backgroundColor: '#ffffff',
  logoFont: 'Roboto',
  titleFont: 'Roboto',
  accentColor: '#000000',
  accentTextColor: '#ffffff',
  websiteLanguage: 'English'
} }: HeaderProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { userName, avatarURL, userLevel, isAuthenticated, isAdmin } = useUserStore();

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

  // Get localized text based on website language
  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'Login': {
        'English': 'Login',
        'Spanish': 'Iniciar sesión',
        'French': 'Connexion',
        'German': 'Anmelden',
        'Portuguese': 'Entrar',
        'Italian': 'Accedi',
        'Dutch': 'Inloggen',
        'Chinese': '登录',
        'Japanese': 'ログイン',
        'Korean': '로그인',
        'Russian': 'Вход',
        'Arabic': 'تسجيل الدخول',
        'Hindi': 'लॉग इन'
      },
      'Logout': {
        'English': 'Logout',
        'Spanish': 'Cerrar sesión',
        'French': 'Déconnexion',
        'German': 'Abmelden',
        'Portuguese': 'Sair',
        'Italian': 'Disconnetti',
        'Dutch': 'Uitloggen',
        'Chinese': '登出',
        'Japanese': 'ログアウト',
        'Korean': '로그아웃',
        'Russian': 'Выход',
        'Arabic': 'تسجيل الخروج',
        'Hindi': 'लॉग आउट'
      }
    };

    // Determine which language to use
    let language = 'English'; // Default
    if (design.websiteLanguage) {
      // Extract the main language from the input
      const langMap: Record<string, string> = {
        'English': 'English',
        'Spanish': 'Spanish',
        'French': 'French',
        'German': 'German',
        'Portuguese': 'Portuguese',
        'Italian': 'Italian',
        'Dutch': 'Dutch',
        'Chinese': 'Chinese',
        'Japanese': 'Japanese',
        'Korean': 'Korean',
        'Russian': 'Russian',
        'Arabic': 'Arabic',
        'Hindi': 'Hindi'
      };
      
      // Find the matching language
      for (const [langKey, langValue] of Object.entries(langMap)) {
        if (design.websiteLanguage.includes(langKey)) {
          language = langValue;
          break;
        }
      }
    }

    return translations[key]?.[language] || key;
  };

  // Apply title font to menu items and buttons
  const logoFontStyle = design.logoFont ? { fontFamily: `${design.logoFont}, sans-serif` } : {};
  const titleFontStyle = design.titleFont ? { fontFamily: `${design.titleFont}, sans-serif` } : {};
  // Set header background style based on bleedHeader option
  const headerStyle = design.bleedColorIntoHeader === false && design.backgroundColor 
    ? { backgroundColor: design.backgroundColor } 
    : {};


  const renderLogoSection = () => (
      <div className="flex items-center">
         <Link href="/">   
          <div className="rounded-sm flex items-center justify-center">
            {/* Logo */}
            {design.logo && (
              <img 
                src={`data:image/png;base64,${design.logo}`} 
                alt={`${companyName} logo`} 
                className="h-16" 
              />
            )}
            {/* End Logo */}
            <span className="font-semibold text-2xl tracking-wide" style={logoFontStyle}>{companyName}</span>
          </div>
        </Link>
      </div>
    );

  const renderMenuSection = () => (
    <nav className={`relative ${design.hideMenuOnDesktop ? 'hidden md:block' : ''}`}>
      {/* Hamburger button for mobile */}
      <button 
        className="md:hidden p-2 rounded"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
        style={{ 
          backgroundColor: design.accentColor, 
          color: design.accentTextColor 
        }}
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
      <div className="hidden md:flex space-x-4" style={titleFontStyle}>
        {isAuthenticated && isAdmin && <Menu menuType="headeradmin" direction="horizontal" hasAuth={true} hasUserTier={parseInt(userLevel)} />}
        {isAuthenticated && <Menu menuType="headerauth" direction="horizontal" hasAuth={true} hasUserTier={parseInt(userLevel)} />}
        {!isAuthenticated && <Menu menuType="header" direction="horizontal" hasAuth={false} hasUserTier={0} />}
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg py-1 md:hidden">
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
          {isAdmin && isAuthenticated && (
            <div className="border-t border-gray-200">
              <Menu menuType="headeradmin" hasAuth={true} hasUserTier={parseInt(userLevel)} />
            </div>
          )}
          {isAuthenticated && !isAdmin && (
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
              className="block w-full text-left px-4 py-2 text-gray-700 border-t border-gray-200 !bg-transparent"
              style={titleFontStyle}
            >
              {getLocalizedText('Logout')}
            </button>
          )}
        </div>
      )}
    </nav>
  );

  
  const renderLoginSection = () => {
    if (isAuthenticated) {
      return (
        <div className="flex items-center">
           <div className="flex items-center">
            <span className="mr-2">{userName}</span>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center focus:outline-none !bg-transparent"
              style={titleFontStyle}
            >
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
          </div>

          {/* Desktop user menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg py-1 z-10">
              <Menu menuType="profile" onClick={() => setShowUserMenu(false)} direction="vertical" hasAuth={true} hasUserTier={parseInt(userLevel)} />
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 !bg-transparent"
                style={titleFontStyle}
              >
                {getLocalizedText('Logout')}
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="ml-4">
          <button 
            onClick={() => window.location.href = '/login'}
            className="hidden md:block px-4 py-2 rounded-md"
            style={{
              ...titleFontStyle,
              backgroundColor: design.accentColor || '#000000',
              color: design.accentTextColor || '#ffffff'
            }}
          >
            {getLocalizedText('Login')}
          </button>
          <button 
            onClick={() => window.location.href = '/login'}
            className="md:hidden p-2 rounded-md"
            style={{
              ...titleFontStyle,
              backgroundColor: design.accentColor || '#000000',
              color: design.accentTextColor || '#ffffff'
            }}
            aria-label={getLocalizedText('Login')}
          >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          </button>
        </div>
      );
    }
  };

  // Create ordered sections based on positions
  const sections = {
    logo: { content: renderLogoSection(), position: design.logoPosition },
    menu: { content: renderMenuSection(), position: design.menuPosition },
    login: { content: renderLoginSection(), position: design.loginPosition }
  };

  // Helper function to get elements for a specific position
  const getElementsForPosition = (position: string) => {
    return Object.entries(sections)
      .filter(([_, data]) => data.position === position)
      .map(([key, data]) => <div key={key}>{data.content}</div>);
  };

  return (
    <header 
      className="flex justify-between items-center p-4 shadow-md classHeaderLinkSize classHeaderFontType classHeaderBackground"
      style={headerStyle}
    >
      <div className="flex items-center flex-grow">
        {getElementsForPosition('left')}
      </div>
      
      <div className="flex items-center justify-center">
        {getElementsForPosition('middle')}
      </div>
      
      <div className="flex items-center">
        {getElementsForPosition('right')}
      </div>
    </header>
  );
}
