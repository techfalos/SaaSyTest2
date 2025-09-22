import React from 'react';
import { Metadata } from 'next';
import GeneratedHeaderView from '../views/header';
import GeneratedHeroSectionView from '../views/hero_section';
import GeneratedOurPhilosophyView from '../views/our_philosophy';
import GeneratedFeaturedServicesPreviewView from '../views/featured_services_preview';
import GeneratedFooterMenuView from '../views/footer_menu';
import GeneratedCopyrightView from '../views/copyright';

export const metadata: Metadata = { title: "Home", description: "Homepage introducing Vitalisona's sound healing philosophy and services" };

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
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ backgroundImage: 'url(/images/948d5737-c30c-4b42-b912-52c9ed2c2ecf.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '500px', display: 'grid', placeItems: 'center center' }}>
                          <div className="w-full">
                            <GeneratedHeroSectionView />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ backgroundColor: '#000000', color: '#4b5563', paddingLeft: '16px', paddingRight: '16px', paddingTop: '16px', paddingBottom: '16px', marginTop: '8px', marginBottom: '8px', display: 'grid', placeItems: 'center start' }}>
                          <div className="w-full">
                            <GeneratedOurPhilosophyView isContainer={false} />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ backgroundColor: '#f3f4f6', color: '#1f2937', paddingLeft: '16px', paddingRight: '16px', paddingTop: '16px', paddingBottom: '16px', marginTop: '8px', marginBottom: '8px', display: 'grid', placeItems: 'center center' }}>
                          <div className="w-full">
                            <GeneratedFeaturedServicesPreviewView />
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
