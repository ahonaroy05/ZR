import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

const LOCATION_TASK_NAME = 'background-location-task';
const GEOFENCE_TASK_NAME = 'geofence-task';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  speed?: number;
  heading?: number;
}

export interface StressZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  stressLevel: 'low' | 'medium' | 'high';
  interventionType: 'breathing' | 'grounding' | 'meditation';
  description: string;
}

// Default stress zones (can be customized by user)
export const DEFAULT_STRESS_ZONES: StressZone[] = [
  {
    id: 'downtown-traffic',
    name: 'Downtown Traffic Hub',
    latitude: 37.7749,
    longitude: -122.4194,
    radius: 500,
    stressLevel: 'high',
    interventionType: 'breathing',
    description: 'High traffic area with frequent congestion'
  },
  {
    id: 'transit-station',
    name: 'Central Transit Station',
    latitude: 37.7849,
    longitude: -122.4094,
    radius: 200,
    stressLevel: 'medium',
    interventionType: 'grounding',
    description: 'Busy transit hub with crowds'
  },
  {
    id: 'highway-junction',
    name: 'Highway Junction',
    latitude: 37.7649,
    longitude: -122.4294,
    radius: 300,
    stressLevel: 'high',
    interventionType: 'breathing',
    description: 'Complex highway interchange'
  }
];

class LocationService {
  private static instance: LocationService;
  private currentLocation: LocationData | null = null;
  private isTracking = false;
  private locationSubscription: Location.LocationSubscription | null = null;
  private stressZones: StressZone[] = DEFAULT_STRESS_ZONES;
  private onLocationUpdate?: (location: LocationData) => void;
  private onStressZoneEnter?: (zone: StressZone) => void;
  private lastKnownZones: Set<string> = new Set();

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (foregroundStatus !== 'granted') {
        console.log('Foreground location permission denied');
        return false;
      }

      // Request background permissions for continuous tracking
      if (Platform.OS !== 'web') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
          console.log('Background location permission denied');
        }
        return backgroundStatus === 'granted';
      }

      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  async startTracking(
    onLocationUpdate?: (location: LocationData) => void,
    onStressZoneEnter?: (zone: StressZone) => void
  ): Promise<boolean> {
    if (this.isTracking) return true;

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return false;

    this.onLocationUpdate = onLocationUpdate;
    this.onStressZoneEnter = onStressZoneEnter;

    try {
      // Start foreground location tracking
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // 10 seconds
          distanceInterval: 50, // 50 meters
        },
        (location) => {
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy || 0,
            timestamp: location.timestamp,
            speed: location.coords.speed || undefined,
            heading: location.coords.heading || undefined,
          };

          this.currentLocation = locationData;
          this.checkStressZones(locationData);
          this.onLocationUpdate?.(locationData);
        }
      );

      this.isTracking = true;
      return true;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      return false;
    }
  }

  async stopTracking(): Promise<void> {
    if (!this.isTracking) return;

    try {
      if (this.locationSubscription) {
        this.locationSubscription.remove();
        this.locationSubscription = null;
      }

      this.isTracking = false;
      this.lastKnownZones.clear();
    } catch (error) {
      console.error('Error stopping location tracking:', error);
    }
  }

  private checkStressZones(location: LocationData): void {
    const currentZones = new Set<string>();

    for (const zone of this.stressZones) {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        zone.latitude,
        zone.longitude
      );

      if (distance <= zone.radius) {
        currentZones.add(zone.id);
        
        // Check if this is a new zone entry
        if (!this.lastKnownZones.has(zone.id)) {
          this.onStressZoneEnter?.(zone);
        }
      }
    }

    this.lastKnownZones = currentZones;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  getCurrentLocation(): LocationData | null {
    return this.currentLocation;
  }

  getStressZones(): StressZone[] {
    return this.stressZones;
  }

  updateStressZones(zones: StressZone[]): void {
    this.stressZones = zones;
  }

  isCurrentlyTracking(): boolean {
    return this.isTracking;
  }

  async getCurrentPosition(): Promise<LocationData | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
        maximumAge: 60000,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
        timestamp: location.timestamp,
        speed: location.coords.speed || undefined,
        heading: location.coords.heading || undefined,
      };
    } catch (error) {
      console.error('Error getting current position:', error);
      return null;
    }
  }

  // Method to simulate location updates for demo purposes
  simulateLocationUpdates(callback: (location: LocationData) => void): void {
    const baseLocation = { latitude: 37.7749, longitude: -122.4194 };
    let counter = 0;

    const interval = setInterval(() => {
      const location: LocationData = {
        latitude: baseLocation.latitude + (Math.random() - 0.5) * 0.01,
        longitude: baseLocation.longitude + (Math.random() - 0.5) * 0.01,
        accuracy: 10 + Math.random() * 20,
        timestamp: Date.now(),
        speed: Math.random() * 30,
        heading: Math.random() * 360,
      };

      callback(location);
      counter++;

      if (counter > 10) {
        clearInterval(interval);
      }
    }, 5000);
  }
}

// Background task definitions (for native platforms)
if (Platform.OS !== 'web') {
  TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
      console.error('Background location task error:', error);
      return;
    }
    if (data) {
      // Handle background location updates
      console.log('Background location update:', data);
    }
  });

  TaskManager.defineTask(GEOFENCE_TASK_NAME, ({ data, error }) => {
    if (error) {
      console.error('Geofence task error:', error);
      return;
    }
    if (data) {
      // Handle geofence events
      console.log('Geofence event:', data);
    }
  });
}

export default LocationService;