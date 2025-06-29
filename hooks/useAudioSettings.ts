import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SoundService from '@/lib/soundService';

export interface AudioSettings {
  masterVolume: number;
  backgroundMusicVolume: number;
  soundEffectsVolume: number;
  voiceVolume: number;
  isMasterMuted: boolean;
  isBackgroundMusicMuted: boolean;
  isSoundEffectsMuted: boolean;
  isVoiceMuted: boolean;
}

const DEFAULT_SETTINGS: AudioSettings = {
  masterVolume: 75,
  backgroundMusicVolume: 70,
  soundEffectsVolume: 80,
  voiceVolume: 85,
  isMasterMuted: false,
  isBackgroundMusicMuted: false,
  isSoundEffectsMuted: false,
  isVoiceMuted: false,
};

const STORAGE_KEY = 'zenroute_audio_settings';

export function useAudioSettings() {
  const [settings, setSettings] = useState<AudioSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  // Load settings from storage on mount
  useEffect(() => {
    loadSettings();
    
    return () => {
      mounted.current = false;
    };
  }, []);

  // Apply volume changes to sound service
  useEffect(() => {
    const soundService = SoundService.getInstance();
    const effectiveVolume = settings.isMasterMuted ? 0 : 
      (settings.masterVolume / 100) * (settings.backgroundMusicVolume / 100);
    
    soundService.setVolume(effectiveVolume);
  }, [settings.masterVolume, settings.backgroundMusicVolume, settings.isMasterMuted, settings.isBackgroundMusicMuted]);

  const loadSettings = async () => {
    try {
      if (mounted.current) setLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        if (mounted.current) setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (err) {
      if (mounted.current) setError('Failed to load audio settings');
      console.error('Error loading audio settings:', err);
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  const saveSettings = async (newSettings: AudioSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      if (mounted.current) {
        setSettings(newSettings);
        setError(null);
      }
    } catch (err) {
      if (mounted.current) setError('Failed to save audio settings');
      console.error('Error saving audio settings:', err);
    }
  };

  const updateMasterVolume = (volume: number) => {
    const newSettings = { ...settings, masterVolume: Math.max(0, Math.min(100, volume)) };
    saveSettings(newSettings);
  };

  const updateBackgroundMusicVolume = (volume: number) => {
    const newSettings = { ...settings, backgroundMusicVolume: Math.max(0, Math.min(100, volume)) };
    saveSettings(newSettings);
  };

  const updateSoundEffectsVolume = (volume: number) => {
    const newSettings = { ...settings, soundEffectsVolume: Math.max(0, Math.min(100, volume)) };
    saveSettings(newSettings);
  };

  const updateVoiceVolume = (volume: number) => {
    const newSettings = { ...settings, voiceVolume: Math.max(0, Math.min(100, volume)) };
    saveSettings(newSettings);
  };

  const toggleMasterMute = () => {
    const newSettings = { ...settings, isMasterMuted: !settings.isMasterMuted };
    saveSettings(newSettings);
  };

  const toggleBackgroundMusicMute = () => {
    const newSettings = { ...settings, isBackgroundMusicMuted: !settings.isBackgroundMusicMuted };
    saveSettings(newSettings);
  };

  const toggleSoundEffectsMute = () => {
    const newSettings = { ...settings, isSoundEffectsMuted: !settings.isSoundEffectsMuted };
    saveSettings(newSettings);
  };

  const toggleVoiceMute = () => {
    const newSettings = { ...settings, isVoiceMuted: !settings.isVoiceMuted };
    saveSettings(newSettings);
  };

  const resetToDefaults = () => {
    saveSettings(DEFAULT_SETTINGS);
  };

  const getEffectiveVolume = (category: 'background' | 'effects' | 'voice'): number => {
    if (settings.isMasterMuted) return 0;
    
    const masterMultiplier = settings.masterVolume / 100;
    
    switch (category) {
      case 'background':
        return settings.isBackgroundMusicMuted ? 0 : 
          Math.round(masterMultiplier * settings.backgroundMusicVolume);
      case 'effects':
        return settings.isSoundEffectsMuted ? 0 : 
          Math.round(masterMultiplier * settings.soundEffectsVolume);
      case 'voice':
        return settings.isVoiceMuted ? 0 : 
          Math.round(masterMultiplier * settings.voiceVolume);
      default:
        return 0;
    }
  };

  return {
    settings,
    loading,
    error,
    updateMasterVolume,
    updateBackgroundMusicVolume,
    updateSoundEffectsVolume,
    updateVoiceVolume,
    toggleMasterMute,
    toggleBackgroundMusicMute,
    toggleSoundEffectsMute,
    toggleVoiceMute,
    resetToDefaults,
    getEffectiveVolume,
  };
}