
'use client';

export default function AnalyticsTrackingView() {
    const title = "Analytics Tracking";
    const description = "// REQUIRED_SECRETS: NEXT_PUBLIC_GA_MEASUREMENT_ID

// Google Analytics 4 Integration for Vitalisona
(function() {
  \'use strict\';
  
  // Get measurement ID from secrets
  const measurementId = window.getKey(\'NEXT_PUBLIC_GA_MEASUREMENT_ID\');
  
  if (!measurementId) {
    console.error(\'Vitalisona GA4: Measurement ID not configured. Please set NEXT_PUBLIC_GA_MEASUREMENT_ID.\');
    return;
  }
  
  // Prevent double initialization
  if (window.vitalisonaGA4Initialized) {
    console.warn(\'Vitalisona GA4: Already initialized\');
    return;
  }
  
  // Load Google Analytics 4 script
  function loadGA4Script() {
    const script = document.createElement(\'script\');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.onerror = function() {
      console.error(\'Vitalisona GA4: Failed to load Google Analytics script\');
    };
    document.head.appendChild(script);
  }
  
  // Initialize Google Analytics
  function initializeGA4() {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Define gtag function
    function gtag() {
      window.dataLayer.push(arguments);
    }
    
    // Make gtag globally available
    window.gtag = gtag;
    
    // Configure Google Analytics
    gtag(\'js\', new Date());
    gtag(\'config\', measurementId, {
      // Enhanced measurement settings
      send_page_view: true,
      enhanced_measurement_scrolls: true,
      enhanced_measurement_outbound_clicks: true,
      enhanced_measurement_file_downloads: true,
      enhanced_measurement_video_engagement: true,
      // Privacy settings
      anonymize_ip: true,
      allow_google_signals: false,
      // Custom settings for Vitalisona
      custom_map: {
        \'custom_parameter_1\': \'vitalisona_user_type\',
        \'custom_parameter_2\': \'vitalisona_page_category\'
      }
    });
    
    console.log(\'Vitalisona GA4: Initialized with Measurement ID:\', measurementId);
    
    // Mark as initialized
    window.vitalisonaGA4Initialized = true;
    
    // Set up custom event tracking for Vitalisona
    setupVitalisonaTracking();
  }
  
  // Custom event tracking for Vitalisona
  function setupVitalisonaTracking() {
    // Track page views with custom parameters
    function trackPageView(pagePath, pageTitle) {
      window.gtag(\'event\', \'page_view\', {
        page_path: pagePath || window.location.pathname,
        page_title: pageTitle || document.title,
        vitalisona_page_category: getPageCategory(),
        send_to: measurementId
      });
    }
    
    // Get page category based on URL
    function getPageCategory() {
      const path = window.location.pathname;
      if (path.includes(\'/health\')) return \'health\';
      if (path.includes(\'/wellness\')) return \'wellness\';
      if (path.includes(\'/nutrition\')) return \'nutrition\';
      if (path.includes(\'/fitness\')) return \'fitness\';
      if (path.includes(\'/mental-health\')) return \'mental_health\';
      if (path.includes(\'/about\')) return \'about\';
      if (path.includes(\'/contact\')) return \'contact\';
      if (path === \'/\') return \'home\';
      return \'other\';
    }
    
    // Track custom Vitalisona events
    function trackVitalisonaEvent(eventName, parameters) {
      const defaultParams = {
        event_category: \'vitalisona_interaction\',
        vitalisona_timestamp: Date.now(),
        send_to: measurementId
      };
      
      window.gtag(\'event\', eventName, {
        ...defaultParams,
        ...parameters
      });
    }
    
    // Expose tracking functions globally for use by other parts of the app
    window.vitalisonaGA4 = {
      trackPageView: trackPageView,
      trackEvent: trackVitalisonaEvent,
      trackHealthGoal: function(goalType, goalValue) {
        trackVitalisonaEvent(\'health_goal_set\', {
          goal_type: goalType,
          goal_value: goalValue,
          event_category: \'health_tracking\'
        });
      },
      trackWellnessActivity: function(activityType, duration) {
        trackVitalisonaEvent(\'wellness_activity\', {
          activity_type: activityType,
          duration_minutes: duration,
          event_category: \'wellness_engagement\'
        });
      },
      trackNutritionLog: function(mealType, calories) {
        trackVitalisonaEvent(\'nutrition_logged\', {
          meal_type: mealType,
          calories: calories,
          event_category: \'nutrition_tracking\'
        });
      },
      trackUserEngagement: function(feature, engagementLevel) {
        trackVitalisonaEvent(\'user_engagement\', {
          feature_name: feature,
          engagement_level: engagementLevel,
          event_category: \'user_behavior\'
        });
      }
    };
    
    // Auto-track scroll depth
    let maxScroll = 0;
    const scrollThresholds = [25, 50, 75, 90, 100];
    
    function trackScrollDepth() {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Check if we\'ve hit a threshold
        const threshold = scrollThresholds.find(t => scrollPercent >= t && maxScroll - scrollPercent < t);
        if (threshold) {
          trackVitalisonaEvent(\'scroll_depth\', {
            scroll_depth: threshold,
            page_category: getPageCategory(),
            event_category: \'user_engagement\'
          });
        }
      }
    }
    
    // Throttled scroll tracking
    let scrollTimeout;
    window.addEventListener(\'scroll\', function() {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(trackScrollDepth, 250);
    });
    
    // Track external links
    document.addEventListener(\'click\', function(event) {
      const link = event.target.closest(\'a\');
      if (link && link.hostname !== window.location.hostname) {
        trackVitalisonaEvent(\'external_link_click\', {
          link_url: link.href,
          link_text: link.textContent.trim().substring(0, 50),
          event_category: \'outbound_links\'
        });
      }
    });
    
    // Track form submissions
    document.addEventListener(\'submit\', function(event) {
      const form = event.target;
      if (form.tagName === \'FORM\') {
        const formName = form.name || form.id || \'unnamed_form\';
        trackVitalisonaEvent(\'form_submission\', {
          form_name: formName,
          form_method: form.method || \'get\',
          event_category: \'form_interaction\'
        });
      }
    });
    
    console.log(\'Vitalisona GA4: Custom tracking events initialized\');
  }
  
  // Error handling wrapper
  function safeExecute(fn, context) {
    try {
      fn();
    } catch (error) {
      console.error(`Vitalisona GA4 Error (${context}):`, error);
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === \'loading\') {
    document.addEventListener(\'DOMContentLoaded\', function() {
      safeExecute(function() {
        loadGA4Script();
        // Small delay to ensure script loads before initialization
        setTimeout(initializeGA4, 100);
      }, \'DOMContentLoaded\');
    });
  } else {
    safeExecute(function() {
      loadGA4Script();
      setTimeout(initializeGA4, 100);
    }, \'immediate execution\');
  }
  
  // Debug mode for development
  if (window.location.hostname === \'localhost\' || window.location.hostname.includes(\'dev\')) {
    window.vitalisonaGA4Debug = {
      measurementId: measurementId,
      dataLayer: function() { return window.dataLayer; },
      testEvent: function() {
        window.gtag(\'event\', \'test_event\', {
          event_category: \'debug\',
          custom_parameter: \'test_value\'
        });
        console.log(\'Vitalisona GA4: Test event sent\');
      }
    };
  }
  
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