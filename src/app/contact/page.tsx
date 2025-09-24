import React from 'react';
import { Metadata } from 'next';
import GeneratedHeaderView from '../../views/header';
import GeneratedContactFormView from '../../views/contact_form';
import GeneratedContactInformationView from '../../views/contact_information';
import GeneratedLocationMapView from '../../views/location_map';
import GeneratedFooterMenuView from '../../views/footer_menu';
import GeneratedCopyrightView from '../../views/copyright';

export const metadata: Metadata = { title: "Contact", description: "Contact information and location details" };

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
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-6" style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', display: 'grid', placeItems: 'start start', textAlign: 'left', justifyContent: 'start' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedContactFormView />
                          </div>
                        </div>
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-6" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '16px', paddingBottom: '16px', marginTop: '8px', marginBottom: '8px', display: 'grid', placeItems: 'start start', textAlign: 'left', justifyContent: 'start' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedContactInformationView isContainer={false} />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', display: 'grid', placeItems: 'start center', textAlign: 'center', justifyContent: 'center' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedLocationMapView />
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
