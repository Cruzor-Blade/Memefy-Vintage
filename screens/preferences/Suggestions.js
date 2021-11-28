import React from "react";

import {View, StyleSheet, Linking} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import FormButton from "../../components/FormButton";


const Suggestions = () =>{
    const message= "Salut a vous la team. J'ecris a propos votre application MemeBit ou j'aimerai apporter quelques suggestions coordialement."

    return(
            <View style={[styles.textContainer, {backgroundColor: useTheme().dark ? '#555' :'#f8f8f8'}]}>
                <Text style={styles.textDesc}>
                    Parceque nous savons que notre app n'est pas parfaite, mais que nous souhaitons l'améliorer.
                </Text>
                <Text style={styles.textDesc}>
                    Merci de nous envoyer une suggestion par email en cliquant sur le bouton ci dessous.
                </Text>

                <FormButton
                    buttonTitle="       Envoyer une suggestion      "
                    onPress = {() => Linking.openURL(`mailto:cruzorbladex@gmail.com?subject=Suggerer une modification&body=${message}`)}
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
        fontSize:16
    }
})