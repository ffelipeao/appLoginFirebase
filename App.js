import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppNavigator />
    </SafeAreaView>
  );
}
