import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';

import { ClientsProvider } from './contexts/ClientsContext';
import { DataProvider } from './contexts/DataContext';

import HomeScreen from './screens/HomeScreen';
import ClientsScreen from './screens/ClientsScreen';
import ReportsScreen from './screens/ReportsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ClientsProvider>
        <DataProvider>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: true,
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName: any;

                  if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline';
                  } else if (route.name === 'Clients') {
                    iconName = focused ? 'people' : 'people-outline';
                  } else if (route.name === 'Reports') {
                    iconName = focused ? 'document' : 'document-outline';
                  } else if (route.name === 'Settings') {
                    iconName = focused ? 'settings' : 'settings-outline';
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#1e3a8a',
                tabBarInactiveTintColor: '#888',
                tabBarStyle: {
                  backgroundColor: '#fff',
                  borderTopColor: '#f0f2f7',
                },
                headerStyle: {
                  backgroundColor: '#fff',
                  borderBottomColor: '#f0f2f7',
                  borderBottomWidth: 1,
                },
                headerTintColor: '#1e3a8a',
                headerTitleStyle: {
                  fontWeight: '600',
                },
              })}
            >
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Anielski Styl' }}
              />
              <Tab.Screen
                name="Clients"
                component={ClientsScreen}
                options={{ title: 'Klientki' }}
              />
              <Tab.Screen
                name="Reports"
                component={ReportsScreen}
                options={{ title: 'Raporty' }}
              />
              <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Ustawienia' }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </DataProvider>
      </ClientsProvider>
    </SafeAreaProvider>
  );
}