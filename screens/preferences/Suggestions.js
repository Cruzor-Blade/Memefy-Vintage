import React from "react";

import {View, StyleSheet, Linking} from 'react-native';
import { Text } from 'react-native-paper';
import FormButton from "../../components/FormButton";


const Suggestions = () =>{
    const message= "Salut a vous la team. J'ecris a propos votre application MemeBit ou j'aimerai apporter quelques suggestions coordialement."

    return(
            <View style={styles.textContainer}>
                <Text style={styles.textDesc}>
                    Parceque nous savons que notre app n'est pas parfaite, mais que nous souhaitons l'ameliorer.
                </Text>
                <Text style={styles.textDesc}>
                    Entrez votre suggestion dans la zone de texte ci dessous.
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
        backgroundColor: '#f8f8f8',
        marginBottom: 20,
        borderRadius: 10,
    },
    textDesc: {
        fontSize:16
    }
})