import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TriangleAlert as AlertTriangle, X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface EmergencyCalmButtonProps {
  onPress?: () => void;
}

export default function EmergencyCalmButton({ onPress }: EmergencyCalmButtonProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { theme } = useTheme();

  const groundingSteps = [
    { number: 5, instruction: "Name 5 things you can see around you" },
    { number: 4, instruction: "Name 4 things you can touch" },
    { number: 3, instruction: "Name 3 things you can hear" },
    { number: 2, instruction: "Name 2 things you can smell" },
    { number: 1, instruction: "Name 1 thing you can taste" },
  ];

  const handleEmergencyPress = () => {
    setIsModalVisible(true);
    setCurrentStep(0);
    onPress?.();
  };

  const handleNextStep = () => {
    if (currentStep < groundingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsModalVisible(false);
      setCurrentStep(0);
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setCurrentStep(0);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleEmergencyPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[theme.colors.pastel.rose, theme.colors.pastel.pink]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <AlertTriangle size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.buttonText}>Emergency Calm</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleClose}
            >
              <X size={24} color={theme.colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>

            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              5-4-3-2-1 Grounding Exercise
            </Text>
            <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>
              Focus on your senses to calm your mind
            </Text>

            <View style={styles.stepContainer}>
              <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.stepNumberText}>
                  {groundingSteps[currentStep].number}
                </Text>
              </View>
              
              <Text style={[styles.stepInstruction, { color: theme.colors.text }]}>
                {groundingSteps[currentStep].instruction}
              </Text>
            </View>

            <View style={styles.progressContainer}>
              {groundingSteps.map((_, index) => (
                <View 
                  key={index}
                  style={[
                    styles.progressDot,
                    { backgroundColor: index <= currentStep ? theme.colors.primary : theme.colors.border }
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity 
              style={styles.nextButton}
              onPress={handleNextStep}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.nextButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.nextButtonText}>
                  {currentStep < groundingSteps.length - 1 ? 'Next' : 'Complete'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  gradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
    marginTop: 16,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepNumber: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#A8E6CF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  stepNumberText: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
  stepInstruction: {
    fontSize: 18,
    fontFamily: 'Quicksand-Medium',
    textAlign: 'center',
    lineHeight: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  nextButton: {
    borderRadius: 12,
  },
  nextButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#FFFFFF',
  },
});