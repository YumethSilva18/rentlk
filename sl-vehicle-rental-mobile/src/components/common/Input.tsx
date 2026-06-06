import React, { forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radii } from '../../theme/radii';
import { spacing } from '../../theme/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, onRightIconPress, containerStyle, required, ...props }, ref) => {
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
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={styles.input}
            placeholderTextColor={colors.textTertiary}
            {...props}
          />
          {rightIcon && (
            <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
        {hasError && <Text style={styles.errorText}>{error}</Text>}
        {hint && !hasError && <Text style={styles.hintText}>{hint}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

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
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing['3'],
  },
  inputError: {
    borderColor: colors.destructive,
  },
  inputDisabled: {
    backgroundColor: colors.background,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textPrimary,
    paddingVertical: spacing['3'],
    minHeight: 48,
  },
  leftIcon: {
    marginRight: spacing['2'],
  },
  rightIcon: {
    marginLeft: spacing['2'],
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.destructive,
    marginTop: spacing['1'],
  },
  hintText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing['1'],
  },
});
