import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initDatabase } from '../src/db/database';
import '../global.css';

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1e293b' },
          headerTintColor: '#f1f5f9',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#0f172a' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="workout/active" options={{ title: 'Active Workout', headerBackVisible: false }} />
        <Stack.Screen name="workout/[id]" options={{ title: 'Workout Details' }} />
        <Stack.Screen name="program/[id]" options={{ title: 'Program' }} />
        <Stack.Screen name="program/create" options={{ title: 'New Program', presentation: 'modal' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
