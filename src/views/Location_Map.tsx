
'use client';

export default function LocationMapView() {
    const title = "Location Map";
    const description = "// REQUIRED_SECRETS: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

// Google Maps JavaScript API Integration for Vitalisona
(function() {
  \'use strict\';
  
  // Configuration
  const CONFIG = {
    mapContainerId: \'vitalisona-map\',
    defaultCenter: { lat: 40.7128, lng: -74.0060 }, // New York City
    defaultZoom: 12,
    mapOptions: {
      mapTypeId: \'roadmap\',
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      rotateControl: true,
      fullscreenControl: true
    }
  };

  // Global variables
  let map = null;
  let markers = [];
  let infoWindows = [];
  let directionsService = null;
  let directionsRenderer = null;

  // Initialize Google Maps integration
  function initializeGoogleMaps() {
    const apiKey = window.getKey(\'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY\');
    
    if (!apiKey) {
      console.error(\'Vitalisona: Google Maps API key not configured\');
      return;
    }

    console.log(\'Vitalisona: Initializing Google Maps integration...\');
    
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      console.log(\'Vitalisona: Google Maps already loaded, initializing map...\');
      initializeMap();
      return;
    }

    // Load Google Maps JavaScript API
    loadGoogleMapsScript(apiKey);
  }

  // Load Google Maps script dynamically
  function loadGoogleMapsScript(apiKey) {
    const script = document.createElement(\'script\');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,drawing&callback=initVitalisonaMap`;
    script.async = true;
    script.defer = true;
    
    script.onerror = function() {
      console.error(\'Vitalisona: Failed to load Google Maps API\');
    };
    
    // Set global callback
    window.initVitalisonaMap = function() {
      console.log(\'Vitalisona: Google Maps API loaded successfully\');
      initializeMap();
    };
    
    document.head.appendChild(script);
  }

  // Initialize the map
  function initializeMap() {
    try {
      // Create map container if it doesn\'t exist
      let mapContainer = document.getElementById(CONFIG.mapContainerId);
      if (!mapContainer) {
        mapContainer = document.createElement(\'div\');
        mapContainer.id = CONFIG.mapContainerId;
        mapContainer.style.cssText = \'width: 100%; height: 400px; display: none;\';
        document.body.appendChild(mapContainer);
      }

      // Initialize map
      map = new google.maps.Map(mapContainer, {
        center: CONFIG.defaultCenter,
        zoom: CONFIG.defaultZoom,
        ...CONFIG.mapOptions
      });

      // Initialize additional services
      directionsService = new google.maps.DirectionsService();
      directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      console.log(\'Vitalisona: Google Maps initialized successfully\');
      
      // Set up map event listeners
      setupMapEventListeners();
      
      // Expose API methods globally
      exposeGoogleMapsAPI();
      
      // Get user\'s current location
      getCurrentLocation();
      
    } catch (error) {
      console.error(\'Vitalisona: Error initializing Google Maps:\', error);
    }
  }

  // Set up map event listeners
  function setupMapEventListeners() {
    if (!map) return;

    // Map click event
    map.addListener(\'click\', function(event) {
      console.log(\'Vitalisona: Map clicked at:\', event.latLng.toJSON());
      
      // Trigger custom event
      window.dispatchEvent(new CustomEvent(\'vitalisona:mapClick\', {
        detail: {
          position: event.latLng.toJSON(),
          map: map
        }
      }));
    });

    // Map bounds changed event
    map.addListener(\'bounds_changed\', function() {
      const bounds = map.getBounds();
      if (bounds) {
        window.dispatchEvent(new CustomEvent(\'vitalisona:mapBoundsChanged\', {
          detail: {
            bounds: bounds.toJSON(),
            center: map.getCenter().toJSON(),
            zoom: map.getZoom()
          }
        }));
      }
    });
  }

  // Get user\'s current location
  function getCurrentLocation() {
    if (!navigator.geolocation) {
      console.warn(\'Vitalisona: Geolocation not supported\');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function(position) {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        console.log(\'Vitalisona: User location obtained:\', userLocation);
        
        // Center map on user location
        if (map) {
          map.setCenter(userLocation);
          
          // Add marker for user location
          addMarker({
            position: userLocation,
            title: \'Your Location\',
            icon: {
              url: \'data:image/svg+xml;charset=UTF-8,\' + encodeURIComponent(`
                <svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\">
                  <circle cx=\"10\" cy=\"10\" r=\"8\" fill=\"#4285f4\" stroke=\"white\" stroke-width=\"2\"/>
                  <circle cx=\"10\" cy=\"10\" r=\"3\" fill=\"white\"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(20, 20),
              anchor: new google.maps.Point(10, 10)
            }
          });
        }
        
        // Trigger custom event
        window.dispatchEvent(new CustomEvent(\'vitalisona:locationFound\', {
          detail: { position: userLocation }
        }));
      },
      function(error) {
        console.warn(\'Vitalisona: Error getting location:\', error.message);
        
        window.dispatchEvent(new CustomEvent(\'vitalisona:locationError\', {
          detail: { error: error.message }
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }

  // Add marker to map
  function addMarker(options) {
    if (!map || !options.position) return null;

    const marker = new google.maps.Marker({
      position: options.position,
      map: map,
      title: options.title || \'\',
      icon: options.icon || null,
      animation: options.animation || null
    });

    markers.push(marker);

    // Add info window if content provided
    if (options.infoContent) {
      const infoWindow = new google.maps.InfoWindow({
        content: options.infoContent
      });

      marker.addListener(\'click\', function() {
        // Close other info windows
        infoWindows.forEach(iw => iw.close());
        infoWindow.open(map, marker);
      });

      infoWindows.push(infoWindow);
    }

    console.log(\'Vitalisona: Marker added at:\', options.position);
    return marker;
  }

  // Clear all markers
  function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    infoWindows.forEach(iw => iw.close());
    infoWindows = [];
    console.log(\'Vitalisona: All markers cleared\');
  }

  // Search for places
  function searchPlaces(query, callback) {
    if (!map) {
      console.error(\'Vitalisona: Map not initialized\');
      return;
    }

    const service = new google.maps.places.PlacesService(map);
    const request = {
      query: query,
      fields: [\'name\', \'geometry\', \'place_id\', \'formatted_address\', \'rating\', \'types\']
    };

    service.textSearch(request, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(\'Vitalisona: Places search results:\', results);
        
        if (callback) callback(results, null);
        
        window.dispatchEvent(new CustomEvent(\'vitalisona:placesFound\', {
          detail: { results, query }
        }));
      } else {
        console.error(\'Vitalisona: Places search failed:\', status);
        if (callback) callback(null, status);
      }
    });
  }

  // Get directions between two points
  function getDirections(origin, destination, travelMode = \'DRIVING\') {
    if (!directionsService || !directionsRenderer) {
      console.error(\'Vitalisona: Directions service not initialized\');
      return;
    }

    const request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode[travelMode]
    };

    directionsService.route(request, function(result, status) {
      if (status === \'OK\') {
        directionsRenderer.setDirections(result);
        console.log(\'Vitalisona: Directions calculated successfully\');
        
        window.dispatchEvent(new CustomEvent(\'vitalisona:directionsFound\', {
          detail: { result, origin, destination, travelMode }
        }));
      } else {
        console.error(\'Vitalisona: Directions request failed:\', status);
      }
    });
  }

  // Calculate distance between two points
  function calculateDistance(point1, point2) {
    if (!google.maps.geometry) {
      console.error(\'Vitalisona: Geometry library not loaded\');
      return null;
    }

    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(point1.lat, point1.lng),
      new google.maps.LatLng(point2.lat, point2.lng)
    );

    return {
      meters: distance,
      kilometers: distance / 1000,
      miles: distance / 1609.34
    };
  }

  // Expose API methods globally
  function exposeGoogleMapsAPI() {
    window.VitalisonaGoogleMaps = {
      map: map,
      addMarker: addMarker,
      clearMarkers: clearMarkers,
      searchPlaces: searchPlaces,
      getDirections: getDirections,
      calculateDistance: calculateDistance,
      showMap: function() {
        const container = document.getElementById(CONFIG.mapContainerId);
        if (container) {
          container.style.display = \'block\';
          google.maps.event.trigger(map, \'resize\');
        }
      },
      hideMap: function() {
        const container = document.getElementById(CONFIG.mapContainerId);
        if (container) container.style.display = \'none\';
      },
      setCenter: function(position) {
        if (map) map.setCenter(position);
      },
      setZoom: function(zoom) {
        if (map) map.setZoom(zoom);
      },
      fitBounds: function(bounds) {
        if (map) map.fitBounds(bounds);
      },
      // Utility methods
      createLatLng: function(lat, lng) {
        return new google.maps.LatLng(lat, lng);
      },
      createLatLngBounds: function(sw, ne) {
        return new google.maps.LatLngBounds(sw, ne);
      }
    };

    console.log(\'Vitalisona: Google Maps API methods exposed globally\');
  }

  // Start the integration
  initializeGoogleMaps();

  // Custom event listeners for integration
  window.addEventListener(\'vitalisona:addMapMarker\', function(event) {
    if (event.detail && event.detail.position) {
      addMarker(event.detail);
    }
  });

  window.addEventListener(\'vitalisona:clearMapMarkers\', function() {
    clearMarkers();
  });

  window.addEventListener(\'vitalisona:searchMapPlaces\', function(event) {
    if (event.detail && event.detail.query) {
      searchPlaces(event.detail.query, event.detail.callback);
    }
  });

  console.log(\'Vitalisona: Google Maps integration loaded\');

})();

// Usage examples:
/*

// Add a marker
window.dispatchEvent(new CustomEvent(\'vitalisona:addMapMarker\', {
  detail: {
    position: { lat: 40.7128, lng: -74.0060 },
    title: \'New York City\',
    infoContent: \'<div><h3>New York City</h3><p>The Big Apple</p></div>\'
  }
}));

// Search for places
window.dispatchEvent(new CustomEvent(\'vitalisona:searchMapPlaces\', {
  detail: {
    query: \'hospitals near me\',
    callback: function(results, error) {
      if (results) {
        results.forEach(place => {
          window.VitalisonaGoogleMaps.addMarker({
            position: place.geometry.location,
            title: place.name,
            infoContent: `<div><h4>${place.name}</h4><p>${place.formatted_address}</p></div>`
          });
        });
      }
    }
  }
}));

// Show the map
window.VitalisonaGoogleMaps.showMap();

// Get directions
window.VitalisonaGoogleMaps.getDirections(
  { lat: 40.7128, lng: -74.0060 },
  { lat: 40.7589, lng: -73.9851 },
  \'DRIVING\'
);

// Listen for map events
window.addEventListener(\'vitalisona:mapClick\', function(event) {
  console.log(\'Map clicked at:\', event.detail.position);
});

window.addEventListener(\'vitalisona:locationFound\', function(event) {
  console.log(\'User location:\', event.detail.position);
});

*/";
    
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