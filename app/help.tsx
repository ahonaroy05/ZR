import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Mail, MessageCircle, Book, ExternalLink, Phone } from 'lucide-react-native';

export default function HelpScreen() {
  const { theme } = useTheme();

  const faqItems = [
    {
      question: 'How do I start a meditation session?',
      answer: 'Go to the Sound tab and select from our guided sessions. Choose your preferred duration and background sound, then tap play to begin.',
    },
    {
      question: 'Can I use the app while driving?',
      answer: 'Yes! ZenRoute is designed for safe use during commutes. Use audio-only sessions and never interact with the screen while driving.',
    },
    {
      question: 'How does stress zone detection work?',
      answer: 'The app uses your location to identify high-stress areas like traffic jams or busy intersections, then suggests appropriate wellness interventions.',
    },
    {
      question: 'Is my data private and secure?',
      answer: 'Absolutely. All your personal data, journal entries, and wellness metrics are encrypted and stored securely. We never share your data with third parties.',
    },
    {
      question: 'How do I track my progress?',
      answer: 'Visit the Progress section to see your meditation streaks, stress reduction trends, and wellness achievements over time.',
    },
  ];

  const contactOptions = [
    {
      title: 'Email Support',
      description: 'Get help via email',
      icon: Mail,
      action: () => Linking.openURL('mailto:support@zenroute.com'),
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: MessageCircle,
      action: () => {
        // In a real app, this would open a chat widget
        console.log('Opening live chat...');
      },
    },
    {
      title: 'User Guide',
      description: 'Read our comprehensive guide',
      icon: Book,
      action: () => {
        // In a real app, this would open documentation
        console.log('Opening user guide...');
      },
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradient.pastel}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.colors.text }]}>Help & Support</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Contact Options */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Get Help</Text>
              {contactOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.contactCard, { backgroundColor: theme.colors.surface }]}
                    onPress={option.action}
                  >
                    <View style={[styles.contactIcon, { backgroundColor: theme.colors.primary }]}>
                      <IconComponent size={24} color="#FFFFFF" strokeWidth={2} />
                    </View>
                    <View style={styles.contactContent}>
                      <Text style={[styles.contactTitle, { color: theme.colors.text }]}>
                        {option.title}
                      </Text>
                      <Text style={[styles.contactDescription, { color: theme.colors.textSecondary }]}>
                        {option.description}
                      </Text>
                    </View>
                    <ExternalLink size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* FAQ Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Frequently Asked Questions
              </Text>
              {faqItems.map((item, index) => (
                <View key={index} style={[styles.faqCard, { backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>
                    {item.question}
                  </Text>
                  <Text style={[styles.faqAnswer, { color: theme.colors.textSecondary }]}>
                    {item.answer}
                  </Text>
                </View>
              ))}
            </View>

            {/* Emergency Contact */}
            <View style={[styles.emergencySection, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.emergencyTitle, { color: theme.colors.text }]}>
                Mental Health Emergency
              </Text>
              <Text style={[styles.emergencyText, { color: theme.colors.textSecondary }]}>
                If you're experiencing a mental health crisis, please contact emergency services or a crisis helpline immediately.
              </Text>
              <TouchableOpacity
                style={styles.emergencyButton}
                onPress={() => Linking.openURL('tel:988')}
              >
                <LinearGradient
                  colors={['#FF6B6B', '#FF8E8E']}
                  style={styles.emergencyGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Phone size={20} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.emergencyButtonText}>Call Crisis Helpline</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
    marginHorizontal: 24,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
  },
  faqCard: {
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  faqQuestion: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 20,
  },
  emergencySection: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  emergencyTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    marginBottom: 12,
  },
  emergencyText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 20,
    marginBottom: 16,
  },
  emergencyButton: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  emergencyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  emergencyButtonText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#FFFFFF',
  },
});