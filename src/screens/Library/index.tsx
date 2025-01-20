import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FavoriteTab from './tabs/FavoriteTab';
import HistoryTab from './tabs/HistoryTab';
import DownloadTab from './tabs/DownloadTab';

const Tab = createMaterialTopTabNavigator();

const Library = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#2196F3',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'QuicksandSemiBold',
          textTransform: 'none',
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#888888',
      }}
    >
      <Tab.Screen 
        name="Favorite" 
        component={FavoriteTab}
        options={{ tabBarLabel: 'Favorit' }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryTab}
        options={{ tabBarLabel: 'Riwayat' }}
      />
      <Tab.Screen 
        name="Download" 
        component={DownloadTab}
        options={{ tabBarLabel: 'Unduhan' }}
      />
    </Tab.Navigator>
  );
};

export default Library;