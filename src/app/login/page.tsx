import React from 'react';
import { Metadata } from 'next';
import GeneratedHeaderView from '../../views/header';
import GeneratedLoginviewView from '../../views/loginview';

export const metadata: Metadata = { title: "Login", description: "User login page" };

export default function Page(){
  return (
    <div className="page" style={{ minHeight: '70vh' }}>
      <main>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ backgroundColor: '#000000', paddingLeft: '5px', paddingRight: '10px', paddingTop: '2px', maxHeight: '100px', display: 'grid', placeItems: 'center center' }}>
                          <div className="w-full">
                            <GeneratedHeaderView />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ display: 'grid', placeItems: 'center center' }}>
                          <div className="w-full">
                            <GeneratedLoginviewView />
                          </div>
                        </div>
                    </div>
      </main>
    </div>
  );
}
