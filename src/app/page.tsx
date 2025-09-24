import React from 'react';
import { Metadata } from 'next';
import GeneratedHeaderView from '../views/header';
import GeneratedHeroSectionView from '../views/hero_section';
import GeneratedOurPhilosophyView from '../views/our_philosophy';
import GeneratedFooterMenuView from '../views/footer_menu';
import GeneratedCopyrightView from '../views/copyright';

export const metadata: Metadata = { title: "Home", description: "Homepage introducing Vitalisona's sound healing philosophy and services" };

export default function Page(){
  return (
    <div className="page" style={{ minHeight: '70vh' }}>
      <main>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12">
                          <div className="w-full h-full flex flex-col">
                            <GeneratedHeaderView />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12">
                          <div className="w-full h-full flex flex-col">
                            <GeneratedHeroSectionView />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12 view-with-heading-color" style={{ backgroundColor: '#000000', color: '#4b5563', paddingLeft: '16px', paddingRight: '16px', paddingTop: '16px', paddingBottom: '16px', marginTop: '8px', marginBottom: '8px', display: 'grid', placeItems: 'center center', textAlign: 'center', justifyContent: 'center', '--heading-color': '#ffffff' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedOurPhilosophyView isContainer={false} />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '5px', paddingRight: '10px', paddingTop: '25px', paddingBottom: '10px', display: 'grid', placeItems: 'start start', textAlign: 'left', justifyContent: 'start' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedFooterMenuView />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '5px', paddingRight: '10px', paddingBottom: '25px', display: 'grid', placeItems: 'center center', textAlign: 'left', justifyContent: 'start' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedCopyrightView isContainer={false} />
                          </div>
                        </div>
                    </div>
      </main>
    </div>
  );
}
