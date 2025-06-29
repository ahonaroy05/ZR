import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { MapPin, Navigation, Clock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Search, Car, Bike, User as Walk, X } from 'lucide-react-native';
import ThemeToggle from '@/components/ThemeToggle';
import MapViewWrapper from '@/components/MapViewWrapper';
import ForestAnimations from '@/components/ForestAnimations';
import polyline from 'polyline-encoded';

interface RouteOption {
  id: string;
  name: string;
  duration: string;
  stressLevel: 'low' | 'medium' | 'high';
  distance: string;
  traffic: string;
  description: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Route {
  id: string;
  name: string;
  duration: string;
  distance: string;
  stressLevel: 'low' | 'medium' | 'high';
  traffic: string;
  description: string;
  polyline: Coordinates[];
}

type TravelMode = 'driving' | 'walking' | 'bicycling';

export default function MapScreen() {
  const { theme } = useTheme();
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedRoute, setSelectedRoute] = useState<string>('route1');
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([
    {
      id: 'route1',
      name: 'Scenic Route',
      duration: '28 min',
      stressLevel: 'low',
      distance: '12.5 miles',
      traffic: 'Light',
      description: 'Through the park with minimal traffic lights'
    },
    {
      id: 'route2',
      name: 'Direct Route',
      duration: '22 min',
      stressLevel: 'high',
      distance: '9.2 miles',
      traffic: 'Heavy',
      description: 'Fastest but through busy downtown area'
    },
    {
      id: 'route3',
      name: 'Balanced Route',
      duration: '25 min',
      stressLevel: 'medium',
      distance: '11.1 miles',
      traffic: 'Moderate',
      description: 'Good compromise between time and stress'
    }
  ]);
  
