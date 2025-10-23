import React from 'react';
import GeneratedLogoView_f080cb from './logo';
import GeneratedHeaderLoggedInView_98d8e6 from './header_logged_in';
import GeneratedHeaderIconBarLoggedInView_84a747 from './header_icon_bar_logged_in';
import GeneratedHeaderLoginView_f3cf76 from './header_login';

export default function GeneratedHeaderLoggedInContainerView(){
  return (
    <div className="h-full gap-4 grid  grid-flow-col relative" style={{ paddingLeft: '5px', paddingRight: '10px', paddingTop: '2px' }}>
            <div className="h-full w-full col-span-8 md:col-span-10 lg:col-span-2" style={{ alignContent: 'center', textAlign: 'left' }}>
              <div className="w-full h-full flex flex-col justify-center items-start">
                <GeneratedLogoView_f080cb />
              </div>
            </div>
            <div className="h-full w-full col-span-2 md:col-span-1 lg:col-span-7" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '24px', paddingBottom: '24px', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderColor: '#404040', alignContent: 'center', textAlign: 'center' }}>
              <div className="w-full h-full flex flex-col justify-center items-center">
                <GeneratedHeaderLoggedInView_98d8e6 />
              </div>
            </div>
            <div className="h-full w-full col-span-1 md:col-span-1 lg:col-span-1" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '24px', paddingBottom: '24px', alignContent: 'center', textAlign: 'right' }}>
              <div className="w-full h-full flex flex-col justify-center items-end">
                <GeneratedHeaderIconBarLoggedInView_84a747 />
              </div>
            </div>
            <div className="h-full w-full col-span-2 md:col-span-1 lg:col-span-2" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '24px', paddingBottom: '24px', alignContent: 'center', textAlign: 'left' }}>
              <div className="w-full h-full flex flex-col justify-center items-start">
                <GeneratedHeaderLoginView_f3cf76 />
              </div>
            </div>
    </div>
  );
}