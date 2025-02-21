/* 
SysArchitect Components v1.0.0
SysArchitect components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import Menu from "./menu";
import { useUserStore } from '@/store/user';

interface FooterProps {
  companyName: string;
}

export default function Footer({ companyName }: FooterProps) {
  const { isAuthenticated, userLevel } = useUserStore();

  return (
    <footer className="py-8 mt-auto classFooterBackground classFooterLinkSize">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Menu 
            menuType="footer" 
            direction="horizontal"
            hasAuth={isAuthenticated}
            hasUserTier={parseInt(userLevel)}
          />
        
          <div className="text-gray-600 text-sm">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