  // New state for route planning
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [travelMode, setTravelMode] = useState<TravelMode>('driving');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showRouteInput, setShowRouteInput] = useState<boolean>(false);

  // State for location finding
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Mock stress zones for demonstration
  const stressZones = [
    {
      id: 'downtown-traffic',
      name: 'Downtown Hub',
      latitude: 37.7749,
      longitude: -122.4194,
      radius: 500,
      stressLevel: 'high' as const,
      description: 'High traffic area with frequent congestion'
    },
    {
      id: 'transit-station',
      name: 'Transit Station',
      latitude: 37.7849,
      longitude: -122.4094,
      radius: 200,
      stressLevel: 'medium' as const,
      description: 'Busy transit hub with crowds'
    },
    {
      id: 'park-area',
      name: 'Calm Zone',
      latitude: 37.7649,
      longitude: -122.4294,
      radius: 300,
      stressLevel: 'low' as const,
      description: 'Peaceful park area'
    }
  ];

  const getStressColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return '#A8E6CF';
      case 'medium': return '#FFD93D';
      case 'high': return '#FF6B6B';
    }
  };

  const getStressIcon = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return <CheckCircle size={20} color="#FFFFFF" />;
      case 'medium': return <Clock size={20} color="#FFFFFF" />;
      case 'high': return <AlertTriangle size={20} color="#FFFFFF" />;
    }
  };

  const fetchRoutes = async () => {
    if (!origin || !destination) {
      setError('Please enter both origin and destination');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Google Maps Directions API endpoint
      const apiKey = Platform.OS === 'web' 
        ? process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY 
        : 'AIzaSyCRdBpyOo4ZZqxE8dn_sBprAgfoROaRskM';
      
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${travelMode}&alternatives=true&avoid=highways,tolls&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(data.error_message || 'Failed to fetch routes');
      }

      if (!data.routes || data.routes.length === 0) {
        throw new Error('No routes found');
      }

      // Process routes
      const processedRoutes: Route[] = data.routes.map((route: any, index: number) => {
        // Decode polyline
        const points = polyline.decode(route.overview_polyline.points);
        const coordinates = points.map(point => ({
          latitude: point[0],
          longitude: point[1]
        }));

        // Calculate stress level based on traffic and route type
        let stressLevel: 'low' | 'medium' | 'high' = 'medium';
        if (route.legs[0].duration_in_traffic) {
          const trafficRatio = route.legs[0].duration_in_traffic.value / route.legs[0].duration.value;
          if (trafficRatio > 1.5) stressLevel = 'high';
          else if (trafficRatio < 1.2) stressLevel = 'low';
        } else {
          // If no traffic data, estimate based on route type
          if (index === 0) stressLevel = 'medium'; // Main route
          else if (route.legs[0].distance.value > data.routes[0].legs[0].distance.value * 1.2) stressLevel = 'low'; // Longer routes often less stressful
          else stressLevel = Math.random() > 0.5 ? 'medium' : 'high'; // Random for demo
        }

        // Generate a descriptive name
        let name = '';
        if (index === 0) name = 'Recommended Route';
        else if (stressLevel === 'low') name = 'Zen Route';
        else if (route.legs[0].duration.value < data.routes[0].legs[0].duration.value) name = 'Quick Route';
        else name = `Alternative ${index}`;

        // Generate a description
        let description = '';
        if (stressLevel === 'low') description = 'Peaceful route with minimal stress';
        else if (stressLevel === 'medium') description = 'Balanced route with moderate traffic';
        else description = 'Faster but potentially stressful route';

        return {
          id: `route-${index}`,
          name,
          duration: route.legs[0].duration.text,
          distance: route.legs[0].distance.text,
          stressLevel,
          traffic: stressLevel === 'low' ? 'Light' : stressLevel === 'medium' ? 'Moderate' : 'Heavy',
          description,
          polyline: coordinates
        };
      });

      setRoutes(processedRoutes);
      if (processedRoutes.length > 0) {
        setSelectedRoute(processedRoutes[0].id);
      }

      // Update the map region to fit the route
      if (processedRoutes.length > 0 && processedRoutes[0].polyline.length > 0) {
        const firstRoute = processedRoutes[0].polyline;
        const midPoint = firstRoute[Math.floor(firstRoute.length / 2)];
        setRegion({
          latitude: midPoint.latitude,
          longitude: midPoint.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        });
      }

    } catch (err) {
      console.error('Error fetching routes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch routes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRouteSelect = (routeId: string) => {
    setSelectedRoute(routeId);
  };

  const handleLocationUpdate = (location: any) => {
    if (location?.coordinate) {
      setCurrentLocation({
        ...location.coordinate,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      setOrigin(`${currentLocation.latitude},${currentLocation.longitude}`);
    } else {
      Alert.alert('Location not available', 'Please enable location services or enter an address manually.');
    }
  };

  // Find user's current location
  const findMyLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Update region to center on user's location
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        };
        
        setRegion(newRegion);
        
        setCurrentLocation({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        });
        
        // If route planning is active, set origin to current location
        if (showRouteInput) {
          setOrigin(`${latitude},${longitude}`);
        }
        
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Failed to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        setLocationError(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 60000
      }
    );
  };

  const clearRoutes = () => {
    setRoutes([]);
    setShowRouteInput(false);
    setError(null);
  };

  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  return (
    <ForestAnimations type="lightRays" intensity="low">
      <View style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradient.ocean}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={[styles.title, { color: theme.colors.text }]}>Route Planning</Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Choose your zen journey</Text>
              </View>
              <ThemeToggle />
            </View>

            {/* Google Maps Integration */}
            <View style={styles.mapContainer}>
              <View style={styles.mapWrapper}>
                <MapViewWrapper
                  style={styles.map}
                  stressZones={stressZones}
                  userLocation={currentLocation ? {
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  } : undefined}
                  onLocationUpdate={handleLocationUpdate}
                  routes={routes.map(route => route.polyline)}
                  region={region}
                  onRegionChange={setRegion}
                />
                
                {/* Find My Location Button */}
                <TouchableOpacity 
                  style={[styles.findLocationButton, { backgroundColor: theme.colors.surface }]}
                  onPress={findMyLocation}
                  disabled={isLocating} 
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.secondary]}
                    style={styles.findLocationGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {isLocating ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <MapPin size={16} color="#FFFFFF" strokeWidth={2} />
                        <Text style={styles.findLocationText}>Find My Location</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                
                {/* Route Planning Button */}
                <TouchableOpacity 
                  style={[styles.routePlanButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => setShowRouteInput(!showRouteInput)}
                >
                  <Navigation size={20} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Route Planning Input */}
            {showRouteInput && (
              <View style={[styles.routePlanCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.routePlanHeader}>
                  <Text style={[styles.routePlanTitle, { color: theme.colors.text }]}>
                    Plan Your Zen Route
                  </Text>
                  <TouchableOpacity onPress={clearRoutes}>
                    <X size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.inputContainer}>
                  <View style={styles.inputRow}>
                    <MapPin size={18} color={theme.colors.primary} strokeWidth={2} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                      placeholder="Starting point"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={origin}
                      onChangeText={setOrigin}
                    />
                    <TouchableOpacity 
                      style={[styles.locationButton, { backgroundColor: theme.colors.primary }]}
                      onPress={handleUseCurrentLocation}
                    >
                      <MapPin size={16} color="#FFFFFF" strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.inputRow}>
                    <Navigation size={18} color={theme.colors.primary} strokeWidth={2} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                      placeholder="Destination"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={destination}
                      onChangeText={setDestination}
                    />
                    <TouchableOpacity 
                      style={[styles.searchButton, { backgroundColor: theme.colors.primary }]}
                      onPress={fetchRoutes}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Search size={16} color="#FFFFFF" strokeWidth={2} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.travelModeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.travelModeButton,
                      { backgroundColor: theme.colors.border },
                      travelMode === 'driving' && { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => setTravelMode('driving')}
                  >
                    <Car size={16} color={travelMode === 'driving' ? '#FFFFFF' : theme.colors.textSecondary} strokeWidth={2} />
                    <Text style={[
                      styles.travelModeText,
                      { color: theme.colors.textSecondary },
                      travelMode === 'driving' && { color: '#FFFFFF' }
                    ]}>
                      Drive
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.travelModeButton,
                      { backgroundColor: theme.colors.border },
                      travelMode === 'bicycling' && { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => setTravelMode('bicycling')}
                  >
                    <Bike size={16} color={travelMode === 'bicycling' ? '#FFFFFF' : theme.colors.textSecondary} strokeWidth={2} />
                    <Text style={[
                      styles.travelModeText,
                      { color: theme.colors.textSecondary },
                      travelMode === 'bicycling' && { color: '#FFFFFF' }
                    ]}>
                      Bike
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.travelModeButton,
                      { backgroundColor: theme.colors.border },
                      travelMode === 'walking' && { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => setTravelMode('walking')}
                  >
                    <Walk size={16} color={travelMode === 'walking' ? '#FFFFFF' : theme.colors.textSecondary} strokeWidth={2} />
                    <Text style={[
                      styles.travelModeText,
                      { color: theme.colors.textSecondary },
                      travelMode === 'walking' && { color: '#FFFFFF' }
                    ]}>
                      Walk
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {error && (
                  <View style={[styles.errorContainer, { backgroundColor: 'rgba(255, 107, 107, 0.1)' }]}>
                    <Text style={[styles.errorText, { color: '#FF6B6B' }]}>{error}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Current Location */}
            <View style={[styles.locationCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.locationHeader}>
                <Navigation size={20} color={theme.colors.primary} strokeWidth={2} />
                <Text style={[styles.locationTitle, { color: theme.colors.text }]}>Current Journey</Text>
              </View>
              <Text style={[styles.locationText, { color: theme.colors.text }]}>
                Home → Downtown Office
              </Text>
              <Text style={[styles.locationSubtext, { color: theme.colors.textSecondary }]}>
                Current: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </Text>
            </View>

            {/* Route Options */}
            <View style={styles.routesContainer}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Route Options</Text>
              
              {(routes.length > 0 ? routes : routeOptions).map((route) => (
                <TouchableOpacity
                  key={route.id}
                  style={[
                    styles.routeCard,
                    { backgroundColor: theme.colors.surface },
                    selectedRoute === route.id && { borderColor: theme.colors.primary }
                  ]}
                  onPress={() => handleRouteSelect(route.id)}
                >
                  <View style={styles.routeHeader}>
                    <View style={styles.routeInfo}>
                      <Text style={[styles.routeName, { color: theme.colors.text }]}>{route.name}</Text>
                      <Text style={[styles.routeDescription, { color: theme.colors.textSecondary }]}>{route.description}</Text>
                    </View>
                    
                    <View style={[
                      styles.stressBadge,
                      { backgroundColor: getStressColor(route.stressLevel) }
                    ]}>
                      {getStressIcon(route.stressLevel)}
                    </View>
                  </View>

                  <View style={styles.routeDetails}>
                    <View style={styles.detailItem}>
                      <Clock size={16} color={theme.colors.textSecondary} strokeWidth={2} />
                      <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>{route.duration}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <MapPin size={16} color={theme.colors.textSecondary} strokeWidth={2} />
                      <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>{route.distance}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <AlertTriangle size={16} color={theme.colors.textSecondary} strokeWidth={2} />
                      <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>{route.traffic}</Text>
                    </View>
                  </View>

                  {selectedRoute === route.id && (
                    <LinearGradient
                      colors={[theme.colors.primary, theme.colors.secondary]}
                      style={styles.selectedIndicator}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Zen Mode Suggestion */}
            <View style={styles.zenSuggestionCard}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.zenGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.zenTitle}>🧘‍♀️ Zen Mode Ready</Text>
                <Text style={styles.zenDescription}>
                  Based on your selected route, we recommend starting with ocean sounds and a 5-minute breathing exercise.
                </Text>
                
                <TouchableOpacity style={styles.zenButton}>
                  <View style={styles.zenButtonContent}>
                    <Text style={styles.zenButtonText}>Activate Zen Mode</Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* Stress Zones Info */}
            <View style={[styles.stressZonesCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Stress Zone Alerts</Text>
              
              <View style={styles.alertItem}>
                <View style={[styles.alertDot, { backgroundColor: '#FF6B6B' }]} />
                <View style={styles.alertContent}>
                  <Text style={[styles.alertTitle, { color: theme.colors.text }]}>High Traffic Area</Text>
                  <Text style={[styles.alertDescription, { color: theme.colors.textSecondary }]}>Construction on Main St. - Add 8 min buffer</Text>
                </View>
              </View>

              <View style={styles.alertItem}>
                <View style={[styles.alertDot, { backgroundColor: '#FFD93D' }]} />
                <View style={styles.alertContent}>
                  <Text style={[styles.alertTitle, { color: theme.colors.text }]}>School Zone</Text>
                  <Text style={[styles.alertDescription, { color: theme.colors.textSecondary }]}>Reduced speed 7:30-8:30 AM</Text>
                </View>
              </View>

              <View style={styles.alertItem}>
                <View style={[styles.alertDot, { backgroundColor: theme.colors.primary }]} />
                <View style={styles.alertContent}>
                  <Text style={[styles.alertTitle, { color: theme.colors.text }]}>Calm Zone</Text>
                  <Text style={[styles.alertDescription, { color: theme.colors.textSecondary }]}>Park area - Perfect for mindful driving</Text>
                </View>
              </View>
            </View>
            
            {/* Location Error Message */}
            {locationError && (
              <View style={[styles.errorBanner, { backgroundColor: 'rgba(255, 107, 107, 0.1)' }]}>
                <AlertTriangle size={16} color="#FF6B6B" strokeWidth={2} />
                <Text style={[styles.errorBannerText, { color: '#FF6B6B' }]}>
                  {locationError}
                </Text>
                <TouchableOpacity onPress={() => setLocationError(null)}>
                  <X size={16} color="#FF6B6B" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
    </ForestAnimations>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    marginTop: 4,
  },
  mapContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
    height: 250,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  map: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapWrapper: {
    position: 'relative',
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  findLocationButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  findLocationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  findLocationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    marginLeft: 6,
  },
  routePlanButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  routePlanCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  routePlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routePlanTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginLeft: 8,
    fontFamily: 'Quicksand-Regular',
  },
  locationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  travelModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  travelModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  travelModeText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    marginLeft: 4,
  },
  errorContainer: {
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    textAlign: 'center',
  },
  locationCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginLeft: 8,
  },
  locationText: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    marginBottom: 4,
  },
  locationSubtext: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
  },
  routesContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
  },
  routeCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  routeInfo: {
    flex: 1,
    marginRight: 16,
  },
  routeName: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    marginBottom: 4,
  },
  routeDescription: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 20,
  },
  stressBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
  },
  selectedIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  zenSuggestionCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#A8E6CF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  zenGradient: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  zenTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  zenDescription: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    opacity: 0.9,
  },
  zenButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  zenButtonContent: {
    alignItems: 'center',
  },
  zenButtonText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#A8E6CF',
  },
  stressZonesCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 2,
  },
  alertDescription: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
    marginHorizontal: 8,
  },
});