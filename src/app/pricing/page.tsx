import React from 'react';
import { Metadata } from 'next';
import GeneratedHeaderView from '../../views/header';
import GeneratedPricingOverviewView from '../../views/pricing_overview';
import GeneratedWeddingPackagesView from '../../views/wedding_packages';
import GeneratedCorporateRatesView from '../../views/corporate_rates';
import GeneratedAddOnServicesView from '../../views/add_on_services';
import GeneratedFooterMenuView from '../../views/footer_menu';
import GeneratedSocialMediaBarView from '../../views/social_media_bar';
import GeneratedCopyrightView from '../../views/copyright';

export const metadata: Metadata = { title: "Pricing", description: "Pricing information for videography services" };

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
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '20px', display: 'grid', alignContent: 'start', textAlign: 'center' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedPricingOverviewView isContainer={false} />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '20px', display: 'grid', alignContent: 'start', textAlign: 'left' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedWeddingPackagesView isContainer={false} />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '20px', display: 'grid', alignContent: 'start', textAlign: 'left' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedCorporateRatesView isContainer={false} />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '20px', display: 'grid', alignContent: 'start', textAlign: 'left' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedAddOnServicesView isContainer={false} />
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
