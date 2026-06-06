import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Avatar } from '@/components/common/Avatar';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';

type Props = MainScreenProps<'NewMessage'>;

export const NewMessageScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId, vehicleId } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(userId || null);

  const recentContacts = [
    { id: '1', name: 'Kasun Perera', avatar: null, lastActive: '2h ago' },
    { id: '2', name: 'Dilani Silva', avatar: null, lastActive: '1d ago' },
  ];

  const handleStartConversation = () => {
    if (!selectedUser) {
      Alert.alert('Select User', 'Please select a user to message');
      return;
    }
    if (!message.trim()) {
      Alert.alert('Empty Message', 'Please type a message');
      return;
    }

    // Navigate to chat with new conversation
    navigation.navigate('Chat', { conversationId: 'new' });
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>New Message</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.searchContainer}>
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={<Ionicons name="search-outline" size={20} color={colors.textSecondary} />}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Contacts</Text>
            {recentContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={[
                  styles.contactItem,
                  selectedUser === contact.id && styles.selectedContact
                ]}
                onPress={() => setSelectedUser(contact.id)}
              >
                <Avatar name={contact.name} uri={contact.avatar} size="md" />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactLastActive}>Last active {contact.lastActive}</Text>
                </View>
                {selectedUser === contact.id && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Message</Text>
            <Input
              placeholder="Type your message..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              style={styles.messageInput}
            />
          </View>

          <Button
            title="Start Conversation"
            onPress={handleStartConversation}
            disabled={!selectedUser || !message.trim()}
            style={styles.submitButton}
          />
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
  searchContainer: {
    marginBottom: spacing['2'],
  },
  section: {
    gap: spacing['3'],
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing['2'],
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing['3'],
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    gap: spacing['3'],
    marginBottom: spacing['2'],
  },
  selectedContact: {
    backgroundColor: colors.backgroundPrimary,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    marginBottom: spacing['0.5'],
  },
  contactLastActive: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  messageInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: spacing['4'],
  },
});
