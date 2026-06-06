import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Invalid email'); return; }
    setLoading(true);
    setError('');
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed-outline" size={64} color={colors.primary} />
        </View>

        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          {sent
            ? `We sent a reset link to ${email}. Check your inbox.`
            : "Enter your email and we'll send you a reset link."}
        </Text>

        {!sent ? (
          <>
            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color={colors.destructive} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Email Address"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textTertiary} />}
            />

            <Button title="Send Reset Link" variant="primary" size="lg" fullWidth loading={loading} onPress={handleSubmit} />
          </>
        ) : (
          <>
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.successText}>Email sent successfully!</Text>
            </View>
            <Button title="Back to Login" variant="primary" size="lg" fullWidth onPress={() => navigation.navigate('Login')} />
            <TouchableOpacity style={styles.resendBtn} onPress={handleSubmit}>
              <Text style={styles.resendText}>Didn't receive it? Send again</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { flexGrow: 1, paddingHorizontal: spacing['5'], paddingBottom: spacing['6'] },
  backBtn: { paddingVertical: spacing['3'], alignSelf: 'flex-start' },
  iconContainer: { alignItems: 'center', marginVertical: spacing['6'] },
  title: { ...typography.h2, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing['2'] },
  subtitle: { ...typography.bodyMedium, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing['8'] },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing['2'],
    backgroundColor: colors.backgroundDestructive, padding: spacing['3'], borderRadius: 8, marginBottom: spacing['4'],
  },
  errorText: { ...typography.bodySmall, color: colors.destructive, flex: 1 },
  successBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing['2'],
    backgroundColor: colors.backgroundSuccess, padding: spacing['3'], borderRadius: 8, marginBottom: spacing['6'],
  },
  successText: { ...typography.bodySmall, color: colors.success, flex: 1 },
  resendBtn: { marginTop: spacing['4'], alignSelf: 'center' },
  resendText: { ...typography.labelMedium, color: colors.primary },
});
