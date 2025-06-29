import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export interface SoundTrack {
  id: string;
  name: string;
  url: string;
  duration?: number;
}

export const AMBIENT_SOUNDS: SoundTrack[] = [
  {
    id: 'ocean',
    name: 'Ocean Waves',
    url: 'https://www.soundjay.com/misc/sounds/ocean-wave-1.wav', // Example URL
  },
  {
    id: 'forest',
    name: 'Forest Ambience',
    url: 'https://www.soundjay.com/nature/sounds/forest-1.wav', // Example URL
  },
  {
    id: 'wind',
    name: 'Wind Chimes',
    url: 'https://pixabay.com/sound-effects/wind-gust-24912/', // Example URL
  },
  {
    id: 'rain',
    name: 'Gentle Rain',
    url: 'https://www.soundjay.com/nature/sounds/rain-1.wav', // Example URL
  },
];

class SoundService {
  private static instance: SoundService;
  private currentSound: Audio.Sound | null = null;
  private isPlaying = false;
  private volume = 0.7;

  static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  async initialize(): Promise<void> {
    if (Platform.OS !== 'web') {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.warn('Failed to set audio mode:', error);
      }
    }
  }

  async playSound(soundId: string): Promise<boolean> {
    try {
      // Stop current sound if playing
      await this.stopSound();

      const soundTrack = AMBIENT_SOUNDS.find(sound => sound.id === soundId);
      if (!soundTrack) {
        console.warn(`Sound with id ${soundId} not found`);
        return false;
      }

      if (Platform.OS === 'web') {
        // For web, we'll use HTML5 Audio API
        return this.playWebAudio(soundTrack.url);
      }

      // For native platforms, use Expo AV
      const { sound } = await Audio.Sound.createAsync(
        { uri: soundTrack.url },
        {
          shouldPlay: true,
          isLooping: true,
          volume: this.volume,
        }
      );

      this.currentSound = sound;
      this.isPlaying = true;
      return true;
    } catch (error) {
      console.error('Error playing sound:', error);
      return false;
    }
  }

  private playWebAudio(url: string): boolean {
    try {
      // Create a simple audio element for web
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = this.volume;
      audio.play();
      
      // Store reference for stopping later
      (this as any).webAudio = audio;
      this.isPlaying = true;
      return true;
    } catch (error) {
      console.error('Error playing web audio:', error);
      return false;
    }
  }

  async stopSound(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        const webAudio = (this as any).webAudio;
        if (webAudio) {
          webAudio.pause();
          webAudio.currentTime = 0;
          (this as any).webAudio = null;
        }
      } else if (this.currentSound) {
        await this.currentSound.unloadAsync();
        this.currentSound = null;
      }
      this.isPlaying = false;
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  }

  async setVolume(volume: number): Promise<void> {
    this.volume = Math.max(0, Math.min(1, volume / 100)); // Convert percentage to 0-1 range
    
    try {
      if (Platform.OS === 'web') {
        const webAudio = (this as any).webAudio;
        if (webAudio) {
          webAudio.volume = this.volume;
        }
      } else if (this.currentSound) {
        await this.currentSound.setVolumeAsync(this.volume);
      }
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  }

  async pauseSound(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        const webAudio = (this as any).webAudio;
        if (webAudio) {
          webAudio.pause();
        }
      } else if (this.currentSound) {
        await this.currentSound.pauseAsync();
      }
      this.isPlaying = false;
    } catch (error) {
      console.error('Error pausing sound:', error);
    }
  }

  async resumeSound(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        const webAudio = (this as any).webAudio;
        if (webAudio) {
          await webAudio.play();
        }
      } else if (this.currentSound) {
        await this.currentSound.playAsync();
      }
      this.isPlaying = true;
    } catch (error) {
      console.error('Error resuming sound:', error);
    }
  }

  async fadeVolume(targetVolume: number, duration: number = 1000): Promise<void> {
    const startVolume = this.volume;
    const targetVol = Math.max(0, Math.min(1, targetVolume / 100));
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = (targetVol - startVolume) / steps;

    for (let i = 0; i <= steps; i++) {
      const currentVolume = startVolume + (volumeStep * i);
      await this.setVolume(currentVolume * 100);
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  }

  getVolume(): number {
    return this.volume * 100; // Convert back to percentage
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Simulate sound playback for demo purposes
  simulateSound(soundId: string): boolean {
    console.log(`🎵 Playing ambient sound: ${soundId}`);
    this.isPlaying = true;
    return true;
  }

  simulateStop(): void {
    console.log('🔇 Stopping ambient sound');
    this.isPlaying = false;
  }

  // Enhanced simulation methods for better demo experience
  simulateFadeIn(soundId: string, duration: number = 2000): void {
    console.log(`🎵 Fading in ambient sound: ${soundId} over ${duration}ms`);
    this.isPlaying = true;
  }

  simulateFadeOut(duration: number = 2000): void {
    console.log(`🔇 Fading out ambient sound over ${duration}ms`);
    setTimeout(() => {
      this.isPlaying = false;
    }, duration);
  }
}

export default SoundService;