
'use client';

export default function AnalyticsTrackingView() {
    const title = "Analytics Tracking";
    const description = "// REQUIRED_SECRETS: GA_MEASUREMENT_ID

// Google Analytics 4 Integration for Eloise Co
(function() {
  \'use strict\';
  
  // Get the Google Analytics Measurement ID
  const measurementId = window.getKey(\'GA_MEASUREMENT_ID\');
  
  if (!measurementId) {
    console.error(\'[Eloise Co - GA4] Google Analytics Measurement ID not configured. Please add GA_MEASUREMENT_ID secret.\');
    return;
  }
  
  // Validate measurement ID format (should start with G-)
  if (!measurementId.startsWith(\'G-\')) {
    console.error(\'[Eloise Co - GA4] Invalid Google Analytics Measurement ID format. Expected format: G-XXXXXXXXXX\');
    return;
  }
  
  // Check if GA4 is already loaded to prevent duplicate initialization
  if (window.gtag && window.dataLayer) {
    console.warn(\'[Eloise Co - GA4] Google Analytics already initialized\');
    return;
  }
  
  console.log(\'[Eloise Co - GA4] Initializing Google Analytics 4 with ID:\', measurementId);
  
  // Load Google Analytics 4 script
  const gaScript = document.createElement(\'script\');
  gaScript.async = true;
  gaScript.src = \'https://www.googletagmanager.com/gtag/js?id=\' + measurementId;
  gaScript.onerror = function() {
    console.error(\'[Eloise Co - GA4] Failed to load Google Analytics script\');
  };
  
  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;
  
  // Configure Google Analytics
  gtag(\'js\', new Date());
  gtag(\'config\', measurementId, {
    // Enhanced measurement features
    send_page_view: true,
    allow_google_signals: true,
    allow_ad_personalization_signals: true,
    // Custom configuration for Eloise Co
    custom_map: {
      \'custom_parameter_1\': \'ecommerce_category\',
      \'custom_parameter_2\': \'user_type\'
    }
  });
  
  // Enhanced ecommerce tracking setup
  function trackPurchase(transactionId, value, currency, items) {
    gtag(\'event\', \'purchase\', {
      transaction_id: transactionId,
      value: value,
      currency: currency || \'USD\',
      items: items
    });
  }
  
  function trackViewItem(itemId, itemName, category, value) {
    gtag(\'event\', \'view_item\', {
      currency: \'USD\',
      value: value,
      items: [{
        item_id: itemId,
        item_name: itemName,
        item_category: category,
        quantity: 1,
        price: value
      }]
    });
  }
  
  function trackAddToCart(itemId, itemName, category, value, quantity) {
    gtag(\'event\', \'add_to_cart\', {
      currency: \'USD\',
      value: value,
      items: [{
        item_id: itemId,
        item_name: itemName,
        item_category: category,
        quantity: quantity || 1,
        price: value
      }]
    });
  }
  
  function trackBeginCheckout(value, currency, items) {
    gtag(\'event\', \'begin_checkout\', {
      currency: currency || \'USD\',
      value: value,
      items: items
    });
  }
  
  // Custom events for Eloise Co
  function trackCustomEvent(eventName, parameters) {
    gtag(\'event\', eventName, parameters);
  }
  
  // Set user properties
  function setUserProperties(properties) {
    gtag(\'config\', measurementId, {
      user_properties: properties
    });
  }
  
  // Track page views for SPA navigation
  function trackPageView(pageTitle, pagePath) {
    gtag(\'config\', measurementId, {
      page_title: pageTitle,
      page_location: window.location.href,
      page_path: pagePath || window.location.pathname
    });
  }
  
  // Make tracking functions available globally for Eloise Co
  window.EloiseGA = {
    trackPurchase: trackPurchase,
    trackViewItem: trackViewItem,
    trackAddToCart: trackAddToCart,
    trackBeginCheckout: trackBeginCheckout,
    trackCustomEvent: trackCustomEvent,
    setUserProperties: setUserProperties,
    trackPageView: trackPageView,
    // Direct access to gtag for advanced users
    gtag: gtag
  };
  
  // Auto-track scroll depth
  let scrollDepthTracked = {};
  function trackScrollDepth() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent >= 25 && !scrollDepthTracked[\'25\']) {
      gtag(\'event\', \'scroll\', { percent_scrolled: 25 });
      scrollDepthTracked[\'25\'] = true;
    }
    if (scrollPercent >= 50 && !scrollDepthTracked[\'50\']) {
      gtag(\'event\', \'scroll\', { percent_scrolled: 50 });
      scrollDepthTracked[\'50\'] = true;
    }
    if (scrollPercent >= 75 && !scrollDepthTracked[\'75\']) {
      gtag(\'event\', \'scroll\', { percent_scrolled: 75 });
      scrollDepthTracked[\'75\'] = true;
    }
    if (scrollPercent >= 90 && !scrollDepthTracked[\'90\']) {
      gtag(\'event\', \'scroll\', { percent_scrolled: 90 });
      scrollDepthTracked[\'90\'] = true;
    }
  }
  
  // Set up scroll tracking after page load
  gaScript.onload = function() {
    console.log(\'[Eloise Co - GA4] Google Analytics 4 loaded successfully\');
    
    // Enable scroll depth tracking
    let scrollTimer = null;
    window.addEventListener(\'scroll\', function() {
      if (scrollTimer !== null) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(trackScrollDepth, 150);
    });
    
    // Track file downloads
    document.addEventListener(\'click\', function(event) {
      const link = event.target.closest(\'a\');
      if (link && link.href) {
        const fileExtension = link.href.split(\'.\').pop().toLowerCase();
        const downloadableExtensions = [\'pdf\', \'doc\', \'docx\', \'xls\', \'xlsx\', \'zip\', \'rar\', \'jpg\', \'jpeg\', \'png\', \'gif\'];
        
        if (downloadableExtensions.includes(fileExtension)) {
          gtag(\'event\', \'file_download\', {
            file_extension: fileExtension,
            file_name: link.href.split(\'/\').pop(),
            link_url: link.href
          });
        }
      }
    });
    
    // Track external link clicks
    document.addEventListener(\'click\', function(event) {
      const link = event.target.closest(\'a\');
      if (link && link.href && !link.href.includes(window.location.hostname)) {
        gtag(\'event\', \'click\', {
          event_category: \'outbound\',
          event_label: link.href,
          transport_type: \'beacon\'
        });
      }
    });
    
    console.log(\'[Eloise Co - GA4] Enhanced tracking features enabled (scroll depth, downloads, external links)\');
    console.log(\'[Eloise Co - GA4] Available via window.EloiseGA object for custom tracking\');
  };
  
  // Add the script to the page
  document.head.appendChild(gaScript);
  
  // Privacy compliance helper
  window.EloiseGA = window.EloiseGA || {};
  window.EloiseGA.disableAnalytics = function() {
    window[\'ga-disable-\' + measurementId] = true;
    console.log(\'[Eloise Co - GA4] Analytics disabled for privacy compliance\');
  };
  
  window.EloiseGA.enableAnalytics = function() {
    window[\'ga-disable-\' + measurementId] = false;
    console.log(\'[Eloise Co - GA4] Analytics enabled\');
  };
  
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