import React from 'react';
import { Metadata } from 'next';
import GeneratedHeaderAdminContainerView from '../../views/header_admin_container';
import GeneratedOrderManagerView from '../../views/order_manager';
import GeneratedFooterMenuView from '../../views/footer_menu';
import GeneratedSocialMediaBarView from '../../views/social_media_bar';
import GeneratedCopyrightView from '../../views/copyright';

export const metadata: Metadata = { title: "Order Mgmt", description: "Manage customer orders and fulfillment" };

export default function Page(){
  return (
    <div className="page" style={{ minHeight: '70vh' }}>
      <main>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12">
                            <GeneratedHeaderAdminContainerView />
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ marginLeft: '25px', marginRight: '25px', marginTop: '25px', marginBottom: '25px', alignContent: 'start', textAlign: 'left' }}>
                            <GeneratedOrderManagerView />
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '5px', paddingRight: '10px', paddingTop: '15px', paddingBottom: '10px', borderTopWidth: '1px', borderTopStyle: 'solid', borderColor: '#404040', alignContent: 'center', textAlign: 'center' }}>
                            <GeneratedFooterMenuView />
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '5px', paddingBottom: '5px', textAlign: 'center' }}>
                            <GeneratedSocialMediaBarView />
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '5px', paddingRight: '10px', paddingTop: '16px', paddingBottom: '25px', marginTop: '25px', marginBottom: '8px', textAlign: 'center' }}>
                            <GeneratedCopyrightView isContainer={false} />
                        </div>
                    </div>
      </main>
    </div>
  );
}
