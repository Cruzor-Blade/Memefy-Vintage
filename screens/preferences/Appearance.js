import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View} from 'react-native';
import { TouchableRipple, Switch, useTheme, Text} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

import { ActionsContext } from '../../userContext/Actions';
import { Divider } from '../../styles/FeedStyles';
import { LanguageContext } from '../../languages/languageContext';

const Appearance = () => {
    const { toggleTheme } = useContext(ActionsContext);
    const {appearanceScreen, switchLanguage, selectedLanguage} = useContext(LanguageContext);
    const currentTheme = useTheme();

    return (
            <View style={styles.container}>
                <TouchableRipple onPress={() => toggleTheme()}>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:15}}>
                        <Text style={{fontSize:16}}>{appearanceScreen.darkThemeRipple}</Text>
                        <View pointerEvents="none">
                            <Switch value={currentTheme.dark}/>
                        </View>
                    </View>
                </TouchableRipple>
                <Divider style={{marginTop:0}} />
                <Picker
                    style={{color:currentTheme.dark? "#dddddd" : "#333333"}}
                    selectedValue={selectedLanguage}
                    prompt={appearanceScreen.changeLanguageModalTitle}
                    onValueChange={(itemValue, itemIndex) => switchLanguage(itemValue)}
                    >
                    <Picker.Item label="Français" value="fr" />
                    <Picker.Item label="English" value="en" />
                </Picker>
                <Divider style={{marginTop:0}} />
            </View>
    )
}

export default Appearance;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    modalView: {
        height:250,
        backgroundColor:'#fff',
        marginVertical:20,
        borderRadius:7,
        padding:10,
        width:'90%',
        alignSelf:'center',
        justifyContent:'space-between',
        paddingBottom:0
    },
    pickerContainer: {
        height:200,
        width:'10%',
    },
    modalHeader: {
        height:35,
        width:'100%',
        alignItems:'center',
        justifyContent:'center'
    },
    modalTitle : {
        fontSize:18
    },
    modalBottom: {
        height:45,
        width:'100%',
        alignItems:'center',
        justifyContent:'space-around',
        flexDirection:'row',
        borderBottomLeftRadius:9,
        borderBottomRightRadius:9,
    },
    endModal: {
        borderColor:"#cccccc",
        borderWidth:1,
        flex:1,
        height:35,
        alignItems:'center',
        justifyContent:'center',
        fontSize:18,
        marginHorizontal:5
    }
})