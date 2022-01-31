import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Platform, Share, Linking } from "react-native";
import { LanguageContext } from "../languages/languageContext";
import OptionMenuModel from "../components/OptionMenuModel";
import AdView from "../components/ads/AdView";
import { AdManager } from "react-native-admob-native-ads";
import Foundation from 'react-native-vector-icons/Foundation';
import { useTheme } from "react-native-paper";
import { ActionsContext } from "../userContext/Actions";


const Preferences = ({navigation}) =>{
  const linkToApp = 'https://play.google.com/store/apps/details?id=com.memefy';
  const {preferencesScreen} = useContext(LanguageContext);
  const {adsEnabled} = useContext(ActionsContext);
  const currentTheme = useTheme();
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

    const shareApp = async () => {
      try {
        const result = await Share.share({
          message:`Memefy is the new platform to discover memes. Let's Memefy it ! \n\n You can download the app here:\n ${linkToApp}`
        })
      } catch (e) {
        console.log("Error during sharing process", e);
      }
    }

    const openStore = () => {
      try {
        Linking.openURL("market://details?id=com.memefy");
      } catch (e) {
        console.log(e)
      }
    }


    return(
        <View style={{marginTop:10}}>
            <OptionMenuModel
              navigation={navigation}
              screen="Appearance"
              style={{marginTop:30}}
              text={preferencesScreen.appearanceLabel}
              imageRequire={require('../assets/preferences/appearance.png')}
              imageStyles={{height:33, width:33}}
            />
          <OptionMenuModel
            navigation={navigation}
            screen="Suggestions"
            text={preferencesScreen.suggestionsLabel}
            imageRequire={require('../assets/preferences/suggestions.png')}
            imageStyles={{height:33, width:33}}
          />
          <OptionMenuModel
            navigation={navigation}
            screen="About"
            text={preferencesScreen.aboutLabel}
            imageRequire={require('../assets/preferences/about.png')}
            imageStyles={{height:33, width:33}}
          />
          <OptionMenuModel
            ImageComp={() => <Foundation  color={currentTheme.dark ? "#cccccc" : "#111111"} name="share" size={30} />}
            text={preferencesScreen.shareApp}
            onRipplePress={shareApp}
          />
          <OptionMenuModel
            ImageComp={() => <Foundation  color={currentTheme.dark ? "#cccccc" : "#111111"} name="star" size={30} />}
            text={preferencesScreen.rateUs}
            onRipplePress={openStore}
          />
          { adsEnabled && <AdView name="PreferencesScreen banner" media={false} />}
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