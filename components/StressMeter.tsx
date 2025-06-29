import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface StressMeterProps {
  stressLevel: number;
  size?: number;
}

export default function StressMeter({ stressLevel, size = 120 }: StressMeterProps) {
  const { theme } = useTheme();

  const getStressColor = (level: number) => {
    if (level < 30) return theme.colors.pastel.mint; // Mint - Low stress
    if (level < 60) return theme.colors.pastel.peach; // Peach - Medium stress
    if (level < 80) return theme.colors.pastel.rose; // Rose - High stress
    return theme.colors.pastel.pink; // Pink - Very high stress
  };

  const getStressLabel = (level: number) => {
    if (level < 30) return 'Low';
    if (level < 60) return 'Moderate';
    if (level < 80) return 'High';
    return 'Very High';
  };

  const circumference = 2 * Math.PI * (size / 2 - 10);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (stressLevel / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <LinearGradient
        colors={[getStressColor(stressLevel), theme.colors.pastel.cream]}
        style={[styles.gradient, { width: size, height: size, borderRadius: size / 2 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <Text style={[styles.percentage, { color: theme.colors.text }]}>
            {stressLevel}%
          </Text>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            {getStressLabel(stressLevel)}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
    textAlign: 'center',
    marginTop: 4,
  },
});