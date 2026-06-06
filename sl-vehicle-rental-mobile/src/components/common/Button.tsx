import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radii } from '../../theme/radii';
import { shadows } from '../../theme/shadows';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.primary, text: colors.primaryForeground },
  secondary: { bg: colors.backgroundPrimary, text: colors.primary },
  outline: { bg: colors.transparent, text: colors.primary, border: colors.primary },
  ghost: { bg: colors.transparent, text: colors.primary },
  destructive: { bg: colors.destructive, text: colors.destructiveForeground },
  accent: { bg: colors.accent, text: colors.accentForeground },
};

const sizeStyles: Record<ButtonSize, { paddingV: number; paddingH: number; fontSize: number }> = {
  sm: { paddingV: 8, paddingH: 16, fontSize: 12 },
  md: { paddingV: 12, paddingH: 24, fontSize: 14 },
  lg: { paddingV: 16, paddingH: 32, fontSize: 16 },
};

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled,
  style,
  ...props
}) => {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle = {
    backgroundColor: variantStyle.bg,
    borderRadius: radii.button,
    paddingVertical: sizeStyle.paddingV,
    paddingHorizontal: sizeStyle.paddingH,
    borderWidth: variantStyle.border ? 1.5 : 0,
    borderColor: variantStyle.border || 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    opacity: isDisabled ? 0.6 : 1,
    ...(fullWidth ? { width: '100%' } : {}),
    ...(variant === 'primary' || variant === 'destructive' ? shadows.button : {}),
  };

  const textStyle: TextStyle = {
    ...typography.button,
    fontSize: sizeStyle.fontSize,
    color: variantStyle.text,
  };

  return (
    <TouchableOpacity
      style={[containerStyle, style as ViewStyle]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyle.text} />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={textStyle}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};
