import { useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function Index() {
  const { session, loading: authLoading } = useAuth();
  const { theme } = useTheme();

  // Early return if theme is not yet available
  if (!theme) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#ffffff' // fallback background color
      }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const navigateBasedOnAuth = useCallback(() => {
    if (!authLoading) {
      if (session) {
        // User is authenticated, go to main app
        router.replace('/(tabs)');
      } else {
        // User is not authenticated, go to splash/onboarding
        router.replace('/splash');
      }
    }
  }, [session, authLoading]);

  useEffect(() => {
    navigateBasedOnAuth();
  }, [navigateBasedOnAuth]);

  if (authLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme.colors.background 
      }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return null;
}