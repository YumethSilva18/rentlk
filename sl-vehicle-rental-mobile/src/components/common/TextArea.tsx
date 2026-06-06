import React, { forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radii } from '../../theme/radii';
import { spacing } from '../../theme/spacing';

interface TextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

export const TextArea = forwardRef<TextInput, TextAreaProps>(
  ({ label, error, hint, containerStyle, required, maxLength, showCount, ...props }, ref) => {
    const hasError = !!error;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}
        <View
          style={[
            styles.inputContainer,
            hasError ? styles.inputError : null,
            props.editable === false ? styles.inputDisabled : null,
          ]}
        >
          <TextInput
            ref={ref}
            style={styles.input}
            placeholderTextColor={colors.textTertiary}
            multiline
            textAlignVertical="top"
            maxLength={maxLength}
            {...props}
          />
        </View>
        <View style={styles.bottomRow}>
          {hasError && <Text style={styles.errorText}>{error}</Text>}
          {hint && !hasError && <Text style={styles.hintText}>{hint}</Text>}
          {showCount && maxLength && (
            <Text style={styles.countText}>
              {(props.value?.length || 0)}/{maxLength}
            </Text>
          )}
        </View>
      </View>
    );
  }
);

TextArea.displayName = 'TextArea';

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing['4'],
  },
  label: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    marginBottom: spacing['1.5'],
  },
  required: {
    color: colors.destructive,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['2'],
  },
  inputError: {
    borderColor: colors.destructive,
  },
  inputDisabled: {
    backgroundColor: colors.background,
    opacity: 0.6,
  },
  input: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    minHeight: 100,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing['1'],
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.destructive,
    flex: 1,
  },
  hintText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  countText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
});
