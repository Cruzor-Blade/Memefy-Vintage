import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const AuthStack= ({navigation}) =>{
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);
    let routeName;

    useEffect(() => {
        AsyncStorage.getItem('alreadyLaunched').then((value) =>{
            if ( value === null ) {
                AsyncStorage.setItem('alreadyLaunched', 'true');
                setIsFirstLaunch(true)
            } else {
                setIsFirstLaunch(false)
            }
        } );
    }, []);

    if ( isFirstLaunch===null) {
        return null;
    } else if ( isFirstLaunch===true){
        routeName= 'Onboarding';
    } else {
        routeName= 'Login';
    }


    return(
        <Stack.Navigator initialRouteName={routeName}>
            <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{header:() => null}}
            />
            <Stack.Screen
                name='Login'
                component={LoginScreen}
                options={{header:() => null}}
            />
            <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{
                    title:'',
                    headerStyle:{
                        backgroundColor:"#f9fafd",
                        elevation:0
                    }
                }}
                />
        </Stack.Navigator>
        )

}

export default AuthStack;