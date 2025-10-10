import React from 'react';
import { Metadata } from 'next';
import GeneratedHeaderView from '../views/header';
import GeneratedHeroBannerView from '../views/hero_banner';
import GeneratedIntroductionView from '../views/introduction';
import GeneratedFeaturedWorkView from '../views/featured_work';
import GeneratedFooterMenuView from '../views/footer_menu';
import GeneratedSocialMediaBarView from '../views/social_media_bar';
import GeneratedCopyrightView from '../views/copyright';

export const metadata: Metadata = { title: "Home", description: "Homepage showcasing videography services and portfolio highlights" };

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
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ backgroundColor: '#000000', paddingLeft: '5px', paddingRight: '5px', paddingTop: '8px', paddingBottom: '8px', minHeight: '300px', display: 'grid', alignContent: 'center', textAlign: 'center' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedHeroBannerView />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-6 lg:col-span-6" style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '20px', display: 'grid', alignContent: 'center', textAlign: 'left' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedIntroductionView isContainer={false} />
                          </div>
                        </div>
                        <div className="h-full w-full col-span-12 md:col-span-6 lg:col-span-6" style={{ paddingLeft: '25px', paddingRight: '25px', minHeight: '600px', maxHeight: '600px', display: 'grid', alignContent: 'center', textAlign: 'center' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedFeaturedWorkView />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '5px', paddingRight: '10px', paddingTop: '15px', paddingBottom: '10px', borderTopWidth: '1px', borderTopStyle: 'solid', borderColor: '#404040', display: 'grid', alignContent: 'center', textAlign: 'center' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedFooterMenuView />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '5px', paddingBottom: '5px', display: 'grid', textAlign: 'center' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedSocialMediaBarView />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '5px', paddingRight: '10px', paddingTop: '16px', paddingBottom: '25px', marginTop: '25px', marginBottom: '8px', display: 'grid', textAlign: 'center' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedCopyrightView isContainer={false} />
                          </div>
                        </div>
                    </div>
      </main>
    </div>
  );
}
