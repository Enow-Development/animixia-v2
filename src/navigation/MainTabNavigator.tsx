import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, Pressable } from 'react-native';

import HomeScreen from '../screens/Home';
import LibraryScreen from '../screens/Library';
import SettingsScreen from '../screens/Settings';
import AnimeDetail from '../screens/AnimeDetail';
import GenreAnime from '../screens/GenreAnime';
import SearchResult from '../screens/SearchResult';
import AllAnime from '../screens/AllAnime';
import OngoingAnime from '../screens/OngoingAnime';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#121212',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'QuicksandBold',
        },
      }}
    >
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SearchResult" 
        component={SearchResult}
        options={({ route }: any) => ({
          title: `Hasil Pencarian: ${route.params?.keyword || ''}`
        })}
      />
      <Stack.Screen 
        name="AnimeDetail" 
        component={AnimeDetail}
        options={({ route }: any) => ({
          title: route.params?.title || 'Detail Anime'
        })}
      />
      <Stack.Screen 
        name="GenreAnime" 
        component={GenreAnime}
        options={({ route }: any) => ({
          title: route.params?.title || 'Anime List'
        })}
      />
      <Stack.Screen 
        name="AllAnime" 
        component={AllAnime}
        options={{ title: 'Semua Anime' }}
      />
      <Stack.Screen 
        name="OngoingAnime" 
        component={OngoingAnime}
        options={{ title: 'Sedang Tayang' }}
      />
    </Stack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#666666',
        tabBarButton: (props) => (
          <Pressable
            {...props}
            android_ripple={{ 
              color: '#ffffff20',
              borderless: false,
              radius: 28,
            }}
            style={({ pressed }) => [
              styles.tabButton,
              pressed && styles.tabButtonPressed,
              props.style
            ]}
          />
        ),
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name={focused ? "home" : "home"} 
              size={26} 
              color={color} 
              style={styles.icon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name={focused ? "video-library" : "video-library"} 
              size={26} 
              color={color} 
              style={styles.icon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name={focused ? "settings" : "settings"} 
              size={26} 
              color={color} 
              style={styles.icon}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#2f2f2f',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonPressed: {
    opacity: 0.8,
  },
  icon: {
    marginBottom: 4,
  }
});

export default MainTabNavigator; 