import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Heart, Shield, Zap, Users, ExternalLink, Github, Twitter } from 'lucide-react-native';

export default function AboutScreen() {
  const { theme } = useTheme();

  const features = [
    {
      icon: Heart,
      title: 'Mindful Commuting',
      description: 'Transform your daily commute into a wellness journey with guided meditations and breathing exercises.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your personal data and wellness information are encrypted and never shared with third parties.',
    },
    {
      icon: Zap,
      title: 'Smart Interventions',
      description: 'AI-powered stress zone detection provides timely wellness interventions when you need them most.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built with feedback from mindfulness practitioners and commuters worldwide.',
    },
  ];

  const teamMembers = [
    { name: 'Sarah Chen', role: 'Mindfulness Expert' },
    { name: 'Alex Rodriguez', role: 'UX Designer' },
    { name: 'Dr. Maya Patel', role: 'Wellness Researcher' },
    { name: 'Jordan Kim', role: 'Lead Developer' },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      url: 'https://github.com/zenroute',
    },
    {
      icon: Twitter,
      label: 'Twitter',
      url: 'https://twitter.com/zenroute',
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradient.dreamy}
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
            <Text style={[styles.title, { color: theme.colors.text }]}>About ZenRoute</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* App Info */}
            <View style={[styles.appInfoSection, { backgroundColor: theme.colors.surface }]}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.logoContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.logoText}>ZR</Text>
              </LinearGradient>
              <Text style={[styles.appName, { color: theme.colors.text }]}>ZenRoute</Text>
              <Text style={[styles.version, { color: theme.colors.textSecondary }]}>Version 1.0.0</Text>
              <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
                Transform your commute into calm
              </Text>
            </View>

            {/* Mission */}
            <View style={[styles.missionSection, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Our Mission</Text>
              <Text style={[styles.missionText, { color: theme.colors.textSecondary }]}>
                ZenRoute was created to help busy professionals and commuters find moments of peace and mindfulness 
                in their daily journeys. We believe that even the most stressful commute can become an opportunity 
                for personal growth and mental wellness.
              </Text>
            </View>

            {/* Features */}
            <View style={styles.featuresSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, marginHorizontal: 24 }]}>
                Key Features
              </Text>
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <View key={index} style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
                    <View style={[styles.featureIcon, { backgroundColor: theme.colors.primary }]}>
                      <IconComponent size={24} color="#FFFFFF" strokeWidth={2} />
                    </View>
                    <View style={styles.featureContent}>
                      <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                        {feature.title}
                      </Text>
                      <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                        {feature.description}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Team */}
            <View style={[styles.teamSection, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Meet the Team</Text>
              <View style={styles.teamGrid}>
                {teamMembers.map((member, index) => (
                  <View key={index} style={styles.teamMember}>
                    <View style={[styles.memberAvatar, { backgroundColor: theme.colors.primary }]}>
                      <Text style={styles.memberInitial}>{member.name.charAt(0)}</Text>
                    </View>
                    <Text style={[styles.memberName, { color: theme.colors.text }]}>{member.name}</Text>
                    <Text style={[styles.memberRole, { color: theme.colors.textSecondary }]}>{member.role}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Social Links */}
            <View style={styles.socialSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, marginHorizontal: 24 }]}>
                Connect With Us
              </Text>
              <View style={styles.socialLinks}>
                {socialLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.socialLink, { backgroundColor: theme.colors.surface }]}
                      onPress={() => Linking.openURL(link.url)}
                    >
                      <IconComponent size={24} color={theme.colors.primary} strokeWidth={2} />
                      <Text style={[styles.socialLabel, { color: theme.colors.text }]}>{link.label}</Text>
                      <ExternalLink size={16} color={theme.colors.textSecondary} strokeWidth={2} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Legal */}
            <View style={[styles.legalSection, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.legalText, { color: theme.colors.textSecondary }]}>
                © 2024 ZenRoute. All rights reserved.
              </Text>
              <View style={styles.legalLinks}>
                <TouchableOpacity onPress={() => console.log('Privacy Policy')}>
                  <Text style={[styles.legalLink, { color: theme.colors.primary }]}>Privacy Policy</Text>
                </TouchableOpacity>
                <Text style={[styles.legalSeparator, { color: theme.colors.textSecondary }]}>•</Text>
                <TouchableOpacity onPress={() => console.log('Terms of Service')}>
                  <Text style={[styles.legalLink, { color: theme.colors.primary }]}>Terms of Service</Text>
                </TouchableOpacity>
              </View>
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
  appInfoSection: {
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 32,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
  appName: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    marginBottom: 4,
  },
  version: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  missionSection: {
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
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
  },
  missionText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featureCard: {
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
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 20,
  },
  teamSection: {
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
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  teamMember: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  memberInitial: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
  memberName: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 2,
    textAlign: 'center',
  },
  memberRole: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
  },
  socialSection: {
    marginBottom: 24,
  },
  socialLinks: {
    marginHorizontal: 24,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  socialLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    marginLeft: 12,
  },
  legalSection: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legalText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    marginBottom: 12,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legalLink: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },
  legalSeparator: {
    fontSize: 14,
    marginHorizontal: 8,
  },
});