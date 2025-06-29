import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { X, Save, Music, Trash2 } from 'lucide-react-native';

interface SoundOption {
  id: string;
  name: string;
  volume: number;
  isPlaying: boolean;
}

interface SavedMix {
  id: string;
  name: string;
  sounds: SoundOption[];
  createdAt: Date;
}

interface SaveMixModalProps {
  visible: boolean;
  onClose: () => void;
  currentMix: SoundOption[];
  onSave: (mixName: string) => void;
}

export default function SaveMixModal({ visible, onClose, currentMix, onSave }: SaveMixModalProps) {
  const { theme } = useTheme();
  const [mixName, setMixName] = useState('');
  const [savedMixes, setSavedMixes] = useState<SavedMix[]>([
    {
      id: '1',
      name: 'Morning Focus',
      sounds: [
        { id: 'forest', name: 'Forest Ambience', volume: 70, isPlaying: true },
        { id: 'wind', name: 'Wind Chimes', volume: 40, isPlaying: true },
      ],
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Evening Calm',
      sounds: [
        { id: 'ocean', name: 'Ocean Waves', volume: 80, isPlaying: true },
        { id: 'rain', name: 'Gentle Rain', volume: 60, isPlaying: true },
      ],
      createdAt: new Date('2024-01-10'),
    },
  ]);

  const handleSaveMix = () => {
    if (!mixName.trim()) {
      Alert.alert('Error', 'Please enter a name for your mix');
      return;
    }

    if (currentMix.length === 0) {
      Alert.alert('Error', 'No sounds are currently playing to save');
      return;
    }

    const newMix: SavedMix = {
      id: Date.now().toString(),
      name: mixName.trim(),
      sounds: currentMix,
      createdAt: new Date(),
    };

    setSavedMixes(prev => [newMix, ...prev]);
    onSave(mixName.trim());
    setMixName('');
    Alert.alert('Success', `Mix "${mixName.trim()}" saved successfully!`);
  };

  const handleDeleteMix = (mixId: string) => {
    Alert.alert(
      'Delete Mix',
      'Are you sure you want to delete this mix?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSavedMixes(prev => prev.filter(mix => mix.id !== mixId));
          },
        },
      ]
    );
  };

  const handleLoadMix = (mix: SavedMix) => {
    Alert.alert(
      'Load Mix',
      `Load "${mix.name}"? This will replace your current sound settings.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Load',
          onPress: () => {
            // In a real app, this would update the sound state
            console.log('Loading mix:', mix);
            Alert.alert('Mix Loaded', `"${mix.name}" has been loaded!`);
            onClose();
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
                <Music size={24} color="#FFFFFF" strokeWidth={2} />
              </View>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Sound Mixes</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Save Current Mix */}
            <View style={styles.saveSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Save Current Mix
              </Text>
              
              {currentMix.length > 0 ? (
                <>
                  <View style={styles.currentMixPreview}>
                    {currentMix.map((sound, index) => (
                      <Text key={sound.id} style={[styles.soundPreview, { color: theme.colors.textSecondary }]}>
                        {sound.name} ({sound.volume}%)
                        {index < currentMix.length - 1 && ' • '}
                      </Text>
                    ))}
                  </View>

                  <TextInput
                    style={[
                      styles.nameInput,
                      { 
                        backgroundColor: theme.colors.border,
                        color: theme.colors.text,
                        borderColor: theme.colors.border,
                      }
                    ]}
                    placeholder="Enter mix name..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={mixName}
                    onChangeText={setMixName}
                    maxLength={30}
                  />

                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveMix}>
                    <LinearGradient
                      colors={[theme.colors.primary, theme.colors.secondary]}
                      style={styles.saveButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Save size={20} color="#FFFFFF" strokeWidth={2} />
                      <Text style={styles.saveButtonText}>Save Mix</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={[styles.noSoundsText, { color: theme.colors.textSecondary }]}>
                  No sounds are currently playing. Start some sounds to create a mix!
                </Text>
              )}
            </View>

            {/* Saved Mixes */}
            <View style={styles.savedSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Saved Mixes ({savedMixes.length})
              </Text>

              {savedMixes.map((mix) => (
                <View key={mix.id} style={[styles.mixCard, { backgroundColor: theme.colors.border }]}>
                  <TouchableOpacity 
                    style={styles.mixCardContent}
                    onPress={() => handleLoadMix(mix)}
                  >
                    <View style={styles.mixInfo}>
                      <Text style={[styles.mixName, { color: theme.colors.text }]}>
                        {mix.name}
                      </Text>
                      <Text style={[styles.mixDate, { color: theme.colors.textSecondary }]}>
                        {formatDate(mix.createdAt)}
                      </Text>
                      <View style={styles.mixSounds}>
                        {mix.sounds.map((sound, index) => (
                          <Text key={sound.id} style={[styles.mixSoundText, { color: theme.colors.textSecondary }]}>
                            {sound.name}
                            {index < mix.sounds.length - 1 && ' • '}
                          </Text>
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteMix(mix.id)}
                  >
                    <Trash2 size={18} color={theme.colors.textSecondary} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              ))}

              {savedMixes.length === 0 && (
                <Text style={[styles.noMixesText, { color: theme.colors.textSecondary }]}>
                  No saved mixes yet. Create your first mix above!
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
  scrollView: {
    flex: 1,
  },
  saveSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
  },
  currentMixPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  soundPreview: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
  },
  nameInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    marginBottom: 16,
  },
  saveButton: {
    borderRadius: 12,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#FFFFFF',
  },
  noSoundsText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  savedSection: {
    flex: 1,
  },
  mixCard: {
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mixCardContent: {
    flex: 1,
    padding: 16,
  },
  mixInfo: {
    flex: 1,
  },
  mixName: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 4,
  },
  mixDate: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    marginBottom: 8,
  },
  mixSounds: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mixSoundText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
  },
  deleteButton: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMixesText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
});