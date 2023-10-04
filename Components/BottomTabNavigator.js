import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import NavigateScreen from '../Screens/NavigateScreen';
import SearchScreen from '../Screens/SearchScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default class BottomTabNavigator extends Component {
  render () {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'Search') {
                iconName = focused
                  ? 'book'
                  : 'book-outline';
              } else if (route.name === 'Navigate') {
                iconName = focused ? 'search' : 'search-outline';
              }
  
              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "blue",
            tabBarInactiveTintColor: "grey"
          })}
        >
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="Navigate" component={NavigateScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}