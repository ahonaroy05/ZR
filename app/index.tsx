import { useEffect, useCallback, useRef } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function Index() {
  const { session, loading: authLoading } = useAuth();
  const mountedRef = useRef(false);
  
  // Wrap useTheme in try-catch to handle initialization errors
  let theme;
  try {
    theme = useTheme().theme;
  } catch (error) {
    // Theme context not yet available, theme will remain undefined
    theme = undefined;
  }

  // Track component mount status
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
    if (!authLoading && mountedRef.current) {
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