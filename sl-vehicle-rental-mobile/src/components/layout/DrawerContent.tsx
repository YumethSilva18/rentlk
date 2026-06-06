import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Avatar } from '../common/Avatar';
import { Divider } from '../common/Divider';
import { useAuthStore } from '../../store/auth.store';

interface DrawerContentProps {
  navigation: any;
}

interface DrawerItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: string;
  params?: Record<string, unknown>;
}

const menuItems: DrawerItem[] = [
  { label: 'Home', icon: 'home-outline', screen: 'HomeTab' },
  { label: 'My Bookings', icon: 'calendar-outline', screen: 'BookingsTab' },
  { label: 'Messages', icon: 'chatbubble-ellipses-outline', screen: 'MessagesTab' },
  { label: 'My Vehicles', icon: 'car-outline', screen: 'MyVehicles' },
  { label: 'Saved Vehicles', icon: 'heart-outline', screen: 'SavedVehicles' },
  { label: 'Wallet', icon: 'wallet-outline', screen: 'Wallet' },
  { label: 'Notifications', icon: 'notifications-outline', screen: 'Notifications' },
  { label: 'Settings', icon: 'settings-outline', screen: 'Settings' },
];

export const DrawerContent: React.FC<DrawerContentProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleNavigate = (screen: string, params?: Record<string, unknown>) => {
    navigation.navigate(screen, params);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Avatar
          uri={user?.avatar}
          name={user?.firstName ? `${user.firstName} ${user.lastName || ''}` : undefined}
          size="lg"
        />
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      <Divider spacing="none" />
      <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={styles.menuItem}
            onPress={() => handleNavigate(item.screen, item.params)}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon} size={22} color={colors.textSecondary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Divider spacing="none" />
      <TouchableOpacity
        style={styles.logout}
        onPress={logout}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={22} color={colors.destructive} />
        <Text style={styles.logoutLabel}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    padding: spacing['5'],
    backgroundColor: colors.primary,
  },
  name: {
    ...typography.h4,
    color: colors.textInverse,
    marginTop: spacing['3'],
  },
  email: {
    ...typography.bodySmall,
    color: colors.primaryPalette[200],
    marginTop: spacing['1'],
  },
  menu: {
    flex: 1,
    paddingVertical: spacing['2'],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['5'],
    paddingVertical: spacing['3.5'],
    gap: spacing['3'],
  },
  menuLabel: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['5'],
    paddingVertical: spacing['4'],
    gap: spacing['3'],
    marginBottom: spacing['4'],
  },
  logoutLabel: {
    ...typography.bodyMedium,
    color: colors.destructive,
    fontWeight: '600',
  },
});
