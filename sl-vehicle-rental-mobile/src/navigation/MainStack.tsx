// ============================================================================
// MainStack - Main app navigation (after auth)
// ============================================================================

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '@/theme/colors';
import type { MainStackParamList } from '@/types/navigation.types';
import { TabNavigator } from './TabNavigator';
import { AdminStack } from './AdminStack';

// Lazy-loaded screens
const SearchScreen = React.lazy(() => import('@/screens/home/SearchScreen'));
const NotificationsScreen = React.lazy(() => import('@/screens/home/NotificationsScreen'));
const VehicleListScreen = React.lazy(() => import('@/screens/vehicles/VehicleListScreen'));
const VehicleDetailScreen = React.lazy(() => import('@/screens/vehicles/VehicleDetailScreen'));
const VehicleSearchScreen = React.lazy(() => import('@/screens/vehicles/VehicleSearchScreen'));
const AddVehicleScreen = React.lazy(() => import('@/screens/vehicles/AddVehicleScreen'));
const EditVehicleScreen = React.lazy(() => import('@/screens/vehicles/EditVehicleScreen'));
const MyVehiclesScreen = React.lazy(() => import('@/screens/vehicles/MyVehiclesScreen'));
const SavedVehiclesScreen = React.lazy(() => import('@/screens/vehicles/SavedVehiclesScreen'));
const BookingCreateScreen = React.lazy(() => import('@/screens/bookings/BookingScreen'));
const BookingConfirmationScreen = React.lazy(() => import('@/screens/bookings/BookingConfirmationScreen'));
const BookingSuccessScreen = React.lazy(() => import('@/screens/bookings/BookingSuccessScreen'));
const BookingDetailScreen = React.lazy(() => import('@/screens/bookings/BookingDetailScreen'));
const InvoiceScreen = React.lazy(() => import('@/screens/bookings/InvoiceScreen'));
const ChatScreen = React.lazy(() => import('@/screens/messages/ChatScreen'));
const NewMessageScreen = React.lazy(() => import('@/screens/messages/NewMessageScreen'));
const EditProfileScreen = React.lazy(() => import('@/screens/profile/EditProfileScreen'));
const SettingsScreen = React.lazy(() => import('@/screens/profile/SettingsScreen'));
const SecurityScreen = React.lazy(() => import('@/screens/profile/SecurityScreen'));
const KYCStatusScreen = React.lazy(() => import('@/screens/profile/KYCStatusScreen'));
const WalletScreen = React.lazy(() => import('@/screens/payments/WalletScreen'));
const PayoutScreen = React.lazy(() => import('@/screens/payments/PayoutScreen'));
const PaymentMethodsScreen = React.lazy(() => import('@/screens/payments/PaymentMethodsScreen'));
const PaymentHistoryScreen = React.lazy(() => import('@/screens/payments/PaymentHistoryScreen'));
const PaymentScreen = React.lazy(() => import('@/screens/payments/PaymentScreen'));
const PaymentSuccessScreen = React.lazy(() => import('@/screens/payments/PaymentSuccessScreen'));
const PaymentFailureScreen = React.lazy(() => import('@/screens/payments/PaymentFailureScreen'));
const ReviewsScreen = React.lazy(() => import('@/screens/reviews/ReviewsScreen'));
const WriteReviewScreen = React.lazy(() => import('@/screens/reviews/WriteReviewScreen'));
const HelpCenterScreen = React.lazy(() => import('@/screens/support/HelpCenterScreen'));
const ContactSupportScreen = React.lazy(() => import('@/screens/support/ContactSupportScreen'));
const FAQScreen = React.lazy(() => import('@/screens/support/FAQScreen'));
const TrackingScreen = React.lazy(() => import('@/screens/tracking/TrackingScreen'));
const MapScreen = React.lazy(() => import('@/screens/tracking/MapScreen'));
const RouteHistoryScreen = React.lazy(() => import('@/screens/tracking/RouteHistoryScreen'));
const AdminHomeScreen = React.lazy(() => import('@/screens/admin/AdminHomeScreen'));
const AdminUsersScreen = React.lazy(() => import('@/screens/admin/AdminUsersScreen'));
const AdminVehiclesScreen = React.lazy(() => import('@/screens/admin/AdminVehiclesScreen'));
const AdminBookingsScreen = React.lazy(() => import('@/screens/admin/AdminBookingsScreen'));
const AdminKYCScreen = React.lazy(() => import('@/screens/admin/AdminKYCScreen'));
const AdminTransactionsScreen = React.lazy(() => import('@/screens/admin/AdminTransactionsScreen'));
const AdminFraudScreen = React.lazy(() => import('@/screens/admin/AdminFraudScreen'));
const AdminReportsScreen = React.lazy(() => import('@/screens/admin/AdminReportsScreen'));
const MessagesScreen = React.lazy(() => import('@/screens/messages/MessagesScreen'));

