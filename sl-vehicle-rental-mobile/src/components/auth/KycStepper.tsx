import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface Step {
  id: number;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface KycStepperProps {
  steps: Step[];
  currentStep: number;
}

export const KycStepper: React.FC<KycStepperProps> = ({ steps, currentStep }) => {
  return (
    <View>
      <View style={styles.stepper}>
        {steps.map((s, i) => (
          <View key={s.id} style={styles.stepItem}>
            <View style={[
              styles.circle,
              currentStep >= s.id ? styles.circleActive : null,
              currentStep > s.id ? styles.circleDone : null,
            ]}>
              {currentStep > s.id ? (
                <Ionicons name="checkmark" size={16} color={colors.surface} />
              ) : (
                <Ionicons name={s.icon} size={16} color={currentStep >= s.id ? colors.surface : colors.textTertiary} />
              )}
            </View>
            {i < steps.length - 1 && (
              <View style={[styles.line, currentStep > s.id ? styles.lineActive : null]} />
            )}
          </View>
        ))}
      </View>
      <View style={styles.labels}>
        {steps.map((s) => (
          <Text key={s.id} style={[styles.label, currentStep === s.id ? styles.labelActive : null]}>
            {s.title}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepper: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing['6'] },
  stepItem: { flex: 1, alignItems: 'center', flexDirection: 'row' },
  circle: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.border,
  },
  circleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  circleDone: { backgroundColor: colors.success, borderColor: colors.success },
  line: { flex: 1, height: 2, backgroundColor: colors.border, marginHorizontal: spacing['2'] },
  lineActive: { backgroundColor: colors.success },
  labels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing['4'], marginTop: spacing['2'] },
  label: { ...typography.caption, color: colors.textTertiary, textAlign: 'center', flex: 1 },
  labelActive: { color: colors.primary, fontWeight: '600' },
});
