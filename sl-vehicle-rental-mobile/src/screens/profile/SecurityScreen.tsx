import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';

type Props = MainScreenProps<'Security'>;

export const SecurityScreen: React.FC<Props> = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to change password
      Alert.alert('Success', 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Security</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Change Password</Text>
            <View style={styles.form}>
              <Input
                label="Current Password"
                placeholder="Enter current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
              />
              <Input
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
              />
              <Input
                label="Confirm New Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
              />
              <Button
                title="Change Password"
                onPress={handleChangePassword}
                loading={loading}
              />
            </View>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Two-Factor Authentication</Text>
            <View style={styles.infoBox}>
              <Ionicons name="shield-checkmark-outline" size={32} color={colors.success} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Secure Your Account</Text>
                <Text style={styles.infoText}>
                  Enable 2FA to add an extra layer of security to your account.
                </Text>
              </View>
            </View>
            <Button
              title={twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              variant={twoFactorEnabled ? 'outline' : 'primary'}
              onPress={() => {
                Alert.alert(
                  twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA',
                  'This feature requires backend integration',
                );
              }}
            />
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Active Sessions</Text>
            <View style={styles.sessionItem}>
              <View style={styles.sessionIcon}>
                <Ionicons name="phone-portrait-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionDevice}>This Device</Text>
                <Text style={styles.sessionMeta}>Colombo, Sri Lanka • Current</Text>
              </View>
              <Badge label="Active" variant="success" size="sm" />
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing['4'],
    gap: spacing['3'],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing['4'],
    gap: spacing['4'],
  },
  section: {
    padding: spacing['4'],
    gap: spacing['3'],
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  form: {
    gap: spacing['3'],
  },
  infoBox: {
    flexDirection: 'row',
    gap: spacing['3'],
    padding: spacing['3'],
    backgroundColor: colors.backgroundSuccess,
    borderRadius: radii.lg,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginBottom: spacing['1'],
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    padding: spacing['3'],
    backgroundColor: colors.background,
    borderRadius: radii.lg,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDevice: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    marginBottom: spacing['0.5'],
  },
  sessionMeta: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
});
