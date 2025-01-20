/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import { RootStackParamList } from './src/navigation/types';
import { FavoriteProvider } from './src/contexts/FavoriteContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <FavoriteProvider>
      <SafeAreaProvider style={{ backgroundColor: '#121212' }}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <NavigationContainer theme={DarkTheme}>
          <Stack.Navigator>
            <Stack.Screen 
              name="MainTab" 
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </FavoriteProvider>
  );
};

export default App;
