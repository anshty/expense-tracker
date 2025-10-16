import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home_Screen from '../screens/Home_Screen'; // adjust path if needed
import AddBalance_Screen from '@/components/AddBalance_Screen'
import AddExpence_Screen from '@/components/AddExpence_Screen'
const Stack = createNativeStackNavigator();

export default function Navigation_stack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Home" component={Home_Screen} />
        <Stack.Screen name="Balance" component={AddBalance_Screen}/>
        <Stack.Screen name="Expence" component={AddExpence_Screen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
