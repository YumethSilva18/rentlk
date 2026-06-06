import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/common/Button';

interface PhoneVerificationScreenProps {
  navigation: any;
  route: any;
}

export const PhoneVerificationScreen: React.FC<PhoneVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);
  const phone = route?.params?.phone || '';

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) return;
    setLoading(true);
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('KYC');
    }, 1500);
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    inputs.current[0]?.focus();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="phone-portrait-outline" size={64} color={colors.primary} />
        </View>

        <Text style={styles.title}>Verify Your Phone</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{'\n'}{phone || '+94 77 *** **67'}
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputs.current[index] = ref; }}
              style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
              value={digit}
              onChangeText={(v) => handleChange(index, v)}
              onKeyPress={(e) => handleKeyPress(index, e.nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <Button
          title="Verify Code"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onPress={handleVerify}
          disabled={otp.join('').length !== 6}
        />

        <View style={styles.resendRow}>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend code in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.changePhone}>
          <Text style={styles.changePhoneText}>Change phone number</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { flex: 1, paddingHorizontal: spacing['5'], alignItems: 'center' },
  backBtn: { padding: spacing['3'], alignSelf: 'flex-start' },
  iconContainer: { marginTop: spacing['4'], marginBottom: spacing['6'] },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing['2'], textAlign: 'center' },
  subtitle: { ...typography.bodyMedium, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing['8'] },
  otpContainer: { flexDirection: 'row', gap: spacing['2'], marginBottom: spacing['8'] },
  otpInput: {
    width: 48, height: 56, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12,
    textAlign: 'center', ...typography.h3, color: colors.textPrimary, backgroundColor: colors.surface,
  },
  otpInputFilled: { borderColor: colors.primary },
  resendRow: { marginTop: spacing['6'] },
  timerText: { ...typography.bodyMedium, color: colors.textTertiary },
  resendText: { ...typography.labelMedium, color: colors.primary },
  changePhone: { marginTop: spacing['4'] },
  changePhoneText: { ...typography.bodyMedium, color: colors.textSecondary },
});
