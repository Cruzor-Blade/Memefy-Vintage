import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { TouchableRipple, Text, useTheme } from 'react-native-paper';

const OptionMenuModel = ({navigation, screen, text, onRipplePress, imageRequire, ImageComp, imageStyles, ...props}) => {
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
            <View style={[styles.preferencesItems, {paddingLeft: !imageRequire || ImageComp ? 10 :0,...props}]}>
              {imageRequire ? <Image source={imageRequire} style={[styles.imageLabel, {...imageStyles}, {tintColor: darkTheme ? "#cccccc" : "#111111"}]}/> : null}
              {ImageComp ? <ImageComp/> : null}
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
        height:55,
        borderColor:'#888',
        borderBottomWidth:0.5,
        alignItems:'center'
      },
      preferencesText:{
        fontSize:18,
        marginLeft:7,
      },
      imageLabel:{
        height:30,
        width:30,
        marginLeft:3
      }
})