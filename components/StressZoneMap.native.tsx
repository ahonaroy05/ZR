import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import LocationService, { LocationData, StressZone } from '@/lib/locationService';
import { Navigation, Zap } from 'lucide-react-native';
import MapView, { Marker, Circle } from 'react-native-maps';

interface StressZoneMapProps {
  onLocationUpdate?: (location: LocationData) => void;
  onStressZoneEnter?: (zone: StressZone) => void;
  showUserLocation?: boolean;
  followUser?: boolean;
}

export default function StressZoneMap({
  onLocationUpdate,
  onStressZoneEnter,
  showUserLocation = true,
  followUser = true,
}: StressZoneMapProps) {
  const { theme } = useTheme();
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [stressZones, setStressZones] = useState<StressZone[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const locationService = useRef(LocationService.getInstance());

  useEffect(() => {
    initializeMap();
    return () => {
      locationService.current.stopTracking();
    };
  }, []);

  const initializeMap = async () => {
    // Get initial location
    const location = await locationService.current.getCurrentPosition();
    if (location) {
      setCurrentLocation(location);
      if (followUser) {
        setRegion(prev => ({
          ...prev,
          latitude: location.latitude,
          longitude: location.longitude,
        }));
      }
    }

    // Load stress zones
    const zones = locationService.current.getStressZones();
    setStressZones(zones);

    // Start tracking
    const success = await locationService.current.startTracking(
      (location) => {
        setCurrentLocation(location);
        onLocationUpdate?.(location);
        
        if (followUser) {
          setRegion(prev => ({
            ...prev,
            latitude: location.latitude,
            longitude: location.longitude,
          }));
        }
      },
      (zone) => {
        onStressZoneEnter?.(zone);
      }
    );

    setIsTracking(success);
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

  const toggleTracking = async () => {
    if (isTracking) {
      await locationService.current.stopTracking();
      setIsTracking(false);
    } else {
      const success = await locationService.current.startTracking(
        (location) => {
          setCurrentLocation(location);
          onLocationUpdate?.(location);
        },
        (zone) => {
          onStressZoneEnter?.(zone);
        }
      );
      setIsTracking(success);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChange={setRegion}
        showsUserLocation={showUserLocation}
        followsUserLocation={followUser}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        mapType="standard"
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
      </MapView>

      {/* Tracking Control */}
      <TouchableOpacity
        style={[styles.trackingButton, { backgroundColor: theme.colors.surface }]}
        onPress={toggleTracking}
      >
        <View style={[
          styles.trackingIndicator,
          { backgroundColor: isTracking ? '#4ADE80' : '#EF4444' }
        ]} />
        <Text style={[styles.trackingText, { color: theme.colors.text }]}>
          {isTracking ? 'Tracking Active' : 'Start Tracking'}
        </Text>
      </TouchableOpacity>

      {/* Location Info */}
      {currentLocation && (
        <View style={[styles.locationInfo, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.locationText, { color: theme.colors.text }]}>
            Accuracy: {Math.round(currentLocation.accuracy)}m
          </Text>
          {currentLocation.speed && (
            <Text style={[styles.locationText, { color: theme.colors.text }]}>
              Speed: {Math.round(currentLocation.speed * 3.6)} km/h
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
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
  trackingButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trackingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  trackingText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
  },
  locationInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
  },
});