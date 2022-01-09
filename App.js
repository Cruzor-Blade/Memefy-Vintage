import React, { useEffect } from "react";
import { AdManager } from "react-native-admob-native-ads";
import { requestTrackingPermission } from "react-native-tracking-transparency";
import Providers from './navigation';

const App = () => {
  
  useEffect(() => {
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
      name: 'imageAd',
      adUnitId: NATIVE_AD_ID,
      numOfAds: 5,
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


    const init = async () => {
      const trackingStatus = await requestTrackingPermission();

      let trackingAuthorized = false;
      if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
        trackingAuthorized = true;
      }

      await AdManager.setRequestConfiguration({
        tagForChildDirectedTreatment: false,
        trackingAuthorized,
      });

    };

    init();
  }, []);

  return(
    <Providers/>
  )
};

export default App;