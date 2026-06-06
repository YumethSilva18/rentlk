import React, { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface SignupFormProps {
  onSubmit: (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => void;
  loading?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim()) e.phone = 'Required';
    if (form.password.length < 8) e.password = 'Min 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Mismatch';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', gap: spacing['3'] }}>
        <Input label="First Name" value={form.firstName} onChangeText={(v: string) => set('firstName', v)}
          error={errors.firstName} containerStyle={{ flex: 1 }} />
        <Input label="Last Name" value={form.lastName} onChangeText={(v: string) => set('lastName', v)}
          error={errors.lastName} containerStyle={{ flex: 1 }} />
      </View>
      <Input label="Email" value={form.email} onChangeText={(v: string) => set('email', v)}
        error={errors.email} keyboardType="email-address" autoCapitalize="none"
        leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textTertiary} />} />
      <Input label="Phone" value={form.phone} onChangeText={(v: string) => set('phone', v)}
        error={errors.phone} keyboardType="phone-pad"
        leftIcon={<Ionicons name="call-outline" size={20} color={colors.textTertiary} />} />
      <Input label="Password" value={form.password} onChangeText={(v: string) => set('password', v)}
        error={errors.password} secureTextEntry={!showPw}
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />}
        rightIcon={<Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textTertiary} />}
        onRightIconPress={() => setShowPw(!showPw)} />
      <Input label="Confirm Password" value={form.confirmPassword}
        onChangeText={(v: string) => set('confirmPassword', v)} error={errors.confirmPassword}
        secureTextEntry={!showPw} leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />} />
      <Button title="Create Account" variant="primary" size="lg" fullWidth loading={loading}
        onPress={() => { if (validate()) onSubmit(form); }} />
    </View>
  );
};
