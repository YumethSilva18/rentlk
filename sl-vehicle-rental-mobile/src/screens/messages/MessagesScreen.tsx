import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Avatar } from '@/components/common/Avatar';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchBar } from '@/components/common/SearchBar';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';
import { formatRelativeTime } from '@/utils/format';

type Props = MainScreenProps<'Chat'>;

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online?: boolean;
}

export const MessagesScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'Kasun Perera',
      lastMessage: 'Is the vehicle still available?',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 2,
      online: true,
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Dilani Silva',
      lastMessage: 'Thank you for the booking!',
      lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
      unreadCount: 0,
    },
  ]);

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => navigation.navigate('Chat', { conversationId: item.id })}
    >
      <View style={styles.conversationContent}>
        <View style={styles.avatarContainer}>
          <Avatar name={item.userName} uri={item.userAvatar} size="lg" />
          {item.online && <View style={styles.onlineBadge} />}
        </View>

        <View style={styles.conversationDetails}>
          <View style={styles.conversationHeader}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.time}>{formatRelativeTime(item.lastMessageTime)}</Text>
          </View>
          <View style={styles.messageRow}>
            <Text 
              style={[
                styles.lastMessage,
                item.unreadCount > 0 && styles.unreadMessage
              ]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.container}>
          <Loader />
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity
            style={styles.newMessageButton}
            onPress={() => navigation.navigate('NewMessage', {})}
          >
            <Ionicons name="create-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search conversations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {conversations.length === 0 ? (
          <EmptyState
            icon="chatbubble-ellipses-outline"
            title="No Messages"
          />
        ) : (
          <FlatList
            data={conversations}
            renderItem={renderConversation}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing['4'],
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  newMessageButton: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['2'],
  },
  listContent: {
    padding: spacing['4'],
    paddingTop: 0,
  },
  conversationItem: {
    marginBottom: spacing['2'],
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing['3'],
  },
  conversationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  avatarContainer: {
    position: 'relative',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  conversationDetails: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['1'],
  },
  userName: {
    ...typography.labelMedium,
    color: colors.textPrimary,
  },
  time: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  unreadMessage: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['1'],
    marginLeft: spacing['2'],
  },
  unreadText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
});
