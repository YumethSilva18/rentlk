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
import { useAuth } from '../../hooks/useAuth';

interface SignupScreenProps {
  navigation: any;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { register, isLoading, error } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email';
    if (!form.phone.trim()) errors.phone = 'Phone is required';
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 8) errors.password = 'Minimum 8 characters';
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!acceptTerms) errors.terms = 'You must accept the terms';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    await register({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
    });
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
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join RentLK and start your journey</Text>

        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color={colors.destructive} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.row}>
          <Input
            label="First Name"
            placeholder="John"
            value={form.firstName}
            onChangeText={(v) => updateField('firstName', v)}
            error={formErrors.firstName}
            containerStyle={{ flex: 1 }}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            value={form.lastName}
            onChangeText={(v) => updateField('lastName', v)}
            error={formErrors.lastName}
            containerStyle={{ flex: 1 }}
          />
        </View>

        <Input
          label="Email Address"
          placeholder="your@email.com"
          value={form.email}
          onChangeText={(v) => updateField('email', v)}
          error={formErrors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textTertiary} />}
        />

        <Input
          label="Phone Number"
          placeholder="+94 77 123 4567"
          value={form.phone}
          onChangeText={(v) => updateField('phone', v)}
          error={formErrors.phone}
          keyboardType="phone-pad"
          leftIcon={<Ionicons name="call-outline" size={20} color={colors.textTertiary} />}
        />

        <Input
          label="Password"
          placeholder="Minimum 8 characters"
          value={form.password}
          onChangeText={(v) => updateField('password', v)}
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

        <Input
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChangeText={(v) => updateField('confirmPassword', v)}
          error={formErrors.confirmPassword}
          secureTextEntry={!showPassword}
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />}
        />

        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAcceptTerms(!acceptTerms)}
        >
          <Ionicons
            name={acceptTerms ? 'checkbox' : 'square-outline'}
            size={22}
            color={acceptTerms ? colors.primary : colors.textTertiary}
          />
          <Text style={styles.termsText}>
            I agree to the{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
        {formErrors.terms && <Text style={styles.termsError}>{formErrors.terms}</Text>}

        <Button
          title="Create Account"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          onPress={handleSignup}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { flexGrow: 1, paddingHorizontal: spacing['5'], paddingBottom: spacing['6'] },
  backBtn: { paddingVertical: spacing['3'], alignSelf: 'flex-start' },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing['2'] },
  subtitle: { ...typography.bodyLarge, color: colors.textSecondary, marginBottom: spacing['6'] },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing['2'],
    backgroundColor: colors.backgroundDestructive, padding: spacing['3'],
    borderRadius: 8, marginBottom: spacing['4'],
  },
  errorText: { ...typography.bodySmall, color: colors.destructive, flex: 1 },
  row: { flexDirection: 'row', gap: spacing['3'] },
  termsRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing['2'],
    marginBottom: spacing['5'], marginTop: spacing['2'],
  },
  termsText: { ...typography.bodySmall, color: colors.textSecondary, flex: 1 },
  termsLink: { ...typography.labelSmall, color: colors.primary },
  termsError: { ...typography.bodySmall, color: colors.destructive, marginBottom: spacing['3'] },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing['6'] },
  footerText: { ...typography.bodyMedium, color: colors.textSecondary },
  footerLink: { ...typography.labelMedium, color: colors.primary },
});
