import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Avatar } from '@/components/common/Avatar';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Divider } from '@/components/common/Divider';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';
import { useAuth } from '@/hooks/useAuth';

type Props = MainScreenProps<'EditProfile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: 'person-outline' as const,
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      screen: 'EditProfile',
    },
    {
      icon: 'shield-checkmark-outline' as const,
      title: 'KYC Verification',
      subtitle: user?.kycStatus === 'approved' ? 'Verified' : 'Complete verification',
      screen: 'KYCStatus',
      badge: user?.kycStatus === 'approved' ? 'success' as const : 'warning' as const,
    },
    {
      icon: 'wallet-outline' as const,
      title: 'Wallet',
      subtitle: 'Balance: Rs. 15,000',
      screen: 'Wallet',
    },
    {
      icon: 'car-outline' as const,
      title: 'My Vehicles',
      subtitle: 'Manage your listed vehicles',
      screen: 'MyVehicles',
    },
    {
      icon: 'calendar-outline' as const,
      title: 'My Bookings',
      subtitle: 'View your booking history',
      screen: 'MyBookings',
    },
    {
      icon: 'card-outline' as const,
      title: 'Payment Methods',
      subtitle: 'Manage payment options',
      screen: 'PaymentMethods',
    },
    {
      icon: 'receipt-outline' as const,
      title: 'Payment History',
      subtitle: 'View transaction history',
      screen: 'PaymentHistory',
    },
    {
      icon: 'star-outline' as const,
      title: 'My Reviews',
      subtitle: 'Reviews you\'ve given',
      screen: 'Reviews',
    },
    {
      icon: 'settings-outline' as const,
      title: 'Settings',
      subtitle: 'App preferences',
      screen: 'Settings',
    },
    {
      icon: 'help-circle-outline' as const,
      title: 'Help & Support',
      subtitle: 'Get help or contact us',
      screen: 'HelpCenter',
    },
  ];

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Avatar name={user?.name || 'User'} uri={user?.avatar} size="xl" />
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{user?.name || 'User'}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                {user?.kycStatus === 'approved' && (
                  <Badge label="Verified" variant="success" size="sm" />
                )}
              </View>
            </View>
          </Card>

          <Card style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <React.Fragment key={item.screen}>
                {index > 0 && <Divider />}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => navigation.navigate(item.screen as any, {})}
                >
                  <View style={styles.menuIcon}>
                    <Ionicons name={item.icon} size={24} color={colors.primary} />
                  </View>
                  <View style={styles.menuContent}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                  <View style={styles.menuRight}>
                    {item.badge && (
                      <Badge label={item.subtitle} variant={item.badge as any} size="sm" />
                    )}
                    <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </Card>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>Version 1.0.0</Text>
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
    padding: spacing['4'],
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
    paddingTop: 0,
    gap: spacing['4'],
  },
  profileCard: {
    padding: spacing['4'],
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['4'],
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing['1'],
  },
  email: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing['2'],
  },
  menuCard: {
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing['4'],
    gap: spacing['3'],
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    marginBottom: spacing['0.5'],
  },
  menuSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
    padding: spacing['4'],
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginTop: spacing['2'],
  },
  logoutText: {
    ...typography.labelLarge,
    color: colors.destructive,
  },
  versionText: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing['4'],
  },
});
