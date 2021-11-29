import React, { useContext } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from 'react-native-paper';
import { LanguageContext } from "../languages/languageContext";

const Preferences = ({navigation}) =>{
  const {preferencesScreen} = useContext(LanguageContext);
    const OptionMenuModel = ({screen, text, ...props}) => (
      <TouchableOpacity onPress={() =>
        navigation.navigate(screen)}
        >
        <View style={[styles.PreferencesItems, {...props}]}>
          <Text style={styles.preferencesText}>
                      {text}
          </Text>
        </View>
    </TouchableOpacity>
    )

    return(
        <View style={{marginTop:10}}>
            <OptionMenuModel
              screen="Appearance"
              style={{marginTop:30}}
              text={preferencesScreen.appearanceLabel}
            />
          <OptionMenuModel
            screen="Suggestions"
            text={preferencesScreen.suggestionsLabel}
          />
          <OptionMenuModel
            screen="About"
            text={preferencesScreen.aboutLabel}
          />
        </View>
    )
}


export default Preferences;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
    },
 
    PreferencesItems:{
      margin:20,
      marginTop:25,
      marginBottom:0,
      height:30,
      borderColor:'#888',
      borderBottomWidth:0.5,
      borderStyle: 'solid'
    },
    preferencesText:{
      fontSize:18
    }
  });