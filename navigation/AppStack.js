import React,  { useContext} from "react";
import { Text, View } from 'react-native';

import FormButton from "../components/FormButton";
import { AuthContext } from "./AuthProvider";
import { createStackNavigator} from '@react-navigation/stack'

import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from "../screens/EditProfileScreen";

const Stack = createStackNavigator();

const AppStack = () =>{
    const {user, logout} = useContext(AuthContext)
    return(
        <View>
            <Text style={{alignSelf:'center'}}>
            Welcome {user.uid}
            </Text>
            <FormButton
            buttonTitle="Se deconnecter"
            onPress={() => logout()}
            />
        </View> 
    )
};



export default AppStack;