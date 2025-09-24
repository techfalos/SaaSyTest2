import React from 'react';
import { Metadata } from 'next';
import GeneratedHeaderView from '../../views/header';
import GeneratedClientSuccessStoriesView from '../../views/client_success_stories';
import GeneratedFooterMenuView from '../../views/footer_menu';
import GeneratedCopyrightView from '../../views/copyright';

export const metadata: Metadata = { title: "Testimonials", description: "Client testimonials and healing success stories" };

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
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12 view-with-heading-color" style={{ color: '#ffffff', paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', display: 'grid', placeItems: 'start center', textAlign: 'center', justifyContent: 'center', '--heading-color': '#ffffff' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedClientSuccessStoriesView />
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
