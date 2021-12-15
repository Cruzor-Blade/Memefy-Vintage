import React, { useContext } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { LanguageContext } from "../languages/languageContext";
import OptionMenuModel from "../components/OptionMenuModel";

const Preferences = ({navigation}) =>{
  const {preferencesScreen} = useContext(LanguageContext);
    // const OptionMenuModel = ({screen, text, ...props}) => (
    //   <TouchableOpacity onPress={() =>
    //     navigation.navigate(screen)}
    //     >
    //     <View style={[styles.PreferencesItems, {...props}]}>
    //       <Text style={styles.preferencesText}>
    //                   {text}
    //       </Text>
    //     </View>
    // </TouchableOpacity>
    // )

    return(
        <View style={{marginTop:10}}>
            <OptionMenuModel
              navigation={navigation}
              screen="Appearance"
              style={{marginTop:30}}
              text={preferencesScreen.appearanceLabel}
            />
          <OptionMenuModel
            navigation={navigation}
            screen="Suggestions"
            text={preferencesScreen.suggestionsLabel}
          />
          <OptionMenuModel
            navigation={navigation}
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