import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Card } from '../common/Card';

interface DocumentUploaderProps {
  label: string;
  imageUri?: string | null;
  onCapture: () => void;
  onRemove?: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  label,
  imageUri,
  onCapture,
  onRemove,
}) => {
  return (
    <Card style={styles.card} elevated={false} bordered>
      {imageUri ? (
        <View>
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
          <View style={styles.actions}>
            <TouchableOpacity onPress={onCapture} style={styles.actionBtn}>
              <Ionicons name="camera-outline" size={18} color={colors.primary} />
              <Text style={styles.actionText}>Retake</Text>
            </TouchableOpacity>
            {onRemove && (
              <TouchableOpacity onPress={onRemove} style={styles.actionBtn}>
                <Ionicons name="trash-outline" size={18} color={colors.destructive} />
                <Text style={[styles.actionText, styles.removeText]}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={onCapture} style={styles.uploadArea}>
          <Ionicons name="document-outline" size={40} color={colors.textTertiary} />
          <Text style={styles.uploadLabel}>{label}</Text>
          <Text style={styles.uploadHint}>Tap to capture or upload</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: spacing['4'] },
  preview: { width: '100%', height: 200, borderRadius: 8, marginBottom: spacing['3'] },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing['1.5'], padding: spacing['2'] },
  actionText: { ...typography.labelMedium, color: colors.primary },
  removeText: { color: colors.destructive },
  uploadArea: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: spacing['8'],
    borderWidth: 2, borderColor: colors.border, borderRadius: 12, borderStyle: 'dashed',
  },
  uploadLabel: { ...typography.labelLarge, color: colors.textPrimary, marginTop: spacing['3'] },
  uploadHint: { ...typography.bodySmall, color: colors.textTertiary, marginTop: spacing['1'] },
});
