import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';
import Login from './pages/Login';
import Main from './pages/Main';

const Stack = createStackNavigator();

export default function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          options={{
            headerShown: false,
          }}
          component={Login}
        />
        <Stack.Screen
          name="Main"
          options={{headerShown: false}}
          component={Main}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
