
'use client';

export default function CalendarIntegrationView() {
    const title = "Calendar Integration";
    const description = "// REQUIRED_SECRETS: NEXT_PUBLIC_CALENDLY_ACCESS_TOKEN

// Calendly Integration for Vitalisona
(function() {
  \'use strict\';
  
  // Configuration
  const CALENDLY_API_BASE = \'https://api.calendly.com\';
  const STORAGE_PREFIX = \'vitalisona_calendly_\';
  
  // Global state
  let calendlyAPI = null;
  let isInitialized = false;
  
  // Initialize Calendly integration
  function initializeCalendly() {
    if (isInitialized) {
      console.log(\'Calendly integration already initialized\');
      return;
    }
    
    const accessToken = window.getKey(\'NEXT_PUBLIC_CALENDLY_ACCESS_TOKEN\');
    
    if (!accessToken) {
      console.error(\'Calendly access token not configured. Please set NEXT_PUBLIC_CALENDLY_ACCESS_TOKEN\');
      return;
    }
    
    // Create Calendly API client
    calendlyAPI = new CalendlyClient(accessToken);
    isInitialized = true;
    
    console.log(\'Calendly integration initialized successfully\');
    
    // Set up periodic sync
    setupPeriodicSync();
    
    // Set up webhook listeners (if needed)
    setupWebhookHandlers();
    
    // Initial data fetch
    fetchInitialData();
  }
  
  // Calendly API Client
  function CalendlyClient(accessToken) {
    this.accessToken = accessToken;
    this.headers = {
      \'Authorization\': `Bearer ${accessToken}`,
      \'Content-Type\': \'application/json\'
    };
  }
  
  // Get user information
  CalendlyClient.prototype.getCurrentUser = async function() {
    try {
      const response = await fetch(`${CALENDLY_API_BASE}/users/me`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Calendly API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.resource;
    } catch (error) {
      console.error(\'Error fetching Calendly user:\', error);
      throw error;
    }
  };
  
  // Get event types
  CalendlyClient.prototype.getEventTypes = async function(userUri) {
    try {
      const response = await fetch(`${CALENDLY_API_BASE}/event_types?user=${encodeURIComponent(userUri)}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Calendly API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.collection;
    } catch (error) {
      console.error(\'Error fetching Calendly event types:\', error);
      throw error;
    }
  };
  
  // Get scheduled events
  CalendlyClient.prototype.getScheduledEvents = async function(userUri, options = {}) {
    try {
      const params = new URLSearchParams({
        user: userUri,
        count: options.count || 100,
        sort: options.sort || \'start_time:asc\'
      });
      
      if (options.min_start_time) {
        params.append(\'min_start_time\', options.min_start_time);
      }
      
      if (options.max_start_time) {
        params.append(\'max_start_time\', options.max_start_time);
      }
      
      const response = await fetch(`${CALENDLY_API_BASE}/scheduled_events?${params}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Calendly API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.collection;
    } catch (error) {
      console.error(\'Error fetching Calendly scheduled events:\', error);
      throw error;
    }
  };
  
  // Get event details with invitees
  CalendlyClient.prototype.getEventDetails = async function(eventUri) {
    try {
      const [eventResponse, inviteesResponse] = await Promise.all([
        fetch(`${CALENDLY_API_BASE}/scheduled_events/${eventUri.split(\'/\').pop()}`, {
          headers: this.headers
        }),
        fetch(`${CALENDLY_API_BASE}/scheduled_events/${eventUri.split(\'/\').pop()}/invitees`, {
          headers: this.headers
        })
      ]);
      
      if (!eventResponse.ok || !inviteesResponse.ok) {
        throw new Error(\'Error fetching event details\');
      }
      
      const eventData = await eventResponse.json();
      const inviteesData = await inviteesResponse.json();
      
      return {
        event: eventData.resource,
        invitees: inviteesData.collection
      };
    } catch (error) {
      console.error(\'Error fetching event details:\', error);
      throw error;
    }
  };
  
  // Fetch initial data
  async function fetchInitialData() {
    try {
      console.log(\'Fetching initial Calendly data...\');
      
      // Get current user
      const user = await calendlyAPI.getCurrentUser();
      localStorage.setItem(STORAGE_PREFIX + \'user\', JSON.stringify(user));
      
      // Get event types
      const eventTypes = await calendlyAPI.getEventTypes(user.uri);
      localStorage.setItem(STORAGE_PREFIX + \'event_types\', JSON.stringify(eventTypes));
      
      // Get upcoming scheduled events (next 30 days)
      const today = new Date().toISOString();
      const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const upcomingEvents = await calendlyAPI.getScheduledEvents(user.uri, {
        min_start_time: today,
        max_start_time: thirtyDaysLater,
        count: 50
      });
      
      localStorage.setItem(STORAGE_PREFIX + \'upcoming_events\', JSON.stringify(upcomingEvents));
      
      console.log(`Calendly data synced: ${eventTypes.length} event types, ${upcomingEvents.length} upcoming events`);
      
      // Dispatch custom event for other parts of the application
      window.dispatchEvent(new CustomEvent(\'calendlyDataSynced\', {
        detail: {
          user,
          eventTypes,
          upcomingEvents
        }
      }));
      
    } catch (error) {
      console.error(\'Error fetching initial Calendly data:\', error);
    }
  }
  
  // Set up periodic sync
  function setupPeriodicSync() {
    // Sync every 15 minutes
    setInterval(() => {
      console.log(\'Performing periodic Calendly sync...\');
      fetchInitialData();
    }, 15 * 60 * 1000);
  }
  
  // Set up webhook handlers for real-time updates
  function setupWebhookHandlers() {
    // Listen for Calendly webhook events (if webhook endpoint is configured)
    window.addEventListener(\'calendlyWebhook\', handleCalendlyWebhook);
  }
  
  // Handle Calendly webhook events
  async function handleCalendlyWebhook(event) {
    try {
      const webhookData = event.detail;
      console.log(\'Received Calendly webhook:\', webhookData);
      
      switch (webhookData.event) {
        case \'invitee.created\':
          await handleNewBooking(webhookData.payload);
          break;
        case \'invitee.canceled\':
          await handleCanceledBooking(webhookData.payload);
          break;
        default:
          console.log(\'Unhandled Calendly webhook event:\', webhookData.event);
      }
    } catch (error) {
      console.error(\'Error handling Calendly webhook:\', error);
    }
  }
  
  // Handle new booking
  async function handleNewBooking(payload) {
    try {
      console.log(\'New Calendly booking:\', payload);
      
      // Get detailed event information
      const eventDetails = await calendlyAPI.getEventDetails(payload.uri);
      
      // Store booking data
      const bookings = JSON.parse(localStorage.getItem(STORAGE_PREFIX + \'bookings\') || \'[]\');
      bookings.push({
        ...eventDetails,
        webhook_received_at: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_PREFIX + \'bookings\', JSON.stringify(bookings));
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent(\'calendlyNewBooking\', {
        detail: eventDetails
      }));
      
    } catch (error) {
      console.error(\'Error handling new Calendly booking:\', error);
    }
  }
  
  // Handle canceled booking
  async function handleCanceledBooking(payload) {
    try {
      console.log(\'Canceled Calendly booking:\', payload);
      
      // Update stored bookings
      const bookings = JSON.parse(localStorage.getItem(STORAGE_PREFIX + \'bookings\') || \'[]\');
      const updatedBookings = bookings.map(booking => {
        if (booking.event.uri === payload.uri) {
          return { ...booking, status: \'canceled\' };
        }
        return booking;
      });
      localStorage.setItem(STORAGE_PREFIX + \'bookings\', JSON.stringify(updatedBookings));
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent(\'calendlyBookingCanceled\', {
        detail: payload
      }));
      
    } catch (error) {
      console.error(\'Error handling canceled Calendly booking:\', error);
    }
  }
  
  // Public API for other scripts to use
  window.VitalisonaCalendly = {
    // Get stored data
    getUser: () => JSON.parse(localStorage.getItem(STORAGE_PREFIX + \'user\') || \'null\'),
    getEventTypes: () => JSON.parse(localStorage.getItem(STORAGE_PREFIX + \'event_types\') || \'[]\'),
    getUpcomingEvents: () => JSON.parse(localStorage.getItem(STORAGE_PREFIX + \'upcoming_events\') || \'[]\'),
    getBookings: () => JSON.parse(localStorage.getItem(STORAGE_PREFIX + \'bookings\') || \'[]\'),
    
    // Force sync
    syncData: fetchInitialData,
    
    // Check if initialized
    isInitialized: () => isInitialized,
    
    // Get API client (for advanced usage)
    getAPI: () => calendlyAPI
  };
  
  // Auto-initialize when script loads
  if (document.readyState === \'loading\') {
    document.addEventListener(\'DOMContentLoaded\', initializeCalendly);
  } else {
    initializeCalendly();
  }
  
  console.log(\'Vitalisona Calendly integration script loaded\');
})();";
    
    return (
        <div   style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', display: 'grid', placeItems: 'center center' }}>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">
                        Integration: {title}
                    </h3>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">Ready for setup</span>
                    </div>
                </div>
                {description && (
                    <p className="text-xs text-gray-600">
                        {description}
                    </p>
                )}
                <div className="mt-3 text-xs text-gray-500">
                    This integration will be configured in the application environment.
                </div>
            </div>
        </div>
    );
}