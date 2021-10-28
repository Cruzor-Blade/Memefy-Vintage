import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";


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
            <TouchableOpacity onPress={() =>
              navigation.navigate("ThemeScreen")
          }>

            <View style={styles.PreferencesItems}>
              <Text style={styles.preferencesText}>
                          Apparence et personlisation
              </Text>
            </View>
          </TouchableOpacity>
          <OptionMenuModel
            screen="Suggestions"
            text="Boite a suggestions"
          />
          <TouchableOpacity onPress={() => navigation.navigate("Donate")} >
            <View style={styles.PreferencesItems}>
              <Text style={styles.preferencesText}>
                          Nous soutenir
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("About")} >
            <View style={styles.PreferencesItems}>
              <Text style={styles.preferencesText}>
                          A propos
              </Text>
            </View>
          </TouchableOpacity>
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