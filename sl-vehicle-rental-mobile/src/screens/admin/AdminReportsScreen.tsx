import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { colors, typography, spacing } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';

type Props = MainScreenProps<'AdminReports'>;

export const AdminReportsScreen: React.FC<Props> = () => (
  <ScreenWrapper>
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Analytics & Reports</Text>
    </SafeAreaView>
  </ScreenWrapper>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing['4'] },
  title: { ...typography.h2, color: colors.textPrimary },
});
