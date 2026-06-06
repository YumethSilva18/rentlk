// ============================================================================
// AppNavigator - Root navigation container
// ============================================================================

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '@/store/auth.store';
import { RootNavigator } from './RootNavigator';

export const AppNavigator: React.FC = () => {
  const isInitialized = useAuthStore((state) => state.isInitialized);

  if (!isInitialized) {
    return null; // App.tsx shows splash screen during init
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};
