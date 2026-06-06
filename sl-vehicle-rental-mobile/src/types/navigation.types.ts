// ============================================================================
// Navigation Types - React Navigation type definitions
// ============================================================================

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Root Stack (Auth + Main)
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  PhoneVerification: { phone: string };
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  KYC: undefined;
};

// Main Stack (after auth)
export type MainStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  // Home Stack screens
  Search: undefined;
  Notifications: undefined;
  VehicleList: { filters?: Record<string, unknown> };
  VehicleDetail: { vehicleId: string };
  VehicleSearch: undefined;
  // Booking Stack screens
  BookingCreate: { vehicleId: string };
  BookingConfirmation: { bookingId: string };
  BookingSuccess: { bookingId: string };
  BookingDetail: { bookingId: string };
  Invoice: { bookingId: string };
  // Vehicle management screens
  MyVehicles: undefined;
  AddVehicle: undefined;
  EditVehicle: { vehicleId: string };
  SavedVehicles: undefined;
  // Message screens
  Chat: { conversationId: string };
  NewMessage: { userId?: string; vehicleId?: string };
  // Profile screens
  EditProfile: undefined;
  Settings: undefined;
  Security: undefined;
  KYCStatus: undefined;
  Wallet: undefined;
  Payout: undefined;
  PaymentMethods: undefined;
  PaymentHistory: undefined;
  Reviews: undefined;
  WriteReview: { bookingId: string; targetId: string; targetType: 'vehicle' | 'owner' | 'renter' };
  HelpCenter: undefined;
  ContactSupport: undefined;
  FAQ: undefined;
  // Tracking screens
  Tracking: { sessionId?: string };
  Map: { sessionId: string };
  RouteHistory: { sessionId: string };
  // Payment screens
  Payment: { bookingId: string };
  PaymentSuccess: { transactionId: string };
  PaymentFailure: { error?: string };
  // Admin screens
  AdminHome: undefined;
  AdminUsers: undefined;
  AdminVehicles: undefined;
  AdminBookings: undefined;
  AdminKYC: undefined;
  AdminTransactions: undefined;
  AdminFraud: undefined;
  AdminReports: undefined;
};

// Bottom Tab Navigator
export type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeTabParamList>;
  BookingsTab: NavigatorScreenParams<BookingsTabParamList>;
  MessagesTab: NavigatorScreenParams<MessagesTabParamList>;
  ProfileTab: NavigatorScreenParams<ProfileTabParamList>;
};

// Individual Tab Stacks
export type HomeTabParamList = {
  Home: undefined;
};

export type BookingsTabParamList = {
  MyBookings: undefined;
};

export type MessagesTabParamList = {
  Conversations: undefined;
};

export type ProfileTabParamList = {
  Profile: undefined;
};

// Screen Props types
export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, T>;
export type MainScreenProps<T extends keyof MainStackParamList> = NativeStackScreenProps<MainStackParamList, T>;
export type TabScreenProps<T extends keyof TabParamList> = BottomTabScreenProps<TabParamList, T>;
