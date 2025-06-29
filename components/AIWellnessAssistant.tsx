import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Heart,
  Lightbulb,
  MessageCircle,
  Sparkles
} from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface AIWellnessAssistantProps {
  visible: boolean;
  onClose: () => void;
}

export default function AIWellnessAssistant({ visible, onClose }: AIWellnessAssistantProps) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Wellness Assistant. I'm here to help you with meditation guidance, stress management, and mindfulness tips. How are you feeling today?",
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        "I'm feeling stressed",
        "Help me with breathing",
        "I need motivation",
        "Meditation tips"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const generateAIResponse = (userMessage: string): { text: string; suggestions?: string[] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
      return {
        text: "I understand you're feeling stressed. Remember that stress is temporary and you have the power to manage it. Try the 4-7-8 breathing technique: inhale for 4 counts, hold for 7, exhale for 8. This activates your parasympathetic nervous system and promotes calm. Would you like me to guide you through a quick stress-relief exercise?",
        suggestions: ["Start breathing exercise", "Tell me more techniques", "I need immediate help", "What causes stress?"]
      };
    }
    
    if (lowerMessage.includes('breath') || lowerMessage.includes('breathing')) {
      return {
        text: "Breathing is one of the most powerful tools for wellness! Here are some techniques: 1) Box breathing (4-4-4-4), 2) 4-7-8 breathing for relaxation, 3) Belly breathing for grounding. The key is to breathe slowly and deeply, focusing on your diaphragm rather than your chest. Which technique would you like to try?",
        suggestions: ["Box breathing", "4-7-8 technique", "Belly breathing", "Why does breathing help?"]
      };
    }
    
    if (lowerMessage.includes('meditat') || lowerMessage.includes('mindful')) {
      return {
        text: "Meditation is a wonderful practice for mental wellness! Start with just 5 minutes daily. Focus on your breath, observe your thoughts without judgment, and gently return attention to your breath when your mind wanders. Remember: there's no 'perfect' meditation - it's about practice, not perfection. Would you like a guided meditation suggestion?",
        suggestions: ["5-minute meditation", "Mindfulness tips", "Meditation for beginners", "How often should I meditate?"]
      };
    }
    
    if (lowerMessage.includes('motivat') || lowerMessage.includes('inspire')) {
      return {
        text: "You're taking such a positive step by focusing on your wellness! Remember: every small action towards self-care matters. You don't have to be perfect - progress, not perfection, is the goal. Your mental health journey is unique to you, and you're exactly where you need to be right now. What's one small thing you can do for yourself today?",
        suggestions: ["Self-care ideas", "Daily wellness habits", "Positive affirmations", "How to stay motivated"]
      };
    }
    
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
      return {
        text: "Quality sleep is essential for mental wellness. Try creating a bedtime routine: dim lights 1 hour before bed, avoid screens, practice gentle stretches or meditation. The 4-7-8 breathing technique is also excellent for falling asleep. Your bedroom should be cool, dark, and quiet. What's your biggest sleep challenge?",
        suggestions: ["Bedtime routine tips", "Sleep meditation", "Can't fall asleep", "Wake up tired"]
      };
    }
    
    if (lowerMessage.includes('work') || lowerMessage.includes('job') || lowerMessage.includes('commute')) {
      return {
        text: "Work stress is very common, and it's great that you're addressing it! Try micro-breaks: 2-3 deep breaths between tasks, a 30-second mindfulness moment, or gentle neck stretches. For commuting, use ZenRoute's features to transform travel time into wellness time. Remember: you can't control everything at work, but you can control your response to it.",
        suggestions: ["Workplace wellness tips", "Commute meditation", "Dealing with difficult colleagues", "Work-life balance"]
      };
    }
    
    // Default responses for general conversation
    const defaultResponses = [
      {
        text: "Thank you for sharing that with me. Remember that every feeling is valid, and it's okay to not be okay sometimes. What matters is that you're taking steps to care for your mental health. How can I best support you right now?",
        suggestions: ["I need encouragement", "Practical tips", "Just want to talk", "Help me relax"]
      },
      {
        text: "I'm here to listen and support you. Your wellness journey is important, and every small step counts. Whether you need breathing techniques, meditation guidance, or just someone to talk to, I'm here. What would be most helpful for you today?",
        suggestions: ["Breathing exercises", "Meditation guidance", "Stress management", "Positive mindset"]
      }
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        isUser: false,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  const renderMessage = (message: Message) => {
    return (
      <View key={message.id} style={styles.messageContainer}>
        <View style={[
          styles.messageBubble,
          message.isUser ? styles.userMessage : styles.aiMessage,
          { backgroundColor: message.isUser ? theme.colors.primary : theme.colors.surface }
        ]}>
          <View style={styles.messageHeader}>
            <View style={[
              styles.messageAvatar,
              { backgroundColor: message.isUser ? 'rgba(255,255,255,0.2)' : theme.colors.border }
            ]}>
              {message.isUser ? (
                <User size={16} color={message.isUser ? '#FFFFFF' : theme.colors.primary} strokeWidth={2} />
              ) : (
                <Bot size={16} color={theme.colors.primary} strokeWidth={2} />
              )}
            </View>
            <Text style={[
              styles.messageText,
              { color: message.isUser ? '#FFFFFF' : theme.colors.text }
            ]}>
              {message.text}
            </Text>
          </View>
        </View>

        {/* Suggestions */}
        {message.suggestions && (
          <View style={styles.suggestionsContainer}>
            {message.suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.suggestionButton, { backgroundColor: theme.colors.border }]}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={[styles.suggestionText, { color: theme.colors.text }]}>
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.modalContent,
            { backgroundColor: theme.colors.background, opacity: fadeAnim }
          ]}
        >
          {/* Header */}
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <View style={styles.aiAvatar}>
                  <Sparkles size={24} color="#FFFFFF" strokeWidth={2} />
                </View>
                <View>
                  <Text style={styles.headerTitle}>AI Wellness Assistant</Text>
                  <Text style={styles.headerSubtitle}>Your mindful companion</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Messages */}
          <KeyboardAvoidingView 
            style={styles.chatContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map(renderMessage)}
              
              {/* Typing indicator */}
              {isTyping && (
                <View style={styles.typingContainer}>
                  <View style={[styles.typingBubble, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.typingDots}>
                      <View style={[styles.typingDot, { backgroundColor: theme.colors.textSecondary }]} />
                      <View style={[styles.typingDot, { backgroundColor: theme.colors.textSecondary }]} />
                      <View style={[styles.typingDot, { backgroundColor: theme.colors.textSecondary }]} />
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
              <TextInput
                style={[styles.textInput, { color: theme.colors.text }]}
                placeholder="Ask me about wellness, meditation, or stress..."
                placeholderTextColor={theme.colors.textSecondary}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                style={[
                  styles.sendButton,
                  { backgroundColor: inputText.trim() ? theme.colors.primary : theme.colors.border }
                ]}
                disabled={!inputText.trim()}
              >
                <Send size={20} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  messageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 22,
    flex: 1,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginLeft: 32,
    gap: 8,
  },
  suggestionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },
  typingContainer: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  typingBubble: {
    borderRadius: 16,
    padding: 16,
    borderBottomLeftRadius: 4,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    gap: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});