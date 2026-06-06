import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Divider } from '../../components/common/Divider';
import { useAuth } from '../../hooks/useAuth';
import { MOCK_USERS } from '../../utils/constants';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { login, isLoading: loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [showDevPanel, setShowDevPanel] = useState(__DEV__);

  const validate = () => {
    const errors: typeof formErrors = {};
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Invalid email format';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    await login({ email, password });
  };

  const quickLogin = async (mockEmail: string) => {
    setEmail(mockEmail);
    setPassword('password123');
    await login({ email: mockEmail, password: 'password123' });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account to continue</Text>

        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color={colors.destructive} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Input
          label="Email Address"
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          error={formErrors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textTertiary} />}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          error={formErrors.password}
          secureTextEntry={!showPassword}
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />}
          rightIcon={
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textTertiary}
            />
          }
          onRightIconPress={() => setShowPassword(!showPassword)}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotBtn}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          title="Sign In"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onPress={handleLogin}
        />

        <Divider spacing="lg">
          <Text style={styles.dividerText}>or continue with</Text>
        </Divider>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <Ionicons name="logo-google" size={22} color={colors.textPrimary} />
            <Text style={styles.socialLabel}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Ionicons name="logo-facebook" size={22} color={colors.primary} />
            <Text style={styles.socialLabel}>Facebook</Text>
          </TouchableOpacity>
        </View>

        {showDevPanel && (
          <View style={styles.devPanel}>
            <Text style={styles.devPanelTitle}>Dev Quick Login</Text>
            {MOCK_USERS.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={styles.devUserBtn}
                onPress={() => quickLogin(user.email)}
              >
                <Text style={styles.devUserName}>{user.name}</Text>
                <Text style={styles.devUserRole}>{user.role}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing['5'],
    paddingBottom: spacing['6'],
  },
  backBtn: {
    paddingVertical: spacing['3'],
    alignSelf: 'flex-start',
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing['2'],
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginBottom: spacing['6'],
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    backgroundColor: colors.backgroundDestructive,
    padding: spacing['3'],
    borderRadius: 8,
    marginBottom: spacing['4'],
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.destructive,
    flex: 1,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing['5'],
  },
  forgotText: {
    ...typography.labelMedium,
    color: colors.primary,
  },
  dividerText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    paddingHorizontal: spacing['3'],
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing['3'],
    marginTop: spacing['4'],
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3'],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing['2'],
  },
  socialLabel: {
    ...typography.labelMedium,
    color: colors.textPrimary,
  },
  devPanel: {
    marginTop: spacing['6'],
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing['4'],
    borderWidth: 1,
    borderColor: colors.border,
  },
  devPanelTitle: {
    ...typography.labelLarge,
    color: colors.warning,
    marginBottom: spacing['3'],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  devUserBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing['2.5'],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  devUserName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  devUserRole: {
    ...typography.caption,
    color: colors.textTertiary,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing['6'],
  },
  footerText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.labelMedium,
    color: colors.primary,
  },
});
