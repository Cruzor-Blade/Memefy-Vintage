import React, { useContext, useState } from "react";

import {View, StyleSheet, Linking} from 'react-native';
import FormButton from "../../components/FormButton";
import { Avatar, Text, useTheme } from 'react-native-paper';
import { LanguageContext } from "../../languages/languageContext";

import OptionMenuModel from "../../components/OptionMenuModel";
import AgreementsView from "../../components/AgreementsView";

const About = () =>{
    const {aboutScreen} = useContext(LanguageContext);
    
    const [termsType, setTermsType] = useState('')
    const [termsVisible, setTermsVisible] = useState(false);

    const contact = "+237669818830"
    const message = aboutScreen.message
    return (
        <>
            <OptionMenuModel
                text={aboutScreen.privacyPolicy}
                onRipplePress={() => {
                    setTermsVisible(true)
                    setTermsType('privacypolicy')
                }}
            />
            <OptionMenuModel
                text={aboutScreen.termsOfUse}
                onRipplePress={() => {
                    setTermsVisible(true)
                    setTermsType('termsofuse')
                }}
            />
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
            { termsType ?
                <AgreementsView
                    type={termsType}
                    visible={termsVisible}
                    onClosePress={() => {
                        setTermsType('');
                        setTermsVisible(false);
                    }}
                    />
                :null
            }
        </>
    )
}



export default About;

const styles= StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
    },
    textContainer:{
        flex:1,
        maxWidth:'98%',
        paddingHorizontal:15,
        paddingVertical:20,
        marginBottom: 20,
        borderRadius: 10,
        marginTop:10
    },
    textDesc: {
        fontSize:18
    }
})
