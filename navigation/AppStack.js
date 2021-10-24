import React,  { useContext} from "react";
import { Text, View } from 'react-native';

import FormButton from "../components/FormButton";
import { AuthContext } from "./AuthProvider";

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
}

export default AppStack;