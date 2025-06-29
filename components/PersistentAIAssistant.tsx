import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react-native';
import AIWellnessAssistant from './AIWellnessAssistant';

const { width, height } = Dimensions.get('window');

interface PersistentAIAssistantProps {
  currentTab?: string;
}

export default function PersistentAIAssistant({ currentTab }: PersistentAIAssistantProps) {
  // This component is now deprecated in favor of PersistentAIFab
  // Keeping for backward compatibility
  const { theme } = useTheme();
  const [showFullAssistant, setShowFullAssistant] = useState(false);

  return (
    <AIWellnessAssistant
      visible={showFullAssistant}
      onClose={() => setShowFullAssistant(false)}
    />
  );
}

const styles = StyleSheet.create({});