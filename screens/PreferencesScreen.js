import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from 'react-native-paper';

const Preferences = ({navigation}) =>{
    const OptionMenuModel = ({screen, text, ...props}) => (
      <TouchableOpacity onPress={() =>
        navigation.navigate(screen)}
        style={{...props}}
        >
        <View style={styles.PreferencesItems}>
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
              text="Apparence et personalisation"
            />
          <OptionMenuModel
            screen="Suggestions"
            text="Boite a suggestions"
          />
          <OptionMenuModel
            screen="About"
            text="A propos"
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
      marginTop:10,
      height:30,
      borderColor:'#888',
      borderBottomWidth:0.5,
      borderStyle: 'solid'
    },
    preferencesText:{
      fontSize:18
    }
  });