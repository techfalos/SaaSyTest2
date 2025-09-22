import React from 'react';
import GeneratedLogoView_4e1b3c from './logo';
import GeneratedHeaderMenuView_825d5e from './header_menu';
import GeneratedHeaderIconBarView_2c87a2 from './header_icon_bar';
import GeneratedHeaderLoginView_425e07 from './header_login';

export default function GeneratedHeaderView(){
  return (
    <div className="h-full gap-4 grid  grid-flow-col relative" style={{ backgroundColor: '#000000', paddingLeft: '5px', paddingRight: '10px', paddingTop: '2px', maxHeight: '100px', display: 'grid', placeItems: 'center center' }}>
            <div className="h-full w-full col-span-8 md:col-span-10 lg:col-span-2" style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', display: 'grid', placeItems: 'center start', textAlign: 'left', justifyContent: 'start' }}>
              <div className="w-full">
                <GeneratedLogoView_4e1b3c />
              </div>
            </div>
            <div className="h-full w-full col-span-2 md:col-span-1 lg:col-span-7" style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', display: 'grid', placeItems: 'center center', textAlign: 'center', justifyContent: 'center' }}>
              <div className="w-full">
                <GeneratedHeaderMenuView_825d5e />
              </div>
            </div>
            <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-1" style={{ display: 'grid', placeItems: 'center end', textAlign: 'right', justifyContent: 'end' }}>
              <div className="w-full">
                <GeneratedHeaderIconBarView_2c87a2 />
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