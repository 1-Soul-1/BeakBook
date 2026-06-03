// components/Toast.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ThemedText } from './Themed';
import { Spacing, BorderRadius } from '../constants/theme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'success',
  duration = 2500,
  onHide,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  };

  if (!visible) return null;

  // Иконки как в HTML версии
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'exclamation-circle';
      case 'warning':
        return 'triangle-exclamation';
      default:
        return 'info-circle';
    }
  };

  // Цвета как в HTML версии
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#4CAF50'; // Зеленый для успеха
      case 'error':
        return '#E39371'; // Терракотовый для ошибки (как danger в HTML)
      case 'warning':
        return '#E0B85C'; // Золотистый для предупреждения (как warning в HTML)
      default:
        return '#6A7A5C'; // Акцентный цвет как в HTML
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={hideToast}
        style={[styles.toast, { backgroundColor: getBackgroundColor() }]}
      >
        <FontAwesome6 name={getIcon()} size={18} color="#FFFFFF" />
        <ThemedText style={styles.message}>{message}</ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 90,
    left: Spacing.four,
    right: Spacing.four,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.round,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      },
    }),
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});