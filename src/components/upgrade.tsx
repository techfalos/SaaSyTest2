/* 
SysArchitect Components v1.0.0
SysArchitect components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import { useRouter } from 'next/navigation';

interface UpgradeProps {
  featureName?: string;
}

export function Upgrade({ featureName = 'this feature' }: UpgradeProps) {
  const router = useRouter();

  return (
    <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Upgrade Required
      </h2>
      <p className="text-gray-600 mb-6">
        You need to upgrade your account to access {featureName}.
      </p>
      <button
        onClick={() => router.push('/pricing')}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 classButtonRounding classButtonBackground classButtonFontType classButtonFontSize"
      >
        View Pricing Plans
      </button>
    </div>
  );
}
