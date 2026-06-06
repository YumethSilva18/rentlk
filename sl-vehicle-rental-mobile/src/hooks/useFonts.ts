import { useState, useEffect } from 'react';
import * as Font from 'expo-font';

export function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          // Add custom fonts here if needed
          // Example: 'Inter-Regular': require('@/assets/fonts/Inter-Regular.ttf'),
          // Example: 'Inter-Bold': require('@/assets/fonts/Inter-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true); // Continue even if fonts fail to load
      }
    }

    loadFonts();
  }, []);

  return fontsLoaded;
}
