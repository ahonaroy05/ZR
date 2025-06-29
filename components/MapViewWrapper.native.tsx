import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { MapPin, Navigation, Zap } from 'lucide-react-native';
import MapView, { Marker, Circle, Polyline, PROVIDER_GOOGLE } from 'expo-maps';

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
  stressZones?: StressZone[];
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  onLocationUpdate?: (location: any) => void;
  routes?: Array<Array<{latitude: number; longitude: number}>>;
  region?: Region;
  onRegionChange?: (region: Region) => void;
  style?: any;
}

export default function MapViewWrapper({
  stressZones = [],
  userLocation,
  style,
  routes = [],
  region,
  onRegionChange,
  onLocationUpdate
}: MapViewWrapperProps) {
  const initialRegion = region || {
    latitude: userLocation?.latitude || 37.7749,
    longitude: userLocation?.longitude || -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

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

  // Route colors for different stress levels
  const getRouteColor = (index: number) => {
    const colors = ['#4ADE80', '#FFD93D', '#FF6B6B'];
    return colors[index % colors.length];
  };

  return (
    <MapView
      style={[styles.nativeMap, style]}
      provider={PROVIDER_GOOGLE}
      initialRegion={initialRegion}
      region={region}
      onRegionChange={onRegionChange}
      showsUserLocation={true}
      showsMyLocationButton={true}
      showsCompass={true}
      mapType="standard"
      followsUserLocation={true}
      onUserLocationChange={onLocationUpdate}
      customMapStyle={customMapStyle}
    >
      {/* Stress Zones */}
      {stressZones.map((zone) => {
        const colors = getStressZoneColor(zone.stressLevel);
        return (
          <React.Fragment key={zone.id}>
            <Circle
              center={{
                latitude: zone.latitude,
                longitude: zone.longitude,
              }}
              radius={zone.radius}
              fillColor={colors.fill}
              strokeColor={colors.stroke}
              strokeWidth={2}
            />
            <Marker
              coordinate={{
                latitude: zone.latitude,
                longitude: zone.longitude,
              }}
              title={zone.name}
              description={zone.description}
            >
              <View style={[styles.zoneMarker, { backgroundColor: colors.stroke }]}>
                <Zap size={16} color="#FFFFFF" strokeWidth={2} />
              </View>
            </Marker>
          </React.Fragment>
        );
      })}

      {/* Route Polylines */}
      {routes.map((route, index) => (
        <Polyline
          key={`route-${index}`}
          coordinates={route}
          strokeWidth={index === 0 ? 5 : 3}
          strokeColor={getRouteColor(index)}
          lineDashPattern={index === 0 ? undefined : [1, 2]}
          lineCap="round"
          lineJoin="round"
        />
      ))}
      
      {/* User location marker with custom styling */}
      {userLocation && (
        <Marker
          key="user-location-marker"
          coordinate={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          }}
          // Remove title and description to prevent callout
          title=""
          description=""
          // Add flat prop to prevent marker from tilting with map
          flat={true}
          // Add anchor to center the marker properly
          anchor={{ x: 0.5, y: 0.5 }}
          // Disable callout to prevent accidental taps
          calloutEnabled={false}
          // Disable tracking mode to prevent automatic camera movements
          tracksViewChanges={false}
          // Prevent any animation
          tracksInfoWindowChanges={false}
        >
          <View style={styles.userMarker}>
            <View style={styles.userMarkerInner} />
          </View>
        </Marker>
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  nativeMap: {
    flex: 1,
  },
  zoneMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12, 
    backgroundColor: '#4ADE80',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarkerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});