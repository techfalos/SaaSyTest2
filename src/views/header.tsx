import React from 'react';
import GeneratedLogoView_1ea5fb from './logo';
import GeneratedHeaderMenuView_fbfc22 from './header_menu';
import GeneratedHeaderIconBarView_8cef0c from './header_icon_bar';
import GeneratedHeaderBlankView_f3757a from './header_blank';

export default function GeneratedHeaderView(){
  return (
    <div className="h-full gap-4 grid  grid-flow-col relative" style={{ paddingLeft: '5px', paddingRight: '10px', paddingTop: '2px', maxHeight: '100px', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderColor: '#404040', display: 'grid' }}>
            <div className="h-full w-full col-span-8 md:col-span-10 lg:col-span-2" style={{ display: 'grid', alignContent: 'center', textAlign: 'left' }}>
              <div className="w-full h-full flex flex-col justify-center items-start">
                <GeneratedLogoView_1ea5fb />
              </div>
            </div>
            <div className="h-full w-full col-span-2 md:col-span-1 lg:col-span-7" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '24px', paddingBottom: '24px', display: 'grid', alignContent: 'center', textAlign: 'center' }}>
              <div className="w-full h-full flex flex-col justify-center items-center">
                <GeneratedHeaderMenuView_fbfc22 />
              </div>
            </div>
            <div className="h-full w-full col-span-1 md:col-span-1 lg:col-span-1" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '24px', paddingBottom: '24px', display: 'grid', alignContent: 'center', textAlign: 'right' }}>
              <div className="w-full h-full flex flex-col justify-center items-end">
                <GeneratedHeaderIconBarView_8cef0c />
              </div>
            </div>
            <div className="h-full w-full col-span-2 md:col-span-1 lg:col-span-2" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '16px', paddingBottom: '16px', marginTop: '8px', marginBottom: '8px', display: 'grid', alignContent: 'center', textAlign: 'left' }}>
              <div className="w-full h-full flex flex-col justify-center items-start">
                <GeneratedHeaderBlankView_f3757a isContainer={true} />
              </div>
            </div>
    </div>
  );
}