import React from 'react';
import GeneratedLogoView_4e1b3c from './logo';
import GeneratedHeaderIconBarLoggedInView_5af037 from './header_icon_bar_logged_in';
import GeneratedHeaderLoginView_425e07 from './header_login';

export default function GeneratedHeaderLoggedInView_1ecf7e(){
  return (
    <div className="h-full gap-4 grid  grid-flow-col relative" style={{ paddingLeft: '5px', paddingRight: '10px', paddingTop: '2px', display: 'grid', placeItems: 'center center' }}>
            <div className="h-full w-full col-span-8 md:col-span-10 lg:col-span-2" style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', display: 'grid', placeItems: 'center start', textAlign: 'left', justifyContent: 'start' }}>
              <div className="w-full">
                <GeneratedLogoView_4e1b3c />
              </div>
            </div>
            {/* WARNING: Circular reference detected - view would import itself */}
            <div className="h-full w-full col-span-2 md:col-span-1 lg:col-span-7">
              <div className="w-full p-4 text-center text-gray-500">
                <p className="text-sm">Circular reference prevented</p>
                <p className="text-xs mt-1">Container and subview generate same file: header_logged_in.tsx</p>
              </div>
            </div>
            <div className="h-full w-full col-span-1 md:col-span-1 lg:col-span-1" style={{ display: 'grid', placeItems: 'center end', textAlign: 'right', justifyContent: 'end' }}>
              <div className="w-full">
                <GeneratedHeaderIconBarLoggedInView_5af037 />
              </div>
            </div>
            <div className="h-full w-full col-span-2 md:col-span-1 lg:col-span-2" style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', display: 'grid', placeItems: 'center start', textAlign: 'left', justifyContent: 'start' }}>
              <div className="w-full">
                <GeneratedHeaderLoginView_425e07 />
              </div>
            </div>
    </div>
  );
}