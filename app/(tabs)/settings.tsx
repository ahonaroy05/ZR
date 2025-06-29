import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { User, Bell, Volume2, Monitor, Clock, ChartBar as BarChart3, Shield, CircleHelp as HelpCircle, Info, ChevronRight, Moon, Sun, Smartphone, Eye, Accessibility, Download, Trash2, LogOut } from 'lucide-react-native';
import ThemeToggle from '@/components/ThemeToggle';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoZenMode, setAutoZenMode] = useState(false);
  const [locationTracking, setLocationTracking] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Navigate to a dedicated account deletion confirmation screen
            router.push('/account/delete-confirmation');
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Your data export will be sent to your email address within 24 hours.');
  };

  const settingSections: SettingSection[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile Settings',
          subtitle: user?.email || 'Manage your profile',
          icon: User,
          type: 'navigation',
          onPress: () => router.push('/profile/edit')
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Wellness reminders and alerts',
          icon: Bell,
          type: 'toggle',
          value: notifications,
          onToggle: setNotifications
        },
        {
          id: 'zen-auto',
          title: 'Auto Zen Mode',
          subtitle: 'Automatically activate in stress zones',
          icon: Moon,
          type: 'toggle',
          value: autoZenMode,
          onToggle: setAutoZenMode
        }
      ]
    },
    {
      title: 'Audio & Display',
      items: [
        {
          id: 'sound',
          title: 'Sound Effects',
          subtitle: 'App sounds and audio feedback',
          icon: Volume2,
          type: 'toggle',
          value: soundEnabled,
          onToggle: setSoundEnabled
        },
        {
          id: 'theme',
          title: 'Appearance',
          subtitle: theme.isDark ? 'Dark mode' : 'Light mode',
          icon: theme.isDark ? Moon : Sun,
          type: 'action',
          onPress: toggleTheme
        },
        {
          id: 'brightness',
          title: 'Zen Mode Brightness',
          subtitle: 'Auto-dim during sessions',
          icon: Eye,
          type: 'navigation',
          onPress: () => router.push('/settings/brightness')
        }
      ]
    },
    {
      title: 'Wellness',
      items: [
        {
          id: 'session-duration',
          title: 'Default Session Duration',
          subtitle: '5 minutes',
          icon: Clock,
          type: 'navigation',
          onPress: () => router.push('/settings/session-duration')
        },
        {
          id: 'progress',
          title: 'Progress Tracking',
          subtitle: 'View your wellness metrics',
          icon: BarChart3,
          type: 'navigation',
          onPress: () => router.push('/progress')
        }
      ]
    },
    {
      title: 'Privacy & Data',
      items: [
        {
          id: 'location',
          title: 'Location Tracking',
          subtitle: 'For stress zone detection',
          icon: Smartphone,
          type: 'toggle',
          value: locationTracking,
          onToggle: setLocationTracking
        },
        {
          id: 'data-collection',
          title: 'Anonymous Analytics',
          subtitle: 'Help improve the app',
          icon: BarChart3,
          type: 'toggle',
          value: dataCollection,
          onToggle: setDataCollection
        },
        {
          id: 'export-data',
          title: 'Export My Data',
          subtitle: 'Download your wellness data',
          icon: Download,
          type: 'action',
          onPress: handleExportData
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          icon: Shield,
          type: 'navigation',
          onPress: () => Alert.alert('Privacy Policy', 'Your privacy is important to us. We only collect data necessary to provide wellness insights.')
        }
      ]
    },
    {
      title: 'Accessibility',
      items: [
        {
          id: 'accessibility',
          title: 'Accessibility Mode',
          subtitle: 'Enhanced contrast and text size',
          icon: Accessibility,
          type: 'toggle',
          value: accessibilityMode,
          onToggle: setAccessibilityMode
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help with the app',
          icon: HelpCircle,
          type: 'navigation',
          onPress: () => router.push('/help')
        },
        {
          id: 'about',
          title: 'About ZenRoute',
          subtitle: 'Version 1.0.0',
          icon: Info,
          type: 'navigation',
          onPress: () => router.push('/about')
        }
      ]
    },
    {
      title: 'Account Actions',
      items: [
        {
          id: 'delete-account',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          icon: Trash2,
          type: 'action',
          onPress: handleDeleteAccount
        },
        {
          id: 'sign-out',
          title: 'Sign Out',
          icon: LogOut,
          type: 'action',
          onPress: handleSignOut
        }
      ]
    }
  ];

  const renderSettingItem = (item: SettingItem) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
        onPress={item.onPress}
        disabled={item.type === 'toggle'}
      >
        <View style={styles.settingItemLeft}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.border }]}>
            <IconComponent size={20} color={theme.colors.primary} strokeWidth={2} />
          </View>
          <View style={styles.settingItemText}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                {item.subtitle}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.settingItemRight}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
            />
          )}
          {item.type === 'navigation' && (
            <ChevronRight size={20} color={theme.colors.textSecondary} strokeWidth={2} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradient.primary}
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
                <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  Customize your wellness experience
                </Text>
              </View>
              <ThemeToggle />
            </View>

            {/* User Profile Card */}
            <View style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.profileGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.profileAvatar}>
                  <User size={32} color="#FFFFFF" strokeWidth={2} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {user?.user_metadata?.full_name || 'Wellness Traveler'}
                  </Text>
                  <Text style={styles.profileEmail}>
                    {user?.email || 'user@example.com'}
                  </Text>
                </View>
              </LinearGradient>
            </View>

            {/* Settings Sections */}
            {settingSections.map((section, index) => (
              <View key={section.title} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  {section.title}
                </Text>
                <View style={styles.sectionContent}>
                  {section.items.map(renderSettingItem)}
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
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
  profileCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  profileGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    marginBottom: 12,
    marginHorizontal: 24,
  },
  sectionContent: {
    marginHorizontal: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingItemText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
  },
  settingItemRight: {
    marginLeft: 12,
  },
  audioSection: {
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    padding: 20,
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  resetButtonText: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
  },
});