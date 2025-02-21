/* 
SysArchitect Components v1.0.0
SysArchitect components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import Link from 'next/link';

interface BreadcrumbProps {
  breadcrumbs: Array<{title: string, link: string}>;
}

export default function Breadcrumb({ breadcrumbs }: BreadcrumbProps) {
  // Don't render anything if there's only one breadcrumb
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.link} className="inline-flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {crumb.link.includes('[id]') ? (
              <span className="text-sm font-medium text-gray-500">
                {crumb.title}
              </span>
            ) : (
              <Link 
                href={crumb.link}
                className={`inline-flex items-center text-sm font-medium ${
                  index === breadcrumbs.length - 1 
                    ? 'text-gray-500 cursor-default'
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                {crumb.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}