import React, {createContext, useState} from 'react';

import firestore from '@react-native-firebase/firestore';

export const ActionsContext = createContext();

export const ActionProvider = ({children}) => {
    const [followLoading, setFollowLoading] = useState (false);
    return (
        <ActionsContext.Provider
            value={{
                followLoading,
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