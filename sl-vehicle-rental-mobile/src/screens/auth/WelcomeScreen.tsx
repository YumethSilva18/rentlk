import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/common/Button';

const { width } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.heroSection}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>RentLK</Text>
          <Text style={styles.tagline}>Drive Your Way</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to RentLK</Text>
        <Text style={styles.subtitle}>
          Sri Lanka's premium vehicle rental marketplace. Find the perfect vehicle for your journey.
        </Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🚗</Text>
            <Text style={styles.featureText}>Wide selection of vehicles</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🔒</Text>
            <Text style={styles.featureText}>Secure payments</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>📍</Text>
            <Text style={styles.featureText}>GPS tracking included</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Get Started"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => navigation.navigate('Signup')}
          />
          <Button
            title="I Already Have an Account"
            variant="outline"
            size="lg"
            fullWidth
            onPress={() => navigation.navigate('Login')}
            style={styles.loginBtn}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  heroSection: {
    flex: 0.4,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.textInverse,
    letterSpacing: -1,
  },
  tagline: {
    ...typography.bodyLarge,
    color: colors.accent,
    marginTop: spacing['2'],
    fontWeight: '600',
  },
  content: {
    flex: 0.6,
    padding: spacing['6'],
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing['3'],
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginBottom: spacing['6'],
    lineHeight: 24,
  },
  features: {
    marginBottom: spacing['8'],
    gap: spacing['3'],
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  actions: {
    gap: spacing['3'],
  },
  loginBtn: {
    marginTop: spacing['1'],
  },
});
