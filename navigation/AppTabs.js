import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from 'react-native-paper';

import PostScreen from '../screens/PostScreen';
import FindScreen from '../screens/FindScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PreferencesScreen from '../screens/PreferencesScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import About from '../screens/preferences/About';
import Appearance from '../screens/preferences/Appearance';
import Donate from '../screens/preferences/Donate';
import Suggestions from '../screens/preferences/Suggestions';
import CommentsScreen from '../screens/CommentsScreen';
import PostViewScreen from '../screens/PostViewScreen';


const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const AppTabs = () => {
  const currentTheme= useTheme();
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

  const tabBarIconColor = (focused) =>{
    if (focused && currentTheme.dark) return "#fcfcfc";
    else if (focused && !currentTheme.dark) return "#ffffff";
    else if (!focused && currentTheme.dark) return "#666666";
    else if (!focused && !currentTheme.dark) return "#333333";
  }
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#ccc"
      backBehavior='initialRoute'
      screenOptions={{
        style : {
          height:200
        },
        tabBarColor: currentTheme.dark ? '#121212' : 'rgb(242, 101, 34)',
      }}
      >

      <Tab.Screen
        name='Post'
        component={PostStack}
        options={{
          tabBarLabel: 'Publier',
          tabBarIcon: ({focused}) => (
            <Image
              style={{tintColor: tabBarIconColor(focused) ,...styles.bottomIcons}}
              source={require("../assets/maintab/plus.png")}
              resizeMode='contain'
            />
          )
        }}
        />

      <Tab.Screen
        name='Find'
        component={FindStack}
        options={{
          tabBarLabel: 'Rechercher',
          tabBarIcon: ({focused}) => (
          <Image
            style={{tintColor: tabBarIconColor(focused) ,...styles.bottomIcons}}
            source={require("../assets/maintab/search.png")}
            resizeMode='contain'
            />)
        }}
        />

      <Tab.Screen
        name='Home'
        component={HomeStack}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({focused}) => (
          <Image
            style={{tintColor:  tabBarIconColor(focused) ,...styles.bottomIcons}}
            source={require("../assets/maintab/home.png")}
            resizeMode='contain'
            />)
        }}
        />

      <Tab.Screen
        name='Profile'
        component={ProfileStack}
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: 'Profil',
          tabBarIcon: ({focused}) => (
            <Image
              style={{tintColor:  tabBarIconColor(focused) ,...styles.bottomIcons}}
              source={require("../assets/maintab/profile.png")}
              resizeMode='contain'
            />
          )
        })}
        />
      <Tab.Screen
        name='Preferences'
        component={PreferencesStack}
        options={{
          tabBarLabel: 'Preferences',
          tabBarIcon: ({focused}) => (
          <Image
            style={{tintColor: tabBarIconColor(focused) ,...styles.bottomIcons}}
            source={require("../assets/maintab/settings.png")}
            resizeMode='contain'
            />
          )
        }}
        />

    </Tab.Navigator>
  );
}

const PostStack = ({navigation}) => {
  const currentTheme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="PostScreen"
      screenOptions={{
        style: {
          height: 100,
          elevation:2
        },
        headerTintColor: currentTheme.dark ? '#121212' : '#ffffff'
      }}
    >
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
          ),
          title:'Partager un meme'
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
          ),
          title:'Rechercher...'
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
          ),
          title:'Utilisateur'
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
        options={{
          headerLeft : () => (
            <Image
              source={require('../assets/maintab/memebit.png')}
              style={{width:120, height:33, marginLeft:20, marginTop:7}}
            />
          ),
          title:'',
          headerStyle: {
            elevation:0
          }
        }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title:'Votre profil',
          headerStyle:{
            elevation:0
          }
        }}
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
          ),
          title:'Commentaires'
        }}
      />
      <Stack.Screen
        name="PostViewScreen"
        component={PostViewScreen}
        options={{
          headerShown: false,
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
          ),
          title:'Votre profil',
          headerStyle:{
            elevation:0.5
          }
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
          ),
          title:'Éditer votre profil',
          headerStyle:{
            elevation:0.5
          }
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
          ),
          title:'Préferences',
          headerStyle:{
            elevation:0.5
          }
        }}
      />
      <Stack.Screen
        name="Appearance"
        
        component={Appearance}
        options={{
          headerLeft: () => (
            <Feather.Button
            name="arrow-left"
            onPress={() => navigation.navigate('PreferencesScreen')}
            backgroundColor="#fff"
            color="#333"
            />
          ),
          title:'Apparence',
          headerStyle:{
            elevation:0.5
          }
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
            color="#222"
            />
          ),
          title:'Suggestions',
          headerStyle:{
            elevation:0.5
          }
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
          ),
          title:'À propos de nous',
          headerStyle:{
            elevation:0.5
          }
        }}
      />
    </Stack.Navigator>
  )
}


export default AppTabs;

const styles = StyleSheet.create({
  bottomIcons:{
    height:26,
    width:26,
    marginBottom:3,
  }
})