/* 
SysArchitect Components v1.0.0
SysArchitect components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import Menu from './menu';
import { useUserStore } from '@/store/user';

interface WrappedMenuProps {
  menuType: 'header' | 'headerauth' | 'profile' | 'footer' | 'custom';
  menuIndex?: number;
  direction?: 'vertical' | 'horizontal';
}

export default function WrappedMenu({ menuType, menuIndex, direction }: WrappedMenuProps) {
  const { isAuthenticated, userLevel } = useUserStore();

  return (
    <Menu
      menuType={menuType}
      menuIndex={menuIndex}
      direction={direction}
      hasAuth={isAuthenticated}
      hasUserTier={parseInt(userLevel)}
    />
  );
}
