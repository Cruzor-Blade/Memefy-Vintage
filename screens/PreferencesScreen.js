import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Platform, Share, Linking } from "react-native";
import { LanguageContext } from "../languages/languageContext";
import OptionMenuModel from "../components/OptionMenuModel";
import AdView from "../components/ads/AdView";
import { AdManager } from "react-native-admob-native-ads";
import Foundation from 'react-native-vector-icons/Foundation';
import { useTheme } from "react-native-paper";


const Preferences = ({navigation}) =>{
  const linkToApp = 'https://play.google.com/store/apps/details?id=com.memefy';
  const {preferencesScreen} = useContext(LanguageContext);
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

    const configureAds = () => {
      const NATIVE_AD_ID =
        Platform.OS === 'ios'
          ? 'ca-app-pub-3940256099942544/3986624511'
          : 'ca-app-pub-3999653499390156/6180916923';
  
      const NATIVE_AD_VIDEO_ID =
        Platform.OS === 'ios'
          ? 'ca-app-pub-3940256099942544/2521693316'
          : 'ca-app-pub-3940256099942544/1044960115';
  
      AdManager.registerRepository({
        name: 'imageAd',
        adUnitId: NATIVE_AD_ID,
        numOfAds: 2,
        nonPersonalizedAdsOnly: false,
        videoOptions:{
          mute: false
        },
        expirationPeriod: 3600000, // in milliseconds (optional)
        mediationEnabled: false,
      }).then(result => {
        console.log('registered: ', result);
      });
      
      // unmute video test ad
      AdManager.registerRepository({
        name: 'videoAd',
        adUnitId: NATIVE_AD_VIDEO_ID,
        numOfAds: 3,
        nonPersonalizedAdsOnly: false,
        videoOptions:{
          mute: false
        },
        expirationPeriod: 3600000, // in milliseconds (optional)
        mediationEnabled: false,
      }).then(result => {
        console.log('registered: ', result);
      });
  
      // mute video test ad
      AdManager.registerRepository({
        name: 'muteVideoAd',
        adUnitId: NATIVE_AD_VIDEO_ID,
        numOfAds: 3,
        nonPersonalizedAdsOnly: false,
        videoOptions:{
          mute: false
        },
        expirationPeriod: 3600000, // in milliseconds (optional)
        mediationEnabled: false,
      }).then(result => {
        console.log('registered: ', result);
      });
    }

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

    useEffect(() => {
      configureAds();
    }, [])

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
          <AdView type="image" media={false} />
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