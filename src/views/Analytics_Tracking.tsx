
'use client';

export default function AnalyticsTrackingView() {
    const title = "Analytics Tracking";
    const description = "// REQUIRED_SECRETS: NEXT_PUBLIC_GA_MEASUREMENT_ID

// Google Analytics 4 Integration for Zizzle
(function() {
  \'use strict\';
  
  // Get GA4 Measurement ID from secrets
  const measurementId = window.getKey(\'NEXT_PUBLIC_GA_MEASUREMENT_ID\');
  
  if (!measurementId) {
    console.error(\'Zizzle GA4: Google Analytics Measurement ID not configured\');
    return;
  }
  
  // Validate measurement ID format (should start with G-)
  if (!measurementId.startsWith(\'G-\')) {
    console.error(\'Zizzle GA4: Invalid measurement ID format. Expected G-XXXXXXXXXX\');
    return;
  }
  
  console.log(\'Zizzle GA4: Initializing Google Analytics with ID:\', measurementId);
  
  // Create and load Google Analytics script
  const script = document.createElement(\'script\');
  script.async = true;
  script.src = \'https://www.googletagmanager.com/gtag/js?id=\' + measurementId;
  script.onerror = function() {
    console.error(\'Zizzle GA4: Failed to load Google Analytics script\');
  };
  document.head.appendChild(script);
  
  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;
  
  // Configure Google Analytics
  gtag(\'js\', new Date());
  gtag(\'config\', measurementId, {
    // Enhanced measurement settings
    page_title: document.title,
    page_location: window.location.href,
    // Privacy settings
    anonymize_ip: true,
    // Custom settings for Zizzle
    custom_map: {
      \'custom_parameter_1\': \'zizzle_user_type\',
      \'custom_parameter_2\': \'zizzle_feature_used\'
    }
  });
  
  // Enhanced tracking functions for Zizzle
  window.zizzleAnalytics = {
    // Track page views
    trackPageView: function(pageName, additionalParams = {}) {
      gtag(\'config\', measurementId, {
        page_title: pageName || document.title,
        page_location: window.location.href,
        ...additionalParams
      });
      console.log(\'Zizzle GA4: Page view tracked -\', pageName || document.title);
    },
    
    // Track custom events
    trackEvent: function(eventName, parameters = {}) {
      gtag(\'event\', eventName, {
        event_category: \'Zizzle\',
        event_label: parameters.label || \'\',
        value: parameters.value || 0,
        ...parameters
      });
      console.log(\'Zizzle GA4: Event tracked -\', eventName, parameters);
    },
    
    // Track user engagement
    trackEngagement: function(engagementType, details = {}) {
      gtag(\'event\', \'engagement\', {
        event_category: \'Zizzle_Engagement\',
        engagement_type: engagementType,
        engagement_time_msec: details.duration || 0,
        ...details
      });
      console.log(\'Zizzle GA4: Engagement tracked -\', engagementType, details);
    },
    
    // Track conversions
    trackConversion: function(conversionName, value = 0, currency = \'USD\') {
      gtag(\'event\', \'conversion\', {
        event_category: \'Zizzle_Conversion\',
        transaction_id: \'zizzle_\' + Date.now(),
        value: value,
        currency: currency,
        items: [{
          item_id: conversionName,
          item_name: conversionName,
          category: \'Zizzle_Action\',
          quantity: 1,
          price: value
        }]
      });
      console.log(\'Zizzle GA4: Conversion tracked -\', conversionName, value, currency);
    },
    
    // Set user properties
    setUserProperties: function(properties) {
      gtag(\'config\', measurementId, {
        user_properties: properties
      });
      console.log(\'Zizzle GA4: User properties set -\', properties);
    }
  };
  
  // Auto-track common Zizzle events
  document.addEventListener(\'DOMContentLoaded\', function() {
    // Track initial page load
    window.zizzleAnalytics.trackPageView(\'Zizzle App Load\');
    
    // Track clicks on important elements
    document.addEventListener(\'click\', function(event) {
      const target = event.target;
      
      // Track button clicks
      if (target.tagName === \'BUTTON\' || target.type === \'button\') {
        const buttonText = target.textContent || target.value || \'Unknown Button\';
        window.zizzleAnalytics.trackEvent(\'button_click\', {
          button_text: buttonText,
          button_id: target.id || \'no_id\',
          page_location: window.location.pathname
        });
      }
      
      // Track link clicks
      if (target.tagName === \'A\' && target.href) {
        const isExternal = !target.href.includes(window.location.hostname);
        window.zizzleAnalytics.trackEvent(\'link_click\', {
          link_url: target.href,
          link_text: target.textContent || \'Unknown Link\',
          is_external: isExternal,
          page_location: window.location.pathname
        });
      }
    });
    
    // Track form submissions
    document.addEventListener(\'submit\', function(event) {
      const form = event.target;
      if (form.tagName === \'FORM\') {
        window.zizzleAnalytics.trackEvent(\'form_submit\', {
          form_id: form.id || \'no_id\',
          form_action: form.action || \'no_action\',
          page_location: window.location.pathname
        });
      }
    });
    
    // Track scroll depth
    let maxScrollDepth = 0;
    let scrollTimeout;
    
    window.addEventListener(\'scroll\', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        const scrollDepth = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
        if (scrollDepth > maxScrollDepth && scrollDepth <= 100) {
          maxScrollDepth = scrollDepth;
          
          // Track milestone scroll depths
          if (scrollDepth >= 25 && scrollDepth < 50 && maxScrollDepth >= 25) {
            window.zizzleAnalytics.trackEvent(\'scroll_depth\', {
              scroll_depth: \'25%\',
              page_location: window.location.pathname
            });
          } else if (scrollDepth >= 50 && scrollDepth < 75 && maxScrollDepth >= 50) {
            window.zizzleAnalytics.trackEvent(\'scroll_depth\', {
              scroll_depth: \'50%\',
              page_location: window.location.pathname
            });
          } else if (scrollDepth >= 75 && scrollDepth < 100 && maxScrollDepth >= 75) {
            window.zizzleAnalytics.trackEvent(\'scroll_depth\', {
              scroll_depth: \'75%\',
              page_location: window.location.pathname
            });
          } else if (scrollDepth >= 100 && maxScrollDepth >= 100) {
            window.zizzleAnalytics.trackEvent(\'scroll_depth\', {
              scroll_depth: \'100%\',
              page_location: window.location.pathname
            });
          }
        }
      }, 250);
    });
    
    console.log(\'Zizzle GA4: Auto-tracking events initialized\');
  });
  
  // Track page visibility changes
  document.addEventListener(\'visibilitychange\', function() {
    if (document.hidden) {
      window.zizzleAnalytics.trackEvent(\'page_hidden\', {
        page_location: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    } else {
      window.zizzleAnalytics.trackEvent(\'page_visible\', {
        page_location: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // Track session duration on page unload
  const sessionStartTime = Date.now();
  window.addEventListener(\'beforeunload\', function() {
    const sessionDuration = Date.now() - sessionStartTime;
    window.zizzleAnalytics.trackEngagement(\'session_duration\', {
      duration: sessionDuration,
      page_location: window.location.pathname
    });
  });
  
  // Error tracking
  window.addEventListener(\'error\', function(event) {
    window.zizzleAnalytics.trackEvent(\'javascript_error\', {
      error_message: event.message || \'Unknown error\',
      error_filename: event.filename || \'Unknown file\',
      error_line: event.lineno || 0,
      error_column: event.colno || 0,
      page_location: window.location.pathname
    });
  });
  
  console.log(\'Zizzle GA4: Google Analytics 4 integration fully initialized\');
  console.log(\'Zizzle GA4: Available methods:\', Object.keys(window.zizzleAnalytics));
  
})();";
    
    return (
        <div   style={{ paddingLeft: '5px', paddingRight: '5px', paddingTop: '5px', paddingBottom: '5px', display: 'grid', placeItems: 'center center' }}>
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