import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Avatar } from '@/components/common/Avatar';
import { Loader } from '@/components/common/Loader';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';
import { formatRelativeTime } from '@/utils/format';

type Props = MainScreenProps<'Chat'>;

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const { conversationId } = route.params;
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'other',
      text: 'Hi! Is the vehicle still available?',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'read',
    },
    {
      id: '2',
      senderId: 'me',
      text: 'Yes, it is available. When would you like to book it?',
      timestamp: new Date(Date.now() - 7000000).toISOString(),
      status: 'read',
    },
  ]);

  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: messageText.trim(),
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText('');
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === 'me';
    
    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
        <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble]}>
          <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[styles.timestamp, isMe && styles.myTimestamp]}>
              {formatRelativeTime(item.timestamp)}
            </Text>
            {isMe && (
              <Ionicons
                name={item.status === 'read' ? 'checkmark-done' : 'checkmark'}
                size={14}
                color={item.status === 'read' ? '#00BFFF' : colors.textTertiary}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Avatar name="User" size="md" />
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Kasun Perera</Text>
            <Text style={styles.headerSubtitle}>Online</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Loader />
          </View>
        ) : (
          <KeyboardAvoidingView
            style={styles.chatContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Type a message..."
                placeholderTextColor={colors.textTertiary}
                multiline
                maxLength={1000}
              />
              <TouchableOpacity
                style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
                onPress={handleSendMessage}
                disabled={!messageText.trim()}
              >
                <Ionicons name="send" size={20} color={messageText.trim() ? colors.white : colors.textTertiary} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
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
    alignItems: 'center',
    padding: spacing['4'],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing['3'],
  },
  backButton: {
    marginRight: spacing['2'],
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.success,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: spacing['4'],
    gap: spacing['2'],
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: spacing['2'],
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  theirMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing['3'],
    borderRadius: radii.lg,
  },
  myBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: radii.sm,
  },
  theirBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: radii.sm,
  },
  messageText: {
    ...typography.bodyMedium,
    marginBottom: spacing['1'],
  },
  myText: {
    color: colors.white,
  },
  theirText: {
    color: colors.textPrimary,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing['1'],
  },
  timestamp: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  myTimestamp: {
    color: colors.white + 'CC',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing['3'],
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing['2'],
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing['3'],
    ...typography.bodyMedium,
    color: colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
});
