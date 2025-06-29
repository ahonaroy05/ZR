import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { User, Mail, Save, ArrowLeft, Camera } from 'lucide-react-native';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // Simulate save operation
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradient.pastel}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
              </TouchableOpacity>
              <Text style={[styles.title, { color: theme.colors.text }]}>Edit Profile</Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {/* Profile Picture */}
              <View style={styles.profileSection}>
                <View style={[styles.profilePicture, { backgroundColor: theme.colors.primary }]}>
                  <User size={40} color="#FFFFFF" strokeWidth={2} />
                </View>
                <TouchableOpacity style={styles.cameraButton}>
                  <Camera size={20} color={theme.colors.primary} strokeWidth={2} />
                </TouchableOpacity>
              </View>

              {/* Form */}
              <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
                {/* Full Name */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                    Full Name
                  </Text>
                  <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                    <User size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                    <TextInput
                      style={[styles.textInput, { color: theme.colors.text }]}
                      placeholder="Enter your full name"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {/* Email */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                    Email
                  </Text>
                  <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                    <Mail size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                    <TextInput
                      style={[styles.textInput, { color: theme.colors.textSecondary }]}
                      placeholder="Enter your email"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={email}
                      editable={false}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <Text style={[styles.helperText, { color: theme.colors.textSecondary }]}>
                    Email cannot be changed
                  </Text>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.secondary]}
                    style={styles.saveGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Save size={20} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.saveButtonText}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formContainer: {
    marginHorizontal: 24,
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
  helperText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    marginTop: 4,
  },
  saveButton: {
    borderRadius: 12,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#A8E6CF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
});