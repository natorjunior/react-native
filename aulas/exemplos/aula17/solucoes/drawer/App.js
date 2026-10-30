import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import InicioScreen from './InicioScreen';
import BibliotecaScreen from './BibliotecaScreen';
import ContatoScreen from './ContatoScreen';
const Drawer = createDrawerNavigator();
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator screenOptions={{ headerShown: true }}>
          <Drawer.Screen name="Início" component={InicioScreen} />
          <Drawer.Screen name="Biblioteca" component={BibliotecaScreen} />
          <Drawer.Screen name="Contato" component={ContatoScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
