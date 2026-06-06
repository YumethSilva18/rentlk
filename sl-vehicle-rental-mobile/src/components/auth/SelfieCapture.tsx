import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Card } from '../common/Card';

interface SelfieCaptureProps {
  imageUri?: string | null;
  onCapture: () => void;
  onRetake?: () => void;
}

export const SelfieCapture: React.FC<SelfieCaptureProps> = ({
  imageUri,
  onCapture,
  onRetake,
}) => {
  return (
    <Card style={styles.card} elevated={false} bordered>
      {imageUri ? (
        <View>
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
          <View style={styles.actions}>
            <TouchableOpacity onPress={onRetake || onCapture} style={styles.actionBtn}>
              <Ionicons name="refresh-outline" size={18} color={colors.primary} />
              <Text style={styles.actionText}>Retake</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={onCapture} style={styles.captureArea}>
          <View style={styles.circle}>
            <Ionicons name="camera-outline" size={48} color={colors.textTertiary} />
          </View>
          <Text style={styles.captureLabel}>Take a Selfie</Text>
          <Text style={styles.captureHint}>Ensure good lighting and clear face</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: spacing['4'] },
  preview: { width: '100%', height: 280, borderRadius: 12, marginBottom: spacing['3'] },
  actions: { flexDirection: 'row', justifyContent: 'center' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing['1.5'], padding: spacing['2'] },
  actionText: { ...typography.labelMedium, color: colors.primary },
  captureArea: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: spacing['10'],
    borderWidth: 2, borderColor: colors.border, borderRadius: 16, borderStyle: 'dashed',
  },
  circle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing['3'],
  },
  captureLabel: { ...typography.h4, color: colors.textPrimary },
  captureHint: { ...typography.bodySmall, color: colors.textTertiary, marginTop: spacing['1'] },
});
