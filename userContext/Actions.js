import React, {createContext, useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdManager } from 'react-native-admob-native-ads';
import { Platform } from 'react-native';

export const ActionsContext = createContext();

export const ActionProvider = ({children}) => {
    const [followLoading, setFollowLoading] = useState (false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [adsEnabled, setAdsEnabled] = useState(false);
    
    useEffect(async ()=> {
        const snapshot = await firestore().collection('config').doc('ads').get();
        const {showAds, HSi, HSv, HSmv,  PVSi, PSb} = snapshot.data()
        if (showAds){
            setAdsEnabled(true);
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
            adUnitId: HSi, //for android
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
            adUnitId: PVSi, //for android
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
            adUnitId: PSb,
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
            adUnitId: HSv,
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
            adUnitId: HSmv,
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
        } else {
        console.log('ads disabled on the server.')
        }
  }, []);
    
    return (
        <ActionsContext.Provider
            value={{
                adsEnabled,
                followLoading,
                isDarkTheme,
                setIsDarkTheme,
                toggleTheme: () =>  {
                        AsyncStorage.setItem('isDarkTheme', `${!isDarkTheme}`)
                        setIsDarkTheme(!isDarkTheme);
                },
                onFollowUser: async (followerId, followedId) => {
                    const followedDoc = firestore().collection('users').doc(followedId);
                    const followerDoc = firestore().collection('users').doc(followerId);
                    const currentUserFollowingRef = firestore().collection('users').doc(followerId).collection('userFollowings').doc(followedId)
                    
                    if (!followLoading){
                        setFollowLoading(true);
                        await currentUserFollowingRef.get()
                        .then(documentSnapshot => {
                            if (!documentSnapshot.exists) {
                                try {
                                    currentUserFollowingRef.set({})
                                } catch (error) {
                                    console.log('Error while adding the user to the current firesore user follows: ', error)
                                }
                                
                                //Increment the number of users visited user is followed by
                                try {
                                    followedDoc.update({'followers': firestore.FieldValue.increment(1)});
                                } catch (error) {
                                    console.log(error);
                                  }
                                  
                                  //increment the number of users current user is following
                                  try {
                                      followerDoc.update({'followings': firestore.FieldValue.increment(1)});
                                    } catch (error) {
                                        console.log(error);
                                    }
                            }
                        }).catch(error => {
                            console.log("Error during the follow verification", error);
                        }) 
                        }
                        setFollowLoading(false);
                    },
                    onUnfollowUser: async (unFollowerId, unFollowedId) => {
                        const unFollowedDoc = firestore().collection('users').doc(unFollowedId);
                        const unFollowerDoc = firestore().collection('users').doc(unFollowerId);
                        const currentUserFollowingRef = firestore().collection('users').doc(unFollowerId).collection('userFollowings').doc(unFollowedId)
                        if(!followLoading) {
                            setFollowLoading(true);

                            await currentUserFollowingRef.get()
                            .then(documentSnapshot => {
                                if (documentSnapshot.exists) {
                                    try {
                                        currentUserFollowingRef.delete()
                                    } catch (error) {
                                        console.log('Error during unfollowing: ', error)
                                    }
                                    
                                    try {
                                        unFollowedDoc.update({'followers': firestore.FieldValue.increment(-1)});
                                    } catch (error) {
                                        console.log('Error during unfollow decrement: ', error)
                                    }
                                    
                                    try {
                                        unFollowerDoc.update({'followings': firestore.FieldValue.increment(-1)});
                                    } catch (error) {
                                        console.log('Error during unfollow decrement: ', error)
                                    }
                                }
                            }).catch(error => {
                                console.log("Error during the follow verification", error);
                            })
                        setFollowLoading(false);    
                        }
                    }
                    }}
                    >
                {children}
        </ActionsContext.Provider>
    )
}