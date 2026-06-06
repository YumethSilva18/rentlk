import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface OtpInputProps {
  length?: number;
  onComplete: (code: string) => void;
  onCodeChange?: (code: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  onComplete,
  onCodeChange,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onCodeChange?.(newOtp.join(''));
    if (value && index < length - 1) inputs.current[index + 1]?.focus();
    if (newOtp.every((d) => d !== '')) onComplete(newOtp.join(''));
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) inputs.current[index - 1]?.focus();
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, i) => (
        <TextInput
          key={i}
          ref={(ref) => { inputs.current[i] = ref; }}
          style={[styles.input, digit ? styles.inputFilled : null]}
          value={digit}
          onChangeText={(v) => handleChange(i, v)}
          onKeyPress={(e) => handleKeyPress(i, e.nativeEvent.key)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'center', gap: spacing['2'] },
  input: {
    width: 48, height: 56, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12,
    textAlign: 'center', ...typography.h3, color: colors.textPrimary, backgroundColor: colors.surface,
  },
  inputFilled: { borderColor: colors.primary },
});
