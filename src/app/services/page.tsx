import React from 'react';
import { Metadata } from 'next';
import GeneratedHeaderView from '../../views/header';
import GeneratedServicesCatalogView from '../../views/services_catalog';
import GeneratedFooterMenuView from '../../views/footer_menu';
import GeneratedCopyrightView from '../../views/copyright';

export const metadata: Metadata = { title: "Services", description: "Overview of all sound healing services offered" };

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
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', display: 'grid', placeItems: 'start center' }}>
                          <div className="w-full">
                            <GeneratedServicesCatalogView />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '5px', paddingRight: '10px', paddingTop: '25px', paddingBottom: '10px', display: 'grid', placeItems: 'start start' }}>
                          <div className="w-full">
                            <GeneratedFooterMenuView />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '5px', paddingRight: '10px', paddingBottom: '25px', display: 'grid', placeItems: 'center center' }}>
                          <div className="w-full">
                            <GeneratedCopyrightView isContainer={false} />
                          </div>
                        </div>
                    </div>
      </main>
    </div>
  );
}
