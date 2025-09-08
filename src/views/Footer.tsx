import React from 'react';
import AnalyticsTrackingView from '@/views/Analytics_Tracking';
import FooterMenuView from '@/views/Footer_Menu';
import CopyrightView from '@/views/Copyright';

export default function FooterView() {
    return (
   
            <div className="w-full">
        <div className="h-full gap-4 grid  grid-flow-col relative">
            <div className="h-full w-full col-span-4 md:col-span-4 lg:col-span-4" style={{ paddingLeft: '5px', paddingRight: '5px', paddingTop: '5px', paddingBottom: '5px', display: 'grid', placeItems: 'center center' }}>
                <div className="w-full">
                    <AnalyticsTrackingView />
                </div>
            </div>
            <div className="h-full w-full col-span-4 md:col-span-4 lg:col-span-4" style={{ display: 'grid', placeItems: 'center center' }}>
                <div className="w-full">
                    <FooterMenuView />
                </div>
            </div>
            <div className="h-full w-full col-span-4 md:col-span-4 lg:col-span-4" style={{ display: 'grid', placeItems: 'center center', textAlign: 'right', justifyContent: 'end' , backgroundColor: '#FFF'}}>
                <div className="w-full">
                    <CopyrightView />
                </div>
            </div>
        </div>
            </div>
    );
}