const Stack = createNativeStackNavigator<MainStackParamList>();

const defaultScreenOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: '600' as const },
};

export const MainStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      {/* Tab Navigator */}
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />

      {/* Home */}
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="VehicleList" component={VehicleListScreen} options={{ title: 'Vehicles' }} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} options={{ title: 'Vehicle Details' }} />
      <Stack.Screen name="VehicleSearch" component={VehicleSearchScreen} options={{ title: 'Search Vehicles' }} />

      {/* Vehicles */}
      <Stack.Screen name="MyVehicles" component={MyVehiclesScreen} options={{ title: 'My Vehicles' }} />
      <Stack.Screen name="AddVehicle" component={AddVehicleScreen} options={{ title: 'Add Vehicle' }} />
      <Stack.Screen name="EditVehicle" component={EditVehicleScreen} options={{ title: 'Edit Vehicle' }} />
      <Stack.Screen name="SavedVehicles" component={SavedVehiclesScreen} options={{ title: 'Saved Vehicles' }} />

      {/* Bookings */}
      <Stack.Screen name="BookingCreate" component={BookingCreateScreen} options={{ title: 'Book Vehicle' }} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} options={{ title: 'Confirm Booking' }} />
      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} options={{ title: 'Booking Confirmed', headerBackVisible: false }} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} options={{ title: 'Booking Details' }} />
      <Stack.Screen name="Invoice" component={InvoiceScreen} options={{ title: 'Invoice' }} />

      {/* Messages */}
      <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
      <Stack.Screen name="NewMessage" component={NewMessageScreen} options={{ title: 'New Message' }} />

      {/* Profile */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="Security" component={SecurityScreen} options={{ title: 'Security' }} />
      <Stack.Screen name="KYCStatus" component={KYCStatusScreen} options={{ title: 'KYC Status' }} />
      <Stack.Screen name="Wallet" component={WalletScreen} options={{ title: 'Wallet' }} />
      <Stack.Screen name="Payout" component={PayoutScreen} options={{ title: 'Withdraw Funds' }} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ title: 'Payment Methods' }} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} options={{ title: 'Payment History' }} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} options={{ title: 'Reviews' }} />
      <Stack.Screen name="WriteReview" component={WriteReviewScreen} options={{ title: 'Write Review' }} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} options={{ title: 'Help Center' }} />
      <Stack.Screen name="ContactSupport" component={ContactSupportScreen} options={{ title: 'Contact Support' }} />
      <Stack.Screen name="FAQ" component={FAQScreen} options={{ title: 'FAQ' }} />

      {/* Tracking */}
      <Stack.Screen name="Tracking" component={TrackingScreen} options={{ title: 'Tracking' }} />
      <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Map', headerShown: false }} />
      <Stack.Screen name="RouteHistory" component={RouteHistoryScreen} options={{ title: 'Route History' }} />

      {/* Payments */}
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Payment' }} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} options={{ headerBackVisible: false }} />
      <Stack.Screen name="PaymentFailure" component={PaymentFailureScreen} options={{ title: 'Payment Failed' }} />

      {/* Admin */}
      <Stack.Screen name="AdminHome" component={AdminStack} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};
