import React, {createContext, useState} from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
  
    return (
      <AuthContext.Provider
        value={{
          user,
          setUser,
          isDarkTheme,
          loginLoading,
          registerLoading,
          toggleTheme: () => { setIsDarkTheme(!isDarkTheme);},
          login: async (email, password) => {
            if (loginLoading==false) {
              setLoginLoading(true);
              try {
                await auth().signInWithEmailAndPassword(email, password);
              } catch (e) {
                console.log(e.code);
                if (e.code == "auth/network-request-failed") {
                  Alert.alert("Probleme de connexion ou impossible de se connecter")
                } else if (e.code == "auth/too-many-requests") {
                  Alert.alert("Trop de tentatives de connexion. Veuillez reessayer plus tard")
                } else if (e.code == "auth/wrong-password") {
                  Alert.alert("Le mot de passe saisi est incorrect");
                } else if (e.code == "auth/user-disabled") {
                  Alert.alert("Votre compte a ete desactive")
                } else if (e.code == "auth/user-not-found") {
                  Alert.alert("Aucun compte n'est enregistre avec cette addresse email")
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
                      Alert.alert("Ce nom d'utilisateur est deja pris")
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
                    Alert.alert("Probleme de connexion ou impossible de se connecter")
                  } else if (e.code == "auth/email-already-in-use") {
                    Alert.alert("Cette addresse email deja enregistree. Connectez vous plutot.")
                  } else if (e.code == "auth/invalid-email") {
                    Alert.alert("L'addresse email entree n'est pas valide.")
                  } else if (e.code == "auth/operation-not-allowed") {
                    Alert.alert("Vous n'etes pas autorises a vous connecter a votre compte")
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