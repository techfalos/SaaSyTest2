import React from 'react';
import { Metadata } from 'next';
import GeneratedHeaderLoggedInContainerView from '../../views/header_logged_in_container';
import GeneratedAppointmentBookingView from '../../views/appointment_booking';
import GeneratedCalendarIntegrationView from '../../views/calendar_integration';
import GeneratedFooterMenuView from '../../views/footer_menu';
import GeneratedCopyrightView from '../../views/copyright';

export const metadata: Metadata = { title: "Book Session", description: "Session booking and appointment scheduling" };

export default function Page(){
  return (
    <div className="page" style={{ minHeight: '70vh' }}>
      <main>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12">
                          <div className="w-full h-full flex flex-col">
                            <GeneratedHeaderLoggedInContainerView />
                          </div>
                        </div>
                    </div>

                    <div className="h-full gap-4 grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-8" style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', display: 'grid', placeItems: 'start start', textAlign: 'left', justifyContent: 'start' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedAppointmentBookingView />
                          </div>
                        </div>
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-4" style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', display: 'grid', placeItems: 'start center', textAlign: 'center', justifyContent: 'center' }}>
                          <div className="w-full h-full flex flex-col">
                            <GeneratedCalendarIntegrationView />
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
