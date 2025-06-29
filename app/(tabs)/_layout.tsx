import { Tabs } from 'expo-router';
import { Map, Headphones, BookOpen, Trophy, Settings } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import PersistentAIFab from '@/components/PersistentAIFab';
import { useState } from 'react';
import { usePathname } from 'expo-router';

// Custom Home Icon Component
function HomeIcon({ size, color, strokeWidth = 2 }: { size: number; color: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* House base */}
      <path
        d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 21V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V21C14 20.5523 14.4477 21 15 21M9 21H15"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Door */}
      <path
        d="M12 15V18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Window */}
      <circle
        cx="8"
        cy="12"
        r="1"
        fill={color}
      />
    </svg>
  );
}

export default function TabLayout() {
  const { theme } = useTheme();
  const pathname = usePathname();
  
  // Extract current tab from pathname
  const getCurrentTab = () => {
    const segments = pathname.split('/');
    return segments[segments.length - 1] || 'index';
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.border,
            }
          ],
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarLabelStyle: styles.tabLabel,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => (
              <HomeIcon size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Map',
            tabBarIcon: ({ size, color }) => (
              <Map size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="sound"
          options={{
            title: 'Sound',
            tabBarIcon: ({ size, color }) => (
              <Headphones size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: 'Journal',
            tabBarIcon: ({ size, color }) => (
              <BookOpen size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="achievements"
          options={{
            title: 'Achievements',
            tabBarIcon: ({ size, color }) => (
              <Trophy size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ size, color }) => (
              <Settings size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
      </Tabs>
      
      {/* Persistent AI Assistant FAB */}
      <PersistentAIFab 
        currentTab={getCurrentTab()} 
        hasNewMessages={false} // This could be connected to actual message state
      />
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
    height: 70,
  },
  tabLabel: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 12,
    marginTop: 4,
  },
});