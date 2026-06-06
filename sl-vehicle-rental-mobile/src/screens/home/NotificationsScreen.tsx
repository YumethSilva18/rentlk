import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { useNotifications } from '../../hooks/useNotifications';
import { formatRelativeTime } from '../../utils/dates';
import type { Notification, NotificationType } from '../../types/notification.types';

interface NotificationsScreenProps {
  navigation: any;
}

const getNotificationIcon = (type: NotificationType): { name: keyof typeof Ionicons.glyphMap; color: string } => {
  switch (type) {
    case 'booking_request':
    case 'booking_confirmed':
    case 'booking_completed':
      return { name: 'calendar-outline', color: colors.primary };
    case 'booking_cancelled':
      return { name: 'close-circle-outline', color: colors.destructive };
    case 'payment_received':
    case 'payment_refunded':
      return { name: 'wallet-outline', color: colors.success };
    case 'payment_failed':
      return { name: 'warning-outline', color: colors.destructive };
    case 'message_new':
      return { name: 'chatbubble-outline', color: colors.info };
    case 'review_new':
    case 'review_response':
      return { name: 'star-outline', color: colors.accent };
    case 'kyc_approved':
    case 'vehicle_approved':
      return { name: 'checkmark-circle-outline', color: colors.success };
    case 'kyc_rejected':
    case 'vehicle_rejected':
      return { name: 'close-circle-outline', color: colors.destructive };
    case 'tracking_alert':
      return { name: 'navigate-outline', color: colors.warning };
    case 'promotion':
      return { name: 'gift-outline', color: colors.accent };
    default:
      return { name: 'notifications-outline', color: colors.textSecondary };
  }
};

const NotificationItem: React.FC<{
  item: Notification;
  onPress: (notification: Notification) => void;
  onMarkRead: (id: string) => void;
}> = ({ item, onPress, onMarkRead }) => {
  const iconInfo = getNotificationIcon(item.type);

  return (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unreadItem]}
      onPress={() => {
        if (!item.read) onMarkRead(item.id);
        onPress(item);
      }}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconInfo.color + '15' }]}>
        <Ionicons name={iconInfo.name} size={22} color={iconInfo.color} />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle} numberOfLines={1}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.notificationTime}>{formatRelativeTime(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markRead,
    markAllRead,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRefresh = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationPress = useCallback((notification: Notification) => {
    if (notification.actionUrl) {
      // Parse action URL and navigate accordingly
      const parts = notification.actionUrl.split('/');
      const lastPart = parts[parts.length - 1];
      switch (notification.type) {
        case 'booking_request':
        case 'booking_confirmed':
        case 'booking_cancelled':
        case 'booking_completed':
          navigation.navigate('BookingDetail', { bookingId: lastPart });
          break;
        case 'message_new':
          navigation.navigate('Chat', { conversationId: lastPart });
          break;
        case 'payment_received':
        case 'payment_failed':
          navigation.navigate('PaymentHistory');
          break;
        default:
          break;
      }
    }
  }, [navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={() => markAllRead()} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.markAllBtn} />
        )}
      </View>

      {isLoading && notifications.length === 0 ? (
        <Loader message="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="notifications-off-outline"
          title="No notifications"
          message="You're all caught up! Check back later."
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              onPress={handleNotificationPress}
              onMarkRead={markRead}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing['4'], paddingVertical: spacing['3'], backgroundColor: colors.surface,
  },
  backBtn: { padding: spacing['2'] },
  headerTitle: { ...typography.h4, color: colors.textPrimary },
  markAllBtn: { padding: spacing['2'] },
  markAllText: { ...typography.labelSmall, color: colors.primary },
  list: { padding: spacing['4'] },
  notificationItem: {
    flexDirection: 'row', padding: spacing['3'], borderRadius: 12,
    backgroundColor: colors.surface,
  },
  unreadItem: { backgroundColor: colors.backgroundInfo, borderLeftWidth: 3, borderLeftColor: colors.primary },
  iconContainer: {
    width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
  },
  notificationContent: { flex: 1, marginLeft: spacing['3'] },
  notificationHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notificationTitle: { ...typography.labelMedium, color: colors.textPrimary, flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginLeft: spacing['2'] },
  notificationMessage: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  notificationTime: { ...typography.caption, color: colors.textTertiary, marginTop: 4 },
  separator: { height: spacing['2'] },
});

export default NotificationsScreen;
export { NotificationsScreen };
