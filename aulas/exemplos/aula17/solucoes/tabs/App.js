import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InicioScreen from './InicioScreen';
import AvisosScreen from './AvisosScreen';
import PerfilScreen from './PerfilScreen';
const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#087e72' }}>
        <Tab.Screen name="Início" component={InicioScreen} />
        <Tab.Screen name="Avisos" component={AvisosScreen} />
        <Tab.Screen name="Perfil" component={PerfilScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
