import React, { useContext } from "react";

import {View, StyleSheet, Linking} from 'react-native';
import FormButton from "../../components/FormButton";
import { Text, useTheme } from 'react-native-paper';
import { LanguageContext } from "../../languages/languageContext";


const About = () =>{
    const {aboutScreen} = useContext(LanguageContext);
    const contact = "+237651516229"
    const message = aboutScreen.message
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
                    {aboutScreen.introduction}
                </Text>
                <Text style={styles.textDesc}>
                    {aboutScreen.conviction}
                </Text>
                <Text style={styles.textDesc}>
                    {aboutScreen.contact}
                </Text>
                <FormButton
                    buttonTitle={aboutScreen.whatsAppButtonLabel}
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
        fontSize:18
    }
})
