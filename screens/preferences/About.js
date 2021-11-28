import React from "react";

import {View, StyleSheet, Linking} from 'react-native';
import FormButton from "../../components/FormButton";
import { Text, useTheme } from 'react-native-paper';


const About = () =>{
    const contact = "+237651516229"
    const message = "Salut la team. Je vous contacte à propos de votre application MemeBit et J'aimerai en apprendre un peu plus sur vous :)"
    return (
        // <View style={styles.container}>
        //     <View>
        //         <Text>
        //             Nous sommes un groupe de developpeurs :)
        //         </Text>
        //     </View>
        //     <View>
        //         <Text>
        //                 Nous concevons pour vous des sites web, applications web et mobiles.
        //         </Text>
        //     </View>
        //     <View>
        //             <Text>
        //                 Nous aimons ce que nous faisons, et c'est pourquoi nous le faisons encore mieux. Faites nous confiance, pour toujours etre satisfait
        //             </Text>
        //     </View>
        // </View>
        <View style={[styles.textContainer, {backgroundColor: useTheme().dark ? '#555' : '#f8f8f8'}]}>
                <Text style={styles.textDesc}>
                Nous sommes un groupe de developpeurs :)
                </Text>
                <Text style={styles.textDesc}>
                Nous aimons ce que nous faisons, et c'est pourquoi nous le faisons encore mieux. Contactez nous sur notre numero WhatsApp en pressant le bouton ci dessous
                </Text>

                <FormButton
                    buttonTitle="       Ecrire sur Whatsapp      "
                    onPress = {() => Linking.openURL(`whatsapp://send?phone=${contact}&text=${message}`)}
                />

        </View>
    )
}



export default About;

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
