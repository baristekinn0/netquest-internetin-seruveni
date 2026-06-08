import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigationState } from '@react-navigation/native';
import { RootStackParamList, TabParamList, ModulesStackParamList } from '../types';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ModuleScreen from '../screens/ModuleScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultScreen from '../screens/ResultScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';

const RootStack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const ModulesStack = createStackNavigator<ModulesStackParamList>();

function ModulesNavigator() {
  return (
    <ModulesStack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#0F0C29' } }}>
      <ModulesStack.Screen name="Home" component={HomeScreen} />
      <ModulesStack.Screen name="Module" component={ModuleScreen} />
      <ModulesStack.Screen name="Quiz" component={QuizScreen} />
      <ModulesStack.Screen name="Result" component={ResultScreen} />
    </ModulesStack.Navigator>
  );
}

function useIsTabBarHidden() {
  const state = useNavigationState((s) => s);
  if (!state) return false;
  // ModulesTab stack'inin içindeki aktif route'u bul
  const tabRoute = state.routes.find((r) => r.name === 'Main');
  if (!tabRoute || !tabRoute.state) return false;
  const tabState = tabRoute.state;
  const activeTab = tabState.routes[tabState.index ?? 0];
  if (activeTab?.name !== 'ModulesTab') return false;
  if (!activeTab.state) return false;
  const modulesState = activeTab.state;
  const activeModuleRoute = modulesState.routes[modulesState.index ?? 0];
  return ['Module', 'Quiz', 'Result'].includes(activeModuleRoute?.name as string);
}

function MainTabs() {
  const hideTabBar = useIsTabBarHidden();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: hideTabBar
          ? { display: 'none' }
          : {
              backgroundColor: '#1a1740',
              borderTopColor: 'rgba(255,255,255,0.08)',
              borderTopWidth: 1,
              paddingBottom: 8,
              paddingTop: 8,
              height: 64,
            },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginTop: 2 },
      }}
    >
      <Tab.Screen
        name="ModulesTab"
        component={ModulesNavigator}
        options={{
          tabBarLabel: 'Modüller',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🎓</Text>,
        }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressScreen}
        options={{
          tabBarLabel: 'İlerleme',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#0F0C29' } }}>
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Main" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
