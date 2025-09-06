import React from 'react';
import LogoView from '@/views/Logo';
import HeaderMenuView from '@/views/Header_Menu';
import HeaderIconBarView from '@/views/Header_Icon_Bar';
import HeaderLoginView from '@/views/Header_Login';

export default function HeaderView() {
    return (
   
            <div className="w-full">
        <div className="h-full gap-4 grid  grid-flow-col relative">
            <div className="h-full w-full col-span-8 md:col-span-10 lg:col-span-2" style={{ display: 'grid', placeItems: 'center start', textAlign: 'left', justifyContent: 'start' }}>
                <div className="w-full">
                    <LogoView />
                </div>
            </div>
            <div className="h-full w-full col-span-2 md:col-span-1 lg:col-span-7" style={{ display: 'grid', placeItems: 'center center', textAlign: 'center', justifyContent: 'center' }}>
                <div className="w-full">
                    <HeaderMenuView />
                </div>
            </div>
            <div className="h-full w-full col-span-1 md:col-span-1 lg:col-span-1" style={{ display: 'grid', placeItems: 'center end', textAlign: 'right', justifyContent: 'end' }}>
                <div className="w-full">
                    <HeaderIconBarView />
                </div>
            </div>
            <div className="h-full w-full col-span-2 md:col-span-1 lg:col-span-2" style={{ display: 'grid', placeItems: 'center end', textAlign: 'right', justifyContent: 'end' }}>
                <div className="w-full">
                    <HeaderLoginView />
                </div>
            </div>
        </div>
            </div>
    );
}