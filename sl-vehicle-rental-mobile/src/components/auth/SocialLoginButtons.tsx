import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radii } from '../../theme/radii';

interface SocialLoginButtonsProps {
  onGooglePress?: () => void;
  onFacebookPress?: () => void;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGooglePress,
  onFacebookPress,
}) => {
  return (
    <View>
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={onGooglePress} activeOpacity={0.7}>
          <Ionicons name="logo-google" size={22} color={colors.textPrimary} />
          <Text style={styles.btnLabel}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={onFacebookPress} activeOpacity={0.7}>
          <Ionicons name="logo-facebook" size={22} color={colors.primary} />
          <Text style={styles.btnLabel}>Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    flexDirection: 'row', alignItems: 'center', marginVertical: spacing['5'],
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { ...typography.bodySmall, color: colors.textTertiary, paddingHorizontal: spacing['3'] },
  row: { flexDirection: 'row', gap: spacing['3'] },
  btn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing['3'], borderRadius: radii.button,
    borderWidth: 1, borderColor: colors.border, gap: spacing['2'],
  },
  btnLabel: { ...typography.labelMedium, color: colors.textPrimary },
});
