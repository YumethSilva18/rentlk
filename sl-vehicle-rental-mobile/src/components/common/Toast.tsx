import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radii } from '../../theme/radii';
import { shadows } from '../../theme/shadows';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss: () => void;
  style?: ViewStyle;
}

const typeConfig: Record<ToastType, { icon: keyof typeof Ionicons.glyphMap; bg: string; color: string }> = {
  success: { icon: 'checkmark-circle', bg: colors.backgroundSuccess, color: colors.success },
  error: { icon: 'close-circle', bg: colors.backgroundDestructive, color: colors.destructive },
  warning: { icon: 'warning', bg: colors.backgroundWarning, color: colors.warning },
  info: { icon: 'information-circle', bg: colors.backgroundInfo, color: colors.info },
};

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
  style,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      if (duration > 0) {
        const timer = setTimeout(() => {
          hide();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      hide();
    }
  }, [visible]);

  const hide = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  };

  if (!visible) return null;

  const config = typeConfig[type];

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: config.bg, transform: [{ translateY }], opacity },
        style,
      ]}
    >
      <TouchableOpacity style={styles.content} onPress={onDismiss} activeOpacity={0.9}>
        <Ionicons name={config.icon} size={22} color={config.color} />
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={onDismiss} style={styles.closeBtn}>
          <Ionicons name="close" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['12'],
    paddingBottom: spacing['3'],
    ...shadows.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing['3'],
    borderRadius: radii.md,
    gap: spacing['2'],
  },
  message: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: spacing['1'],
  },
});
