import React, { useEffect, useState, useContext } from 'react';
import { Modal,} from 'react-native-paper';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { windowHeight } from '../utils/Dimentions';

import { LanguageContext } from '../languages/languageContext';

import Antdesign from 'react-native-vector-icons/AntDesign';


const AgreementsView = ({type, visible, onClosePress, ...props}) => {
    const {agreementsView, selectedLanguage} = useContext(LanguageContext);
    const [agreement, setAgreement] = useState('');

    console.log("type: ", type)
    const languagesAgreements = {
        privacypolicy:{
          fr:'https://cruzor-blade.github.io/memebit/fr/privacypolicy.txt',
          en:'https://cruzor-blade.github.io/memebit/en/privacypolicy.txt',
        },
        termsofuse:{
          fr:'https://cruzor-blade.github.io/memebit/fr/termsofuse.txt',
          en:'https://cruzor-blade.github.io/memebit/en/termsofuse.txt',
        }
      }

      const headerTitle = {
          privacypolicy:{
            fr:"Politique de Confidentialté de MemeBit",
            en:"MemeBit Privacy Policy"
          },
          termsofuse:{
            fr:"Termes d'Utilisation de MemeBit",
            en:"MemeBit Terms of Use"
          }
      }

    const fetchAgreements = () => {
        console.log("Txt Url: ", languagesAgreements[type] [selectedLanguage])
        fetch(languagesAgreements[type] [selectedLanguage])
        .then(text => text.text())
        .then(terms => {
            setAgreement(terms);
        })
        }

        useEffect(() => {
            fetchAgreements();
        }, [])

    return (
        <Modal visible={visible} style={styles.overlay}>
            <View style={styles.textContainer}>
                <View style={styles.header}>
                    <Text style={{fontSize:18, fontWeight:'bold'}}>{headerTitle[type] [selectedLanguage]}</Text>
                    <Antdesign
                        name="closecircle"
                        color="#666666"
                        size={24}
                        style={{marginBottom:2}}
                        onPress={onClosePress}
                    />
                </View>
                <ScrollView>
                    <Text style={{fontSize:16}}>{agreement || agreementsView.loading} </Text>
                </ScrollView>
                </View>
        </Modal>
    )
}

export default AgreementsView;

const styles = StyleSheet.create({
    overlay:{
        flex:1,
    },
    textContainer:{
        marginHorizontal:8,
        height:windowHeight*4/5,
        backgroundColor:"#ffffff",
        marginBottom:20,
        borderRadius:10,
        padding:10,
        paddingHorizontal:10
    },
    header:{
        borderRadius:10,
        borderBottomColor:"#444444",
        borderBottomWidth:1,
        height:42,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row',
        paddingLeft:25,
        paddingRight:10
    }

})