import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useAuth } from '../context/AuthContext';
import LoadingView from '../components/LoadingView';

export default function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) {
    return <LoadingView text="Initializing app..." />;
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        {token ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </>
  );
}
