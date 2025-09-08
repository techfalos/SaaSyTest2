import React from 'react';
import HeroTextView from '@/views/Hero_Text';

export default function HeroBannerView() {
    return (
   
            <div className="w-full">
        <div className="h-full gap-4 grid  grid-flow-col relative">
            <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ display: 'grid', placeItems: 'center center' , backgroundColor: '#FFF', opacity: 0.8 }}>
                <div className="w-full">
                    <HeroTextView />
                </div>
            </div>
        </div>
            </div>
    );
}