import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { X, ChevronLeft, ChevronRight, Heart, Share } from 'lucide-react-native';

interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
  gradient: string[];
}

interface MotivationalQuotesModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const MOTIVATIONAL_QUOTES: Quote[] = [
  {
    id: '1',
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Purpose",
    gradient: ['#FFD93D', '#A8E6CF'],
  },
  {
    id: '2',
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "Confidence",
    gradient: ['#DDA0DD', '#FFB6C1'],
  },
  {
    id: '3',
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Resilience",
    gradient: ['#A8E6CF', '#81ECEC'],
  },
  {
    id: '4',
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "Dreams",
    gradient: ['#FFB6C1', '#DDA0DD'],
  },
  {
    id: '5',
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "Hope",
    gradient: ['#81ECEC', '#FFD93D'],
  },
  {
    id: '6',
    text: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
    category: "Growth",
    gradient: ['#FFD93D', '#FFB6C1'],
  },
  {
    id: '7',
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "Action",
    gradient: ['#A8E6CF', '#DDA0DD'],
  },
  {
    id: '8',
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "Persistence",
    gradient: ['#DDA0DD', '#81ECEC'],
  },
];

export default function MotivationalQuotesModal({ visible, onClose }: MotivationalQuotesModalProps) {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedQuotes, setLikedQuotes] = useState<Set<string>>(new Set());
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const currentQuote = MOTIVATIONAL_QUOTES[currentIndex];

  const handleSwipeLeft = () => {
    if (currentIndex < MOTIVATIONAL_QUOTES.length - 1) {
      animateToNext();
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      animateToPrevious();
    }
  };

  const animateToNext = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex(prev => Math.min(prev + 1, MOTIVATIONAL_QUOTES.length - 1));
      translateX.setValue(width);
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const animateToPrevious = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
      translateX.setValue(-width);
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleLikeQuote = () => {
    const newLikedQuotes = new Set(likedQuotes);
    if (likedQuotes.has(currentQuote.id)) {
      newLikedQuotes.delete(currentQuote.id);
    } else {
      newLikedQuotes.add(currentQuote.id);
    }
    setLikedQuotes(newLikedQuotes);
  };

  const handleShareQuote = () => {
    // In a real app, this would use the Share API
    console.log('Sharing quote:', currentQuote.text);
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      
      if (Math.abs(translationX) > width * 0.3 || Math.abs(velocityX) > 500) {
        if (translationX > 0) {
          handleSwipeRight();
        } else {
          handleSwipeLeft();
        }
      } else {
        // Snap back to center
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={currentQuote.gradient}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Daily Inspiration</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Quote Card */}
          <View style={styles.quoteContainer}>
            <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onHandlerStateChange={onHandlerStateChange}
            >
              <Animated.View
                style={[
                  styles.quoteCard,
                  {
                    transform: [{ translateX }],
                    opacity,
                  },
                ]}
              >
                <View style={styles.quoteContent}>
                  <Text style={styles.quoteText}>"{currentQuote.text}"</Text>
                  <Text style={styles.quoteAuthor}>— {currentQuote.author}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{currentQuote.category}</Text>
                  </View>
                </View>
              </Animated.View>
            </PanGestureHandler>
          </View>

          {/* Navigation */}
          <View style={styles.navigation}>
            <TouchableOpacity
              style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
              onPress={handleSwipeRight}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={24} color={currentIndex === 0 ? 'rgba(255,255,255,0.3)' : '#FFFFFF'} strokeWidth={2} />
            </TouchableOpacity>

            <View style={styles.pagination}>
              {MOTIVATIONAL_QUOTES.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.navButton, currentIndex === MOTIVATIONAL_QUOTES.length - 1 && styles.navButtonDisabled]}
              onPress={handleSwipeLeft}
              disabled={currentIndex === MOTIVATIONAL_QUOTES.length - 1}
            >
              <ChevronRight size={24} color={currentIndex === MOTIVATIONAL_QUOTES.length - 1 ? 'rgba(255,255,255,0.3)' : '#FFFFFF'} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLikeQuote}>
              <Heart 
                size={24} 
                color="#FFFFFF" 
                strokeWidth={2}
                fill={likedQuotes.has(currentQuote.id) ? '#FFFFFF' : 'transparent'}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShareQuote}>
              <Share size={24} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Swipe Hint */}
          <Text style={styles.swipeHint}>
            Swipe left or right to explore more quotes
          </Text>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteCard: {
    width: width - 48,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  quoteContent: {
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 20,
    fontFamily: 'Quicksand-Medium',
    color: '#2D3748',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 24,
  },
  quoteAuthor: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#4A5568',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: 'rgba(168, 230, 207, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    color: '#2D3748',
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 32,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 24,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeHint: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});