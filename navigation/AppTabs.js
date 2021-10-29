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
import About from '../screens/preferences/About';
import Donate from '../screens/preferences/Donate';
import Suggestions from '../screens/preferences/Suggestions';
import CommentsScreen from '../screens/CommentsScreen';
import PostViewScreen from '../screens/PostViewScreen';


const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const AppTabs = () => {
  const getTabBarVisibility = (route) => {
    tabBarHiddenRoutes=['EditProfileScreen', 'Preferences'] ;
    routeName = route.state ? route.state.routes[route.state.index].name 
    : '';
    if (tabBarHiddenRoutes.includes(routeName)) {
      return false;
    } else {
      return true;
    }
  }

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
        component={FindStack}
        options={{
          tabBarLabel: 'Rechercher',
          tabBarIcon: () => (<Image style={styles.bottomIcons} source={require("../assets/maintab/search.png")} />)
        }}
        />

      <Tab.Screen
        name='Home'
        component={HomeStack}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: () => (<Image style={styles.bottomIcons} source={require("../assets/maintab/home.png")} />)
        }}
        />

      <Tab.Screen
        name='Profile'
        component={ProfileStack}
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: 'Profil',
          tabBarIcon: () => (<Image style={styles.bottomIcons} source={require("../assets/maintab/profile.png")} />)
        })}
        />
      <Tab.Screen
        name='Preferences'
        component={PreferencesStack}
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


const FindStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="FindScreen">
      <Stack.Screen
        name="FindScreen"
        component={FindScreen}
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
        name="FindProfile"
        component={ProfileScreen}
        options={{
          headerLeft: () => (
            <Feather.Button
            name="arrow-left"
            onPress={() => navigation.navigate('FindScreen')}
            backgroundColor="#fff"
            color="#333"
            />
          )
        }}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
      />
    </Stack.Navigator>
  )
}

const HomeStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="CommentsScreen"
        component={CommentsScreen}
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
        name="PostViewScreen"
        component={PostViewScreen}
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


const PreferencesStack = ({navigation, route}) => {

  return (
    <Stack.Navigator initialRouteName="PreferencesScreen">
      <Stack.Screen
        name="PreferencesScreen"
        component={PreferencesScreen}
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
        name="Suggestions"
        
        component={Suggestions}
        options={{
          headerLeft: () => (
            <Feather.Button
            name="arrow-left"
            onPress={() => navigation.navigate('PreferencesScreen')}
            backgroundColor="#fff"
            color="#333"
            />
          )
        }}
      />
      <Stack.Screen
        name="Donate"
        
        component={Donate}
        options={{
          headerLeft: () => (
            <Feather.Button
            name="arrow-left"
            onPress={() => navigation.navigate('PreferencesScreen')}
            backgroundColor="#fff"
            color="#333"
            />
          )
        }}
      />
      <Stack.Screen
        name="About"
        
        component={About}
        options={{
          headerLeft: () => (
            <Feather.Button
            name="arrow-left"
            onPress={() => navigation.navigate('PreferencesScreen')}
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