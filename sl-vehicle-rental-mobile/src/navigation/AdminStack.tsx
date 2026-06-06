import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminHomeScreen } from '../screens/admin/AdminHomeScreen';
import { AdminUsersScreen } from '../screens/admin/AdminUsersScreen';
import { AdminVehiclesScreen } from '../screens/admin/AdminVehiclesScreen';
import { AdminBookingsScreen } from '../screens/admin/AdminBookingsScreen';
import { AdminKycScreen } from '../screens/admin/AdminKycScreen';
import { AdminTransactionsScreen } from '../screens/admin/AdminTransactionsScreen';
import { AdminFraudScreen } from '../screens/admin/AdminFraudScreen';
import { AdminReportsScreen } from '../screens/admin/AdminReportsScreen';
import { colors } from '../theme';

export type AdminStackParamList = {
  AdminHome: undefined;
  AdminUsers: undefined;
  AdminVehicles: undefined;
  AdminBookings: undefined;
  AdminKyc: undefined;
  AdminTransactions: undefined;
  AdminFraud: undefined;
  AdminReports: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

export const AdminStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.text.inverse,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{ title: 'Admin Dashboard' }}
      />
      <Stack.Screen
        name="AdminUsers"
        component={AdminUsersScreen}
        options={{ title: 'Manage Users' }}
      />
      <Stack.Screen
        name="AdminVehicles"
        component={AdminVehiclesScreen}
        options={{ title: 'Manage Vehicles' }}
      />
      <Stack.Screen
        name="AdminBookings"
        component={AdminBookingsScreen}
        options={{ title: 'Manage Bookings' }}
      />
      <Stack.Screen
        name="AdminKyc"
        component={AdminKycScreen}
        options={{ title: 'KYC Verification' }}
      />
      <Stack.Screen
        name="AdminTransactions"
        component={AdminTransactionsScreen}
        options={{ title: 'Transactions' }}
      />
      <Stack.Screen
        name="AdminFraud"
        component={AdminFraudScreen}
        options={{ title: 'Fraud Detection' }}
      />
      <Stack.Screen
        name="AdminReports"
        component={AdminReportsScreen}
        options={{ title: 'Reports' }}
      />
    </Stack.Navigator>
  );
};
