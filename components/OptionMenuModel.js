import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { TouchableRipple, Text, useTheme } from 'react-native-paper';

const OptionMenuModel = ({navigation, screen, text, onRipplePress, image, imageStyles, ...props}) => {
  console.log("Menu text:", text)
  const darkTheme = useTheme().dark
    return (
        <TouchableRipple onPress={() => {
          if (screen) {
            navigation.navigate(screen)
          } else {
            onRipplePress()
          }
        }}
            >
            <View style={[styles.preferencesItems, {paddingLeft: !image ? 10 :0,...props}]}>
              {image ? <Image source={image} style={[styles.imageLabel, {...imageStyles}, {tintColor: darkTheme ? "#cccccc" : "#111111"}]}/> : null}
              <Text style={styles.preferencesText}>
                          {text}
              </Text>
            </View>
        </TouchableRipple>
    )
}

export default OptionMenuModel;

const styles= StyleSheet.create({
    preferencesItems:{
        flexDirection:'row',
        height:50,
        borderColor:'#888',
        borderBottomWidth:0.5,
        alignItems:'center'
      },
      preferencesText:{
        fontSize:18
      },
      imageLabel:{
        height:30,
        width:30,
        marginRight:7,
        marginLeft:3
      }
})