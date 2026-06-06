import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';

type Props = MainScreenProps<'HelpCenter'>;

export const HelpCenterScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      icon: 'car-outline' as const,
      title: 'Booking Issues',
      description: 'Problems with booking or cancellations',
      screen: 'FAQ',
    },
    {
      icon: 'card-outline' as const,
      title: 'Payment Problems',
      description: 'Payment failures or refunds',
      screen: 'FAQ',
    },
    {
      icon: 'shield-checkmark-outline' as const,
      title: 'KYC Verification',
      description: 'Document submission and approval',
      screen: 'FAQ',
    },
    {
      icon: 'chatbubble-ellipses-outline' as const,
      title: 'Messaging',
      description: 'Communication with owners/renters',
      screen: 'FAQ',
    },
    {
      icon: 'navigate-outline' as const,
      title: 'Tracking & Navigation',
      description: 'GPS and route tracking',
      screen: 'FAQ',
    },
    {
      icon: 'settings-outline' as const,
      title: 'Account Settings',
      description: 'Profile and security',
      screen: 'FAQ',
    },
  ];

  const quickActions = [
    {
      icon: 'call-outline' as const,
      title: 'Call Support',
      action: () => Linking.openURL('tel:+94112345678'),
    },
    {
      icon: 'mail-outline' as const,
      title: 'Email Support',
      action: () => Linking.openURL('mailto:support@rentlk.lk'),
    },
    {
      icon: 'chatbubble-outline' as const,
      title: 'Live Chat',
      action: () => navigation.navigate('ContactSupport'),
    },
  ];

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Help Center</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.searchContainer}>
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={<Ionicons name="search-outline" size={20} color={colors.textSecondary} />}
            />
          </View>

          <Text style={styles.sectionTitle}>How can we help?</Text>
          <View style={styles.categoriesGrid}>
            {helpCategories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryCard}
                onPress={() => (navigation as any).navigate(category.screen)}
              >
                <View style={styles.categoryIcon}>
                  <Ionicons name={category.icon} size={28} color={colors.primary} />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Card style={styles.quickActionsCard}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionItem}
                onPress={action.action}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name={action.icon} size={24} color={colors.primary} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </Card>

          <Button
            title="Contact Support"
            onPress={() => navigation.navigate('ContactSupport')}
            icon={<Ionicons name="headset-outline" size={20} color={colors.white} />}
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
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing['3'],
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['3'],
    marginBottom: spacing['4'],
  },
  categoryCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing['3'],
    gap: spacing['2'],
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['1'],
  },
  categoryTitle: {
    ...typography.labelMedium,
    color: colors.textPrimary,
  },
  categoryDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  quickActionsCard: {
    padding: spacing['4'],
    marginBottom: spacing['4'],
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing['3'],
    gap: spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    flex: 1,
    ...typography.labelMedium,
    color: colors.textPrimary,
  },
});
