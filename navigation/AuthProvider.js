import React, {createContext, useContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { LanguageContext } from "../languages/languageContext";

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
  const {authProvider} = useContext(LanguageContext);

  const [user, setUser] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginLoading,
        registerLoading,
        login: async (email, password) => {
          if (loginLoading==false) {
            setLoginLoading(true);
            try {
              await auth().signInWithEmailAndPassword(email, password);
            } catch (e) {
              console.log(e.code);
              if (e.code == "auth/network-request-failed") {
                alert(authProvider.networkUnavailable)
              } else if (e.code == "auth/too-many-requests") {
                alert(authProvider.tooManyRequests)
              } else if (e.code == "auth/wrong-password") {
                alert(authProvider.wrongPassword);
              } else if (e.code == "auth/user-disabled") {
                alert(authProvider.userDisabled)
              } else if (e.code == "auth/user-not-found") {
                alert(authProvider.userNotFound)
              }
            }
            setLoginLoading(false);
          }
        },
        register: async (email, password, username) => {
          if (registerLoading==false) {
            setRegisterLoading(true);
            try {
              await firestore()
              .collection('usernames')
              .doc(username)
              .get()
              .then(async querySnapshot => {
                if (querySnapshot.exists) {
                    alert(authProvider.alreadyTakenUsername)
                } else {
                  await firestore()
                  .collection('usernames')
                  .doc(username)
                  .set({})
                  .then()
                  .catch(e => {
                    console.log("Error while setting the username",e)                    
                  })


                  await auth().createUserWithEmailAndPassword(email, password)
                  .then(() => {
                    firestore()
                    .collection('users')
                    .doc(auth().currentUser.uid)
                    .set({
                      username:username,
                      fname:'',
                      lname:'',
                      email: email,
                      createdAt: firestore.Timestamp.fromDate(new Date()),
                      userImg: null,
                      about:'',
                      phone:'',
                      country:'',
                      city:'',
                      followers:0,
                      followings:0
                    })
                    .catch(e => {
                      console.log('Something went wrong while adding the user to the firestore: ', e);
                    }) 
                  })
                }
              }).catch(e => {
                console.log("Something went wrong when trying to retrieve the user: ", e)
                if (e.code == "auth/network-request-failed") {
                  alert(authProvider.networkUnavailable)
                } else if (e.code == "auth/email-already-in-use") {
                  alert(authProvider.alreadyRegisteredEmail)
                } else if (e.code == "auth/invalid-email") {
                  alert(authProvider.invalidEmail)
                } else if (e.code == "auth/operation-not-allowed") {
                  alert(authProvider.unAuthorizedConnexion)
                }
              })

              
            } catch (e) {
              console.log('Something went wrong when signing up: ', e);
            }
            setRegisterLoading(false);
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};