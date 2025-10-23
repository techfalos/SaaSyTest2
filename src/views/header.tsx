import React from 'react';
import GeneratedLogoView_f080cb from './logo';
import GeneratedHeaderMenuView_b9438c from './header_menu';
import GeneratedHeaderIconBarView_38914c from './header_icon_bar';
import GeneratedHeaderLoginView_f3cf76 from './header_login';

export default function GeneratedHeaderView(){
  return (
    <div className="h-full gap-4 grid  grid-flow-col relative" style={{ paddingLeft: '5px', paddingRight: '10px', paddingTop: '2px', maxHeight: '100px', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderColor: '#404040' }}>
            <div className="h-full w-full col-span-8 md:col-span-10 lg:col-span-2" style={{ alignContent: 'center', textAlign: 'left' }}>
              <div className="w-full h-full flex flex-col justify-center items-start">
                <GeneratedLogoView_f080cb />
              </div>
            </div>
            <div className="h-full w-full col-span-2 md:col-span-1 lg:col-span-7" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '24px', paddingBottom: '24px', alignContent: 'center', textAlign: 'center' }}>
              <div className="w-full h-full flex flex-col justify-center items-center">
                <GeneratedHeaderMenuView_b9438c />
              </div>
            </div>
            <div className="h-full w-full col-span-1 md:col-span-1 lg:col-span-1" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '24px', paddingBottom: '24px', alignContent: 'center', textAlign: 'right' }}>
              <div className="w-full h-full flex flex-col justify-center items-end">
                <GeneratedHeaderIconBarView_38914c />
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