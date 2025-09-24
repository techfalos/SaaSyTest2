import React from 'react';
import GeneratedLogoView_4e1b3c from './logo';
import GeneratedHeaderAdminView_d4a45d from './header_admin';
import GeneratedHeaderIconBarAdminView_1e95a6 from './header_icon_bar_admin';
import GeneratedHeaderLoginView_425e07 from './header_login';

export default function GeneratedHeaderAdminContainerView(){
  return (
    <div className="h-full gap-4 grid  grid-flow-col relative" style={{ paddingLeft: '5px', paddingRight: '10px', paddingTop: '2px', display: 'grid', placeItems: 'center center' }}>
            <div className="h-full w-full col-span-8 md:col-span-10 lg:col-span-2" style={{ backgroundColor: '#000000', paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', display: 'grid', placeItems: 'center start', textAlign: 'left', justifyContent: 'start' }}>
              <div className="w-full h-full flex flex-col justify-center items-start">
                <GeneratedLogoView_4e1b3c />
              </div>
            </div>
            <div className="h-full w-full col-span-2 md:col-span-1 lg:col-span-7" style={{ display: 'grid', placeItems: 'center center', textAlign: 'center', justifyContent: 'center' }}>
              <div className="w-full h-full flex flex-col justify-center items-center">
                <GeneratedHeaderAdminView_d4a45d />
              </div>
            </div>
            <div className="h-full w-full col-span-1 md:col-span-1 lg:col-span-1" style={{ display: 'grid', placeItems: 'center end', textAlign: 'right', justifyContent: 'end' }}>
              <div className="w-full h-full flex flex-col justify-center items-end">
                <GeneratedHeaderIconBarAdminView_1e95a6 />
              </div>
            </div>
            <div className="h-full w-full col-span-2 md:col-span-1 lg:col-span-2" style={{ backgroundColor: '#000000', paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', display: 'grid', placeItems: 'center start', textAlign: 'left', justifyContent: 'start' }}>
              <div className="w-full h-full flex flex-col justify-center items-start">
                <GeneratedHeaderLoginView_425e07 />
              </div>
            </div>
    </div>
  );
}