// ============================================================================
// AuthStack - Authentication flow screens
// ============================================================================

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/types/navigation.types';

// Lazy import screens
const WelcomeScreen = React.lazy(() => import('@/screens/auth/WelcomeScreen'));
const LoginScreen = React.lazy(() => import('@/screens/auth/LoginScreen'));
const SignupScreen = React.lazy(() => import('@/screens/auth/SignupScreen'));
const PhoneVerificationScreen = React.lazy(() => import('@/screens/auth/PhoneVerificationScreen'));
const ForgotPasswordScreen = React.lazy(() => import('@/screens/auth/ForgotPasswordScreen'));
const ResetPasswordScreen = React.lazy(() => import('@/screens/auth/ResetPasswordScreen'));
const KYCScreen = React.lazy(() => import('@/screens/auth/KYCScreen'));

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="KYC" component={KYCScreen} options={{ headerShown: true, title: 'KYC Verification' }} />
    </Stack.Navigator>
  );
};
