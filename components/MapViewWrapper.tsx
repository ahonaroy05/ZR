import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { MapPin, Navigation, Zap, Map } from 'lucide-react-native';

interface StressZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  stressLevel: 'low' | 'medium' | 'high';
  description: string;
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapViewWrapperProps {
  style?: any;
  stressZones?: StressZone[];
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  onLocationUpdate?: (location: any) => void;
  routes?: Array<Array<{latitude: number; longitude: number}>>;
  region?: Region;
  onRegionChange?: (region: Region) => void;
}

// Declare variables for dynamic imports
let GoogleMap: any, Marker: any, Circle: any, InfoWindow: any, Polyline: any;
let google: any;

export default function MapViewWrapper({
  style,
  stressZones = [],
  userLocation,
  onLocationUpdate,
  routes = [],
  region,
  onRegionChange,
}: MapViewWrapperProps) {
  const { theme } = useTheme();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const circlesRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);
  const infoWindowsRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);

  // Google Maps style array
  const customMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8ec3b9"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1a3646"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#64779e"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#334e87"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6f9ba5"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3C7680"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#304a7d"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2c6675"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#255763"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#b0d5ce"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3a4762"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#0e1626"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#4e6d70"
        }
      ]
    }
  ];

  // Load Google Maps API
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          initializeGoogleMaps();
          return;
        }

        // Load Google Maps API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCRdBpyOo4ZZqxE8dn_sBprAgfoROaRskM&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => initializeGoogleMaps();
        script.onerror = () => {
          setError('Failed to load Google Maps API');
          console.error('Google Maps API failed to load');
        };
        document.head.appendChild(script);

        return () => {
          // Clean up script if component unmounts before loading
          if (!window.google) {
            document.head.removeChild(script);
          }
        };
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setError('Failed to initialize map');
      }
    }
  }, []);

  // Initialize Google Maps
  const initializeGoogleMaps = () => {
    try {
      google = window.google;
      GoogleMap = google.maps.Map;
      Marker = google.maps.Marker;
      Circle = google.maps.Circle;
      InfoWindow = google.maps.InfoWindow;
      Polyline = google.maps.Polyline;
      setMapLoaded(true);
    } catch (err) {
      setError('Error initializing Google Maps');
      console.error('Error initializing Google Maps:', err);
    }
  };

  // Initialize map after Google Maps API is loaded
  React.useEffect(() => {
    if (Platform.OS === 'web' && mapLoaded && mapRef.current && google) {
      const initializeMap = () => {
        try {
          // Create map instance
          const mapOptions = {
            center: { 
              lat: region?.latitude || userLocation?.latitude || 37.7749, 
              lng: region?.longitude || userLocation?.longitude || -122.4194 
            },
            zoom: 13,
            styles: customMapStyle,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            zoomControlOptions: {
              position: google.maps.ControlPosition.RIGHT_TOP
            }
          };
          
          const map = new GoogleMap(mapRef.current, mapOptions);
          googleMapRef.current = map;

          // Add event listener for map changes
          map.addListener('idle', () => {
            if (onRegionChange) {
              const center = map.getCenter();
              const bounds = map.getBounds();
              if (bounds) {
                const ne = bounds.getNorthEast();
                const sw = bounds.getSouthWest();
                
                // Calculate deltas based on bounds
                const latDelta = ne.lat() - sw.lat();
                const lngDelta = ne.lng() - sw.lng();
                
                onRegionChange({
                  latitude: center.lat(),
                  longitude: center.lng(),
                  latitudeDelta: latDelta,
                  longitudeDelta: lngDelta
                });
              }
            }
          });

          // Add user location marker if available
          if (userLocation) {
            addUserLocationMarker(map, userLocation);
          }

          // Add stress zones
          addStressZones(map, stressZones);

          // Add routes
          addRoutes(map, routes);
        } catch (err) {
          setError('Error creating Google Map');
          console.error('Error creating Google Map:', err);
        }
      };
      
      // Small delay to ensure DOM is ready
      if (mapRef.current) {
        setTimeout(initializeMap, 100);
      }
    }
  }, [mapLoaded, mapRef.current]);

  // Update map when region changes
  React.useEffect(() => {
    if (Platform.OS === 'web' && googleMapRef.current && region) {
      googleMapRef.current.setCenter({ 
        lat: region.latitude, 
        lng: region.longitude 
      });
    }
  }, [region]);

  // Update user location marker
  React.useEffect(() => {
    if (Platform.OS === 'web' && googleMapRef.current && userLocation) {
      addUserLocationMarker(googleMapRef.current, userLocation);
    }
  }, [userLocation]);

  // Update stress zones
  React.useEffect(() => {
    if (Platform.OS === 'web' && googleMapRef.current) {
      // Clear existing stress zones
      clearStressZones();
      // Add new stress zones
      addStressZones(googleMapRef.current, stressZones);
    }
  }, [stressZones]);

  // Update routes
  React.useEffect(() => {
    if (Platform.OS === 'web' && googleMapRef.current) {
      // Clear existing routes
      clearRoutes();
      // Add new routes
      addRoutes(googleMapRef.current, routes);
    }
  }, [routes]);

  // Add user location marker
  const addUserLocationMarker = (map: any, location: any) => {
    // Remove existing user marker
    if (userMarkerRef.current && userMarkerRef.current.setMap) {
      userMarkerRef.current.setMap(null);
    }

    // Create user marker
    try {
      // If we already have a marker, just update its position
      if (userMarkerRef.current) {
        userMarkerRef.current.setPosition({ lat: location.latitude, lng: location.longitude });
        return;
      }
      
      // Create a static marker for user location (no animation)
      const userMarker = new Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: map,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" fill="#4ADE80" stroke="#FFFFFF" stroke-width="2"/>
            </svg>
          `),
          size: new google.maps.Size(16, 16),
          anchor: new google.maps.Point(8, 8),
          scaledSize: new google.maps.Size(16, 16)
        },
        // Remove title to prevent tooltip popup
        title: '',
        zIndex: 1000,
        // Explicitly set to null to prevent any animation
        animation: null,
        // Make marker flat to prevent 3D tilting
        flat: true
      });
      
      // Store references
      userMarkerRef.current = userMarker;
      
    } catch (err) {
      console.error('Error creating user marker:', err);
    }
  };

  // Add stress zones to map
  const addStressZones = (map: any, zones: StressZone[]) => {
    zones.forEach(zone => {
      const color = getStressZoneColor(zone.stressLevel);
      
      // Create circle
      const circle = new Circle({
        center: { lat: zone.latitude, lng: zone.longitude },
        radius: zone.radius,
        fillColor: color.fill,
        fillOpacity: 0.3,
        strokeColor: color.stroke,
        strokeWeight: 2,
        map: map
      });
      
      // Create marker
      const marker = new Marker({
        position: { lat: zone.latitude, lng: zone.longitude },
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: color.stroke,
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
        title: zone.name
      });
      
      // Create info window
      const infoWindow = new InfoWindow({
        content: `
          <div style="text-align: center; padding: 5px;">
            <strong>${zone.name}</strong><br/>
            <span style="color: ${color.stroke}; font-weight: bold; text-transform: capitalize;">
              ${zone.stressLevel} Stress
            </span><br/>
            <small>${zone.description}</small>
          </div>
        `
      });
      
      // Add click listener to marker
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
      
      // Store references for later cleanup
      circlesRef.current.push(circle);
      markersRef.current.push(marker);
      infoWindowsRef.current.push(infoWindow);
    });
  };

  // Add routes to map
  const addRoutes = (map: any, routes: Array<Array<{latitude: number; longitude: number}>>) => {
    routes.forEach((route, index) => {
      const path = route.map(coord => ({ lat: coord.latitude, lng: coord.longitude }));
      
      const polyline = new Polyline({
        path: path,
        geodesic: true,
        strokeColor: getRouteColor(index),
        strokeOpacity: 0.8,
        strokeWeight: index === 0 ? 5 : 3,
        map: map
      });
      
      polylinesRef.current.push(polyline);
    });
  };

  // Clear stress zones
  const clearStressZones = () => {
    circlesRef.current.forEach(circle => circle.setMap(null));
    markersRef.current.forEach(marker => marker.setMap(null));
    infoWindowsRef.current.forEach(infoWindow => infoWindow.close());
    
    circlesRef.current = [];
    markersRef.current = [];
    infoWindowsRef.current = [];
  };

  // Clear routes
  const clearRoutes = () => {
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];
  };

  const getStressZoneColor = (stressLevel: string) => {
    switch (stressLevel) {
      case 'high':
        return { fill: 'rgba(255, 107, 107, 0.3)', stroke: '#FF6B6B' };
      case 'medium':
        return { fill: 'rgba(255, 217, 61, 0.3)', stroke: '#FFD93D' };
      case 'low':
        return { fill: 'rgba(168, 230, 207, 0.3)', stroke: '#A8E6CF' };
      default:
        return { fill: 'rgba(168, 230, 207, 0.3)', stroke: '#A8E6CF' };
    }
  };

  // Route colors for different routes
  const getRouteColor = (index: number) => {
    const colors = ['#4ADE80', '#FFD93D', '#FF6B6B'];
    return colors[index % colors.length];
  };

  // Web implementation with Google Maps
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: theme.isDark ? '#2A3A4A' : '#E5F3FF' }]}>
            <Text style={[styles.errorText, { color: theme.colors.text }]}>
              {error}
            </Text>
          </View>
        ) : (
          <div 
            ref={mapRef} 
            style={{ 
              height: '100%', 
              width: '100%', 
              borderRadius: '16px',
              overflow: 'hidden'
            }}
          />
        )}
      </View>
    );
  }

  // Fallback for non-web platforms
  return (
    <View style={[styles.container, style, { backgroundColor: theme.isDark ? '#2A3A4A' : '#E5F3FF' }]}>
      <View style={styles.mockMapOverlay}>
        <Map size={32} color={theme.colors.primary} strokeWidth={2} />
        <Text style={[styles.mockMapText, { color: theme.colors.text }]}>
          Interactive Map
        </Text>
        <Text style={[styles.mockMapSubtext, { color: theme.colors.textSecondary }]}>
          {Platform.OS === 'web' ? 'Loading map...' : 'Real-time stress zone detection'}
        </Text>
        {userLocation && (
          <Text style={[styles.mockMapCoords, { color: theme.colors.textSecondary }]}>
            {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  mockMapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  mockMapText: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    marginTop: 12,
  },
  mockMapSubtext: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    marginTop: 4,
  },
  mockMapCoords: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    textAlign: 'center',
  },
});