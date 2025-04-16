import React from 'react';
import { Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={80}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        style={{ flex: 1 }}
      />
    );
  }
  
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f2f2f2',
      }}
    />
  );
}