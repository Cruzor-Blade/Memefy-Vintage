import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableRipple, Text } from 'react-native-paper';

const OptionMenuModel = ({screen, text, navigation, ...props}) => {
  console.log("Menu text:", text)
    return (
        <TouchableRipple onPress={() =>
            navigation.navigate(screen)}
            >
            <View style={[styles.preferencesItems, {...props}]}>
              <Text style={styles.preferencesText}>
                          {text ||''}
              </Text>
            </View>
        </TouchableRipple>
    )
}

export default OptionMenuModel;

const styles= StyleSheet.create({
    preferencesItems:{
        margin:20,
        marginTop:25,
        marginBottom:0,
        height:30,
        borderColor:'#888',
        borderBottomWidth:0.5,
      },
      preferencesText:{
        fontSize:18
      }
})