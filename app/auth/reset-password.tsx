import React, { useState, useEffect } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Lock, Eye, EyeOff, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { theme } = useTheme();
  const params = useLocalSearchParams();

  useEffect(() => {
    // Check if we have the necessary tokens from the URL
    const { access_token, refresh_token } = params;
    
    if (access_token && refresh_token) {
      // Set the session with the tokens
      supabase.auth.setSession({
        access_token: access_token as string,
        refresh_token: refresh_token as string,
      });
    } else {
      // If no tokens, redirect to forgot password
      Alert.alert(
        'Invalid Reset Link',
        'This password reset link is invalid or has expired. Please request a new one.',
        [{ text: 'OK', onPress: () => router.replace('/auth/forgot-password') }]
      );
    }
  }, [params]);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
      errors: [
        ...(password.length < minLength ? [`At least ${minLength} characters`] : []),
        ...(!hasUpperCase ? ['One uppercase letter'] : []),
        ...(!hasLowerCase ? ['One lowercase letter'] : []),
        ...(!hasNumbers ? ['One number'] : []),
      ],
    };
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const validation = validatePassword(password);
    if (!validation.isValid) {
      Alert.alert('Password Requirements', `Password must have:\n• ${validation.errors.join('\n• ')}`);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.replace('/auth/login');
        }, 2000);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    const validation = validatePassword(password);
    const score = 4 - validation.errors.length;
    
    if (score === 0) return { strength: 'Very Weak', color: '#FF6B6B', width: '20%' };
    if (score === 1) return { strength: 'Weak', color: '#FF8E8E', width: '40%' };
    if (score === 2) return { strength: 'Fair', color: '#FFD93D', width: '60%' };
    if (score === 3) return { strength: 'Good', color: '#A8E6CF', width: '80%' };
    return { strength: 'Strong', color: '#4ADE80', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(password);

  if (isSuccess) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={theme.colors.gradient.dreamy}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.successContainer}>
              <LinearGradient
                colors={['#4ADE80', '#22C55E']}
                style={styles.successIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <CheckCircle size={48} color="#FFFFFF" strokeWidth={2} />
              </LinearGradient>
              
              <Text style={[styles.successTitle, { color: theme.colors.text }]}>
                Password Reset Successful!
              </Text>
              <Text style={[styles.successSubtitle, { color: theme.colors.textSecondary }]}>
                Your password has been updated. You'll be redirected to the login page shortly.
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

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
              <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
                {/* Header */}
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.secondary]}
                    style={styles.iconGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Lock size={32} color="#FFFFFF" strokeWidth={2} />
                  </LinearGradient>
                </View>

                <Text style={[styles.title, { color: theme.colors.text }]}>
                  Set New Password
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  Create a strong password for your account
                </Text>

                {/* New Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                    New Password
                  </Text>
                  <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                    <Lock size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                    <TextInput
                      style={[styles.textInput, { color: theme.colors.text }]}
                      placeholder="Enter new password"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                      ) : (
                        <Eye size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                      )}
                    </TouchableOpacity>
                  </View>

                  {/* Password Strength Indicator */}
                  {password.length > 0 && (
                    <View style={styles.strengthContainer}>
                      <View style={[styles.strengthBar, { backgroundColor: theme.colors.border }]}>
                        <View
                          style={[
                            styles.strengthFill,
                            {
                              width: passwordStrength.width,
                              backgroundColor: passwordStrength.color,
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                        {passwordStrength.strength}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                    Confirm Password
                  </Text>
                  <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                    <Lock size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                    <TextInput
                      style={[styles.textInput, { color: theme.colors.text }]}
                      placeholder="Confirm new password"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeButton}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                      ) : (
                        <Eye size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                      )}
                    </TouchableOpacity>
                  </View>

                  {/* Password Match Indicator */}
                  {confirmPassword.length > 0 && (
                    <View style={styles.matchContainer}>
                      {password === confirmPassword ? (
                        <Text style={[styles.matchText, { color: '#4ADE80' }]}>
                          ✓ Passwords match
                        </Text>
                      ) : (
                        <Text style={[styles.matchText, { color: '#FF6B6B' }]}>
                          ✗ Passwords don't match
                        </Text>
                      )}
                    </View>
                  )}
                </View>

                {/* Reset Button */}
                <TouchableOpacity
                  style={[styles.resetButton, loading && styles.disabledButton]}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.secondary]}
                    style={styles.resetGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.resetButtonText}>
                      {loading ? 'Updating Password...' : 'Update Password'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Password Requirements */}
                <View style={[styles.requirementsContainer, { backgroundColor: theme.colors.border }]}>
                  <Text style={[styles.requirementsTitle, { color: theme.colors.text }]}>
                    Password Requirements:
                  </Text>
                  <Text style={[styles.requirementsText, { color: theme.colors.textSecondary }]}>
                    • At least 8 characters{'\n'}
                    • One uppercase letter{'\n'}
                    • One lowercase letter{'\n'}
                    • One number
                  </Text>
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
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
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
  eyeButton: {
    padding: 4,
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
  },
  matchContainer: {
    marginTop: 8,
  },
  matchText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
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
  requirementsContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
  },
  requirementsTitle: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 8,
  },
  requirementsText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 18,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  successSubtitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
});