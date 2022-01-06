import React, { useContext } from "react";

import {View, StyleSheet, Linking} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import FormButton from "../../components/FormButton";
import { LanguageContext } from "../../languages/languageContext";


const Suggestions = () =>{
    const {suggestionsScreen} = useContext(LanguageContext);
    const message= suggestionsScreen.message

    return(
            <View style={[styles.textContainer, {backgroundColor: useTheme().dark ? '#555' :'#f8f8f8'}]}>
                <Text style={styles.textDesc}>
                   {suggestionsScreen.introduction}
                </Text>
                <Text style={styles.textDesc}>
                    {suggestionsScreen.contact}
                </Text>

                <FormButton
                    buttonTitle={suggestionsScreen.suggestButtonLabel}
                    onPress = {() => Linking.openURL(`mailto:contactmemefy@gmail.com?subject=Suggerer une modification&body=${message}`)}
                />

            </View>

    )
}


export default Suggestions;

const styles= StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },
    textContainer:{
        flex:1,
        maxWidth:'98%',
        paddingHorizontal:15,
        paddingVertical:20,
        marginBottom: 20,
        borderRadius: 10,
    },
    textDesc: {
        fontSize:18
    }
})