import React, { useContext, useState, useEffect } from "react";
import { NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme
} from "@react-navigation/native";
import { Provider as PaperProvider,
    DarkTheme as PaperDarkTheme,
    DefaultTheme as PaperDefaultTheme
} from 'react-native-paper';

import auth from '@react-native-firebase/auth'
import { AuthContext } from './AuthProvider';
import { ActionsContext } from "../userContext/Actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppTabs from "./AppTabs";
import AuthStack from "./AuthStack";

const Routes = () =>{
    
    const {user, setUser } = useContext(AuthContext);
    const { isDarkTheme, setIsDarkTheme } = useContext(ActionsContext);
    const [initializing, setInitializing] = useState(true);
    
    const CustomDefaultTheme = {
        ...NavigationDefaultTheme,
        ...PaperDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            ...PaperDefaultTheme.colors,
            background: '#ffffff',
            text: '#333333',
            //card: 'rgb(242, 101, 34)'
            //rgb(28, 117, 188)
        }
    }

    const CustomDarkTheme = {
        ...NavigationDarkTheme,
        ...PaperDarkTheme,
        colors: {
            ...NavigationDarkTheme.colors,
            ...PaperDarkTheme.colors,
            background: '#333333',
            text:'#ffffff'
        }
    }

    const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

    const onAuthStateChanged = (user) => {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    

    useEffect(async () =>{
        await AsyncStorage.getItem('isDarkTheme').then(value => {
            if (value == 'true') {   
                setIsDarkTheme(true);
            }
        });
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    

    if (initializing) return null;

    return(
        <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
                {user ? <AppTabs/> : <AuthStack/>}
            </NavigationContainer>
        </PaperProvider>
    )
};

export default Routes;