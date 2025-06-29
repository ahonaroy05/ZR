import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { X, Clock, Moon } from 'lucide-react-native';

interface SleepTimerModalProps {
  visible: boolean;
  onClose: () => void;
  onTimerSet: (minutes: number) => void;
}

export default function SleepTimerModal({ visible, onClose, onTimerSet }: SleepTimerModalProps) {
  const { theme } = useTheme();
  const [selectedMinutes, setSelectedMinutes] = useState(30);

  const timerOptions = [15, 30, 45, 60, 90, 120];

  const handleSetTimer = () => {
    onTimerSet(selectedMinutes);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
                <Moon size={24} color="#FFFFFF" strokeWidth={2} />
              </View>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Sleep Timer</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            Set a timer to automatically fade out and stop all sounds
          </Text>

          {/* Timer Options */}
          <View style={styles.timerOptions}>
            {timerOptions.map((minutes) => (
              <TouchableOpacity
                key={minutes}
                style={[
                  styles.timerOption,
                  { 
                    backgroundColor: theme.colors.border,
                    borderColor: theme.colors.border,
                  },
                  selectedMinutes === minutes && {
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.primary,
                  },
                ]}
                onPress={() => setSelectedMinutes(minutes)}
              >
                <Clock 
                  size={20} 
                  color={selectedMinutes === minutes ? '#FFFFFF' : theme.colors.textSecondary} 
                  strokeWidth={2} 
                />
                <Text
                  style={[
                    styles.timerOptionText,
                    { color: theme.colors.textSecondary },
                    selectedMinutes === minutes && { color: '#FFFFFF' },
                  ]}
                >
                  {minutes} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Timer Info */}
          <View style={[styles.infoBox, { backgroundColor: theme.colors.border }]}>
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              The timer will gradually fade out all sounds over the last 2 minutes, 
              helping you drift off peacefully.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: theme.colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.setButton} onPress={handleSetTimer}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.setButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.setButtonText}>Set Timer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 20,
    marginBottom: 24,
  },
  timerOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  timerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  timerOptionText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
  },
  setButton: {
    flex: 1,
    borderRadius: 12,
  },
  setButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  setButtonText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#FFFFFF',
  },
});