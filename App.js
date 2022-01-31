import React, { useEffect } from "react";
import { Platform } from "react-native";
import { AdManager } from "react-native-admob-native-ads";
import { requestTrackingPermission } from "react-native-tracking-transparency";
import Providers from './navigation';

const App = () => {
  useEffect(()=> {
    AdManager.setRequestConfiguration({
      tagForChildDirectedTreatment: false,
    });
    
    const NATIVE_AD_ID =
      Platform.OS === 'ios'
        ? 'ca-app-pub-3940256099942544/3986624511'
        : 'ca-app-pub-3940256099942544/2247696110';
    
    const NATIVE_AD_VIDEO_ID =
      Platform.OS === 'ios'
        ? 'ca-app-pub-3940256099942544/2521693316'
        : 'ca-app-pub-3940256099942544/1044960115';
    
    // image test ad
    AdManager.registerRepository({
      name: 'HomeScreen image',
      adUnitId: 'ca-app-pub-3999-653499390156/5282768227', //for android
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
  
    AdManager.registerRepository({
      name: 'PostViewScreen image',
      adUnitId: 'ca-app-pub-3999653499390156/7964949490', //for android
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
  
    AdManager.registerRepository({
      name: 'PreferencesScreen banner',
      adUnitId: 'ca-app-pub-3999653499390156/6180916923',
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
    
    // unmute video test ad
    AdManager.registerRepository({
      name: 'HomeScreen video',
      adUnitId: 'ca-app-pub-3999653499390156/9246746155',
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
      name: 'HomeScreen muteVideo',
      adUnitId: 'ca-app-pub-3999653499390156/9246746155',
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
  
  }, [])
  return(
    <Providers/>
  )
};

export default App;