import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

import PostScreen from '../screens/PostScreen';
import FindScreen from '../screens/FindScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PreferencesScreen from '../screens/PreferencesScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
    initialRouteName="Home"
    activeColor="#ccc"
    >

      <Tab.Screen
        name='Post'
        component={PostStack}
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
        component={ProfileStack}
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

const PostStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="PostScreen">
      <Stack.Screen
        name="PostScreen"
        component={PostScreen}
        options={{
          headerLeft: () => (
            <Feather.Button
            name="arrow-left"
            onPress={() => navigation.navigate('Home')}
            backgroundColor="#fff"
            color="#333"
            />
          )
        }}
      />
    </Stack.Navigator>
  )
}

const ProfileStack = ({navigation, route}) => {
  const tabHiddenRoutes = ["EditProfileScreen"];

  if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
    navigation.setOptions ({tabBarVisible: false});
  } else {
    navigation.setOptions({tabBarVisible:true})
  }

  return (
    <Stack.Navigator initialRouteName="ProfileScreen">
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerLeft: () => (
            <Feather.Button
            name="arrow-left"
            onPress={() => navigation.navigate('Home')}
            backgroundColor="#fff"
            color="#333"
            />
          )
        }}
      />
      <Stack.Screen
        name="EditProfileScreen"
        
        component={EditProfileScreen}
        options={{
          headerLeft: () => (
            <Feather.Button
            name="arrow-left"
            onPress={() => navigation.navigate('ProfileScreen')}
            backgroundColor="#fff"
            color="#333"
            />
          )
        }}
      />
    </Stack.Navigator>
  )
}

export default AppTabs;

const styles = StyleSheet.create({
  bottomIcons:{
    height:26,
    width:26
  }
})