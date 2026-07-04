import React from 'react';
import { Stack } from 'expo-router';
import { useBizBagStore } from '../lib/store/useBizBagStore';
import { SplashScreen } from '../components/ui/SplashScreen';

export default function RootLayout() {
  const { loggedIn, darkMode } = useBizBagStore();
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // Simular tiempo de inicialización
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: darkMode ? '#1A1D24' : '#F5F7FA' },
      }}
    >
      {!loggedIn ? (
        <Stack.Screen name="index" options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="inbox" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="admin" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}
