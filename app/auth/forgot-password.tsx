import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Mail, ArrowLeft, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

type ResetStep = 'email' | 'sent' | 'error';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<ResetStep>('email');
  const [errorMessage, setErrorMessage] = useState('');
  const { theme } = useTheme();

  const handleSendResetEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message);
        setCurrentStep('error');
      } else {
        setCurrentStep('sent');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setCurrentStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace('/auth/login');
  };

  const handleTryAgain = () => {
    setCurrentStep('email');
    setErrorMessage('');
  };

  const renderEmailStep = () => (
    <>
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Mail size={32} color="#FFFFFF" strokeWidth={2} />
        </LinearGradient>
      </View>

      <Text style={[styles.title, { color: theme.colors.text }]}>
        Reset Your Password
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Enter your email address and we'll send you a link to reset your password.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
          Email Address
        </Text>
        <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
          <Mail size={20} color={theme.colors.textSecondary} strokeWidth={2} />
          <TextInput
            style={[styles.textInput, { color: theme.colors.text }]}
            placeholder="Enter your email"
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.resetButton, loading && styles.disabledButton]}
        onPress={handleSendResetEmail}
        disabled={loading}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.resetGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.resetButtonText}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );

  const renderSentStep = () => (
    <>
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={['#4ADE80', '#22C55E']}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <CheckCircle size={32} color="#FFFFFF" strokeWidth={2} />
        </LinearGradient>
      </View>

      <Text style={[styles.title, { color: theme.colors.text }]}>
        Check Your Email
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        We've sent a password reset link to:
      </Text>
      <Text style={[styles.emailDisplay, { color: theme.colors.primary }]}>
        {email}
      </Text>
      <Text style={[styles.instructions, { color: theme.colors.textSecondary }]}>
        Click the link in the email to reset your password. If you don't see the email, 
        check your spam folder.
      </Text>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleTryAgain}
      >
        <LinearGradient
          colors={[theme.colors.border, theme.colors.surface]}
          style={styles.resetGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.resetButtonText, { color: theme.colors.text }]}>
            Send Another Email
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );

  const renderErrorStep = () => (
    <>
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={['#FF6B6B', '#EF4444']}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <AlertCircle size={32} color="#FFFFFF" strokeWidth={2} />
        </LinearGradient>
      </View>

      <Text style={[styles.title, { color: theme.colors.text }]}>
        Something Went Wrong
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        We couldn't send the reset email. Please try again.
      </Text>
      <Text style={[styles.errorText, { color: '#FF6B6B' }]}>
        {errorMessage}
      </Text>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleTryAgain}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.resetGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.resetButtonText}>
            Try Again
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradient.dreamy}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={handleBackToLogin} style={styles.backButton}>
                  <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
                {currentStep === 'email' && renderEmailStep()}
                {currentStep === 'sent' && renderSentStep()}
                {currentStep === 'error' && renderErrorStep()}

                {/* Back to Login */}
                <View style={styles.backToLoginContainer}>
                  <Text style={[styles.backToLoginText, { color: theme.colors.textSecondary }]}>
                    Remember your password?{' '}
                  </Text>
                  <TouchableOpacity onPress={handleBackToLogin}>
                    <Text style={[styles.backToLoginLink, { color: theme.colors.primary }]}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  formContainer: {
    borderRadius: 20,
    padding: 32,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    marginLeft: 12,
  },
  resetButton: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#A8E6CF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  resetGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
  emailDisplay: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    textAlign: 'center',
    marginBottom: 16,
  },
  instructions: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  backToLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
  },
  backToLoginLink: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
  },
});