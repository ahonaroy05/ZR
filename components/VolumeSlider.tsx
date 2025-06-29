import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Volume2, VolumeX } from 'lucide-react-native';

// Import Slider conditionally based on platform
let Slider: any;
if (Platform.OS !== 'web') {
  try {
    Slider = require('@react-native-community/slider').default;
  } catch (error) {
    console.warn('Slider component not available, using fallback');
  }
}

interface VolumeSliderProps {
  label: string;
  value: number;
  isMuted: boolean;
  onValueChange: (value: number) => void;
  onMuteToggle: () => void;
  effectiveVolume?: number;
  disabled?: boolean;
}

// Fallback slider component for web
const WebSlider = ({ value, onValueChange, minimumValue = 0, maximumValue = 100, disabled = false, style }: any) => {
  const { theme } = useTheme();
  
  return (
    <input
      type="range"
      min={minimumValue}
      max={maximumValue}
      value={value}
      onChange={(e) => onValueChange(Number(e.target.value))}
      disabled={disabled}
      style={{
        width: '100%',
        height: 6,
        borderRadius: 3,
        background: `linear-gradient(to right, ${theme.colors.primary} 0%, ${theme.colors.primary} ${value}%, ${theme.colors.border} ${value}%, ${theme.colors.border} 100%)`,
        outline: 'none',
        appearance: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    />
  );
};

export default function VolumeSlider({
  label,
  value,
  isMuted,
  onValueChange,
  onMuteToggle,
  effectiveVolume,
  disabled = false,
}: VolumeSliderProps) {
  const { theme } = useTheme();
  
  const SliderComponent = Platform.OS === 'web' ? WebSlider : Slider;
  
  if (!SliderComponent) {
    // Fallback UI if slider is not available
    return (
      <View style={[styles.container, disabled && styles.disabled]}>
        <View style={styles.header}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
          <TouchableOpacity
            onPress={onMuteToggle}
            style={styles.muteButton}
            disabled={disabled}
          >
            {isMuted ? (
              <VolumeX size={20} color={theme.colors.textSecondary} strokeWidth={2} />
            ) : (
              <Volume2 size={20} color={theme.colors.primary} strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.fallbackSlider}>
          <Text style={[styles.volumeText, { color: theme.colors.textSecondary }]}>
            Slider not available - {isMuted ? '0' : value}%
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
        <TouchableOpacity
          onPress={onMuteToggle}
          style={styles.muteButton}
          disabled={disabled}
        >
          {isMuted ? (
            <VolumeX size={20} color={theme.colors.textSecondary} strokeWidth={2} />
          ) : (
            <Volume2 size={20} color={theme.colors.primary} strokeWidth={2} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.sliderContainer}>
        <SliderComponent
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={isMuted ? 0 : value}
          onValueChange={onValueChange}
          disabled={disabled || isMuted}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.border}
          thumbTintColor={theme.colors.primary}
          step={1}
        />
        
        <View style={styles.volumeInfo}>
          <Text style={[styles.volumeText, { color: theme.colors.textSecondary }]}>
            {isMuted ? '0' : value}%
          </Text>
          {effectiveVolume !== undefined && effectiveVolume !== value && !isMuted && (
            <Text style={[styles.effectiveVolumeText, { color: theme.colors.textSecondary }]}>
              (Effective: {effectiveVolume}%)
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  disabled: {
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
  },
  muteButton: {
    padding: 4,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  volumeInfo: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  volumeText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },
  effectiveVolumeText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    marginTop: 2,
  },
  fallbackSlider: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
});