import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import PostScreen from '../screens/PostScreen';
import FindScreen from '../screens/FindScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PreferencesScreen from '../screens/PreferencesScreen';

const Tab = createMaterialBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
    initialRouteName="Home"
    activeColor="#ccc"
    >

      <Tab.Screen
        name='Post'
        component={HomeScreen}
        options={{
          tabBarLabel: 'Publier',
          tabBarIcon: () => (<Image style={styles.bottomIcons} source={require("../assets/maintab/plus.png")} />)
        }}
        />

      <Tab.Screen
        name='Find'
        component={HomeScreen}
        options={{
          tabBarLabel: 'Rechercher',
          tabBarIcon: () => (<Image style={styles.bottomIcons} source={require("../assets/maintab/search.png")} />)
        }}
        />

      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: () => (<Image style={styles.bottomIcons} source={require("../assets/maintab/home.png")} />)
        }}
        />

      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: () => (<Image style={styles.bottomIcons} source={require("../assets/maintab/profile.png")} />)
        }}
        />
      <Tab.Screen
        name='Preferences'
        component={HomeScreen}
        options={{
          tabBarLabel: 'Preferences',
          tabBarIcon: () => (<Image style={styles.bottomIcons} source={require("../assets/maintab/settings.png")} />)
        }}
        />

    </Tab.Navigator>
  );
}

export default AppTabs;

const styles = StyleSheet.create({
  bottomIcons:{
    height:26,
    width:26
  }
})