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
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { theme } = useTheme();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      // Provide more user-friendly error messages
      let errorMessage = error.message;
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'The email or password you entered is incorrect. If you don\'t have an account yet, please sign up first.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
      }
      
      Alert.alert('Sign In Failed', errorMessage);
    } else {
      // Successfully signed in, navigate to main app
      router.replace('/(tabs)');
    }
  };

  const navigateToSignUp = () => {
    router.push('/auth/signup');
  };

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
                <Text style={[styles.title, { color: theme.colors.text }]}>
                  Welcome Back
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  Sign in to continue your zen journey
                </Text>
              </View>

              {/* Form */}
              <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                    Email
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
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                    Password
                  </Text>
                  <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                    <Lock size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                    <TextInput
                      style={[styles.textInput, { color: theme.colors.text }]}
                      placeholder="Enter your password"
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
                </View>

                {/* Sign In Button */}
                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={handleSignIn}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.secondary]}
                    style={styles.signInGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.signInButtonText}>
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View style={styles.signUpContainer}>
                  <Text style={[styles.signUpText, { color: theme.colors.textSecondary }]}>
                    Don't have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={navigateToSignUp}>
                    <Text style={[styles.signUpLink, { color: theme.colors.primary }]}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Forgot Password Link */}
                <View style={styles.forgotPasswordContainer}>
                  <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
                    <Text style={[styles.forgotPasswordLink, { color: theme.colors.primary }]}>
                      Forgot your password?
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Demo Account Info */}
                <View style={[styles.demoContainer, { backgroundColor: theme.colors.border }]}>
                  <Text style={[styles.demoTitle, { color: theme.colors.text }]}>
                    Demo Account
                  </Text>
                  <Text style={[styles.demoText, { color: theme.colors.textSecondary }]}>
                    Email: demo@zenroute.com
                  </Text>
                  <Text style={[styles.demoText, { color: theme.colors.textSecondary }]}>
                    Password: demo123
                  </Text>
                  <TouchableOpacity 
                    style={styles.useDemoButton}
                    onPress={() => {
                      setEmail('demo@zenroute.com');
                      setPassword('demo123');
                    }}
                  >
                    <Text style={[styles.useDemoText, { color: theme.colors.primary }]}>
                      Use Demo Account
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
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
  },
  formContainer: {
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  inputContainer: {
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
  signInButton: {
    borderRadius: 12,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#A8E6CF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  signInGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  signInButtonText: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signUpText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
  },
  signUpLink: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordLink: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },
  demoContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    marginBottom: 4,
  },
  useDemoButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  useDemoText: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
  },
});