import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Sun, Moon, Eye, Smartphone } from 'lucide-react-native';

export default function BrightnessSettingsScreen() {
  const { theme } = useTheme();
  const [autoDim, setAutoDim] = useState(true);
  const [dimLevel, setDimLevel] = useState(30);
  const [adaptiveBrightness, setAdaptiveBrightness] = useState(false);

  const dimLevels = [
    { value: 10, label: 'Very Dim' },
    { value: 30, label: 'Dim' },
    { value: 50, label: 'Medium' },
    { value: 70, label: 'Bright' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradient.sunset}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.colors.text }]}>Brightness Settings</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            {/* Auto Dim Setting */}
            <View style={[styles.settingCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.settingHeader}>
                <View style={styles.settingInfo}>
                  <View style={[styles.settingIcon, { backgroundColor: theme.colors.primary }]}>
                    <Moon size={20} color="#FFFFFF" strokeWidth={2} />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                      Auto-Dim During Sessions
                    </Text>
                    <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                      Automatically reduce screen brightness during meditation sessions
                    </Text>
                  </View>
                </View>
                <Switch
                  value={autoDim}
                  onValueChange={setAutoDim}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Dim Level Selection */}
            {autoDim && (
              <View style={[styles.settingCard, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Dim Level</Text>
                <View style={styles.dimLevels}>
                  {dimLevels.map((level) => (
                    <TouchableOpacity
                      key={level.value}
                      style={[
                        styles.dimLevelButton,
                        { backgroundColor: theme.colors.border },
                        dimLevel === level.value && { backgroundColor: theme.colors.primary },
                      ]}
                      onPress={() => setDimLevel(level.value)}
                    >
                      <Text
                        style={[
                          styles.dimLevelText,
                          { color: theme.colors.text },
                          dimLevel === level.value && { color: '#FFFFFF' },
                        ]}
                      >
                        {level.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Adaptive Brightness */}
            <View style={[styles.settingCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.settingHeader}>
                <View style={styles.settingInfo}>
                  <View style={[styles.settingIcon, { backgroundColor: theme.colors.secondary }]}>
                    <Eye size={20} color="#FFFFFF" strokeWidth={2} />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                      Adaptive Brightness
                    </Text>
                    <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                      Adjust brightness based on ambient light conditions
                    </Text>
                  </View>
                </View>
                <Switch
                  value={adaptiveBrightness}
                  onValueChange={setAdaptiveBrightness}
                  trackColor={{ false: theme.colors.border, true: theme.colors.secondary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Preview */}
            <View style={[styles.previewCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Preview</Text>
              <View style={styles.previewContainer}>
                <View
                  style={[
                    styles.previewScreen,
                    {
                      backgroundColor: theme.colors.primary,
                      opacity: autoDim ? dimLevel / 100 : 1,
                    },
                  ]}
                >
                  <Smartphone size={40} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.previewText}>
                    {autoDim ? `${dimLevel}% Brightness` : 'Normal Brightness'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Info */}
            <View style={[styles.infoCard, { backgroundColor: theme.colors.border }]}>
              <Text style={[styles.infoText, { color: theme.colors.text }]}>
                💡 Dimming the screen during meditation sessions can help reduce distractions and create a more immersive experience.
              </Text>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  settingCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
  },
  dimLevels: {
    flexDirection: 'row',
    gap: 8,
  },
  dimLevelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  dimLevelText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },
  previewCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewScreen: {
    width: 120,
    height: 200,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  previewText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    color: '#FFFFFF',
    marginTop: 8,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 20,
  },
});