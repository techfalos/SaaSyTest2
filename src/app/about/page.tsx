import React from 'react';
import { Metadata } from 'next';
import GeneratedHeaderView from '../../views/header';
import GeneratedMyStoryView from '../../views/my_story';
import GeneratedMyApproachView from '../../views/my_approach';
import GeneratedEquipmentToolsView from '../../views/equipment_tools';
import GeneratedFooterMenuView from '../../views/footer_menu';
import GeneratedSocialMediaBarView from '../../views/social_media_bar';
import GeneratedCopyrightView from '../../views/copyright';

export const metadata: Metadata = { title: "About", description: "About the videographer and their approach to filmmaking" };

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
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '20px', display: 'grid', alignContent: 'start', textAlign: 'left' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedMyStoryView isContainer={false} />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '20px', display: 'grid', alignContent: 'start', textAlign: 'left' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedMyApproachView isContainer={false} />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '20px', display: 'grid', alignContent: 'start', textAlign: 'left' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedEquipmentToolsView isContainer={false} />
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
