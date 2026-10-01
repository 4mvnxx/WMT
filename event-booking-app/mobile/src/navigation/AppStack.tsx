import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventListScreen from '../screens/EventListScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import AllBookingsScreen from '../screens/AllBookingsScreen';
import EventFormScreen from '../screens/EventFormScreen';
import { useAuth } from '../context/AuthContext';
import { AppTheme } from '../constants/appTheme';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: AppTheme.colors.navy },
        headerTintColor: AppTheme.colors.white,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: AppTheme.colors.ice },
      }}
    >
      <Stack.Screen
        name="Events"
        component={EventListScreen}
        options={{ title: user?.role === 'admin' ? 'Admin Dashboard' : 'Event Hub' }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: 'Event Details' }}
      />
      <Stack.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{ title: 'My Bookings' }}
      />
      <Stack.Screen
        name="AllBookings"
        component={AllBookingsScreen}
        options={{ title: 'All Bookings' }}
      />
      <Stack.Screen
        name="EventForm"
        component={EventFormScreen}
        options={({ route }: any) => ({
          title: route?.params?.event ? 'Edit Event' : 'Add Event',
        })}
      />
    </Stack.Navigator>
  );
}

