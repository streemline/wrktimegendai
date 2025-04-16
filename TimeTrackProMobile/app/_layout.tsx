import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { AuthProvider } from '../contexts/AuthContext';
import { TranslationProvider } from '../contexts/TranslationContext';
import { database } from '../database/db';
import { ActivityIndicator, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [dbInitialized, setDbInitialized] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Initialize database
  useEffect(() => {
    const initializeDb = async () => {
      try {
        if (Platform.OS === 'web') {
          console.warn('Using mock database for web platform');
          setDbInitialized(true);
        } else {
          await database.init();
          setDbInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
        // Set initialized even on error for web platform
        if (Platform.OS === 'web') {
          setDbInitialized(true);
        }
      }
    };

    initializeDb();
  }, []);

  useEffect(() => {
    if (loaded && dbInitialized) {
      SplashScreen.hideAsync();
    }
  }, [loaded, dbInitialized]);

  useEffect(() => {
    const initDb = async () => {
      try {
        await database.init();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    initDb();
  }, []);

  if (!loaded || !dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <TranslationProvider>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </TranslationProvider>
  );
}
