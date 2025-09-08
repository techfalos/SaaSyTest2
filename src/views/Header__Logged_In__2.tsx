import React from 'react';
import LogoView from '@/views/Logo';
import HeaderLoggedInView from '@/views/Header__Logged_In_';
import HeaderIconBarLoggedInView from '@/views/Header_Icon_Bar__Logged_In_';
import HeaderLoginView from '@/views/Header_Login';

export default function HeaderLoggedIn2View() {
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
                    <HeaderLoggedInView />
                </div>
            </div>
            <div className="h-full w-full col-span-1 md:col-span-1 lg:col-span-1" style={{ display: 'grid', placeItems: 'center end', textAlign: 'right', justifyContent: 'end' }}>
                <div className="w-full">
                    <HeaderIconBarLoggedInView />
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