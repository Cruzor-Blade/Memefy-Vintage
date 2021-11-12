import React, { useState, useContext } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../navigation/AuthProvider';
import { windowWidth } from '../utils/Dimentions';

const SignupScreen = ({navigation}) => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dataValidity, setDataValidity] = useState({
    isValidEmail:true,
    isValidUser:true,
    isValidPassword:true,
    matchingPasswords:true
  })

  const {register} = useContext(AuthContext);

  const handleValidEmail = (val) => {
    if (val.trim().length >= 4 && val.includes("@", ".")) {
      setDataValidity ({
        ...dataValidity,
        isValidEmail:true
      });
    } else {
      setDataValidity ({
        ...dataValidity,
        isValidEmail:false
      });
    }
  }

  const handleValidUser = (val) => {
    if (val.trim().length >= 4) {
      setDataValidity ({
        ...dataValidity,
        isValidUser:true
      });
    } else {
      setDataValidity ({
        ...dataValidity,
        isValidUser:false
      });
    }
  }

  const handleValidPassword = (val) => {
    if (val.trim().length >= 8) {
      setDataValidity ({
        ...dataValidity,
        isValidPassword:true
      });
    } else {
      setDataValidity ({
        ...dataValidity,
        isValidPassword:false
      });
    }
  }

  const handleMatchingPasswords = (val) => {
    if(password.split(" ").join("") == confirmPassword.split(" ").join("")) {
      setDataValidity ({
        ...dataValidity,
        matchingPasswords:true
      })
    } else {
      setDataValidity ({
        ...dataValidity,
        matchingPasswords:false
      })
    }
  }
   
  return(
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ width:windowWidth-40, minHeight:200}}>
            <Text style={styles.text}>Creez un compte</Text>  
            <FormInput
              labelValue={username}
              placeholder="Entrez un nom d'utilisateur"
              iconType="user"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(username) => {
                  setUsername(username.split(" ").join(""))
                  if(username.trim().length >=4 && !dataValidity.isValidUser) {
                    setDataValidity({
                      ...dataValidity,
                      isValidUser:true
                    })
                  }
                }}
              onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
            />
            {dataValidity.isValidUser ? null : (
                <Text style={styles.errorMsg}>Le nom d'utilisateur doit avoir au moins 4 caracteres</Text>
              )}
            <FormInput
              labelValue={email}
              placeholder="Email"
              iconType="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(userEmail) => {
                setEmail(userEmail.trim())
                if (userEmail.trim().length >= 4 && userEmail.includes("@", ".")) {
                  setDataValidity ({
                    ...dataValidity,
                    isValidEmail:true
                  });
                }
              }}
              onEndEditing={(e) => handleValidEmail(e.nativeEvent.text)}
            />
            {dataValidity.isValidEmail ? null : (
                <Text style={styles.errorMsg}>L'addresse email entree est incorrecte</Text>
              )}
            <FormInput
              labelValue={password}
              placeholder="Mot de passe"
              iconType="lock"
              secureTextEntry={true}
              onChangeText={(userPassword) => {
                setPassword(userPassword.trim())
                if (userPassword.trim().length >=8 && !dataValidity.isValidPassword) {
                  setDataValidity({
                    ...dataValidity,
                    isValidPassword:true
                  });
                }
                }}
              onEndEditing={(e) => handleValidPassword(e.nativeEvent.text)}
              />
              {dataValidity.isValidPassword ? null : (
                <Text style={styles.errorMsg}>Le mot de passe doit avoir au moins 8 caracteres</Text>
              )}
            <FormInput
              labelValue={confirmPassword}
              placeholder="Confirmez votre mot de passe"
              iconType="lock"
              secureTextEntry={true}
              onChangeText={(userConfirmPassword) => {
                setConfirmPassword(userConfirmPassword.trim())
                if (confirmPassword.trim().length >=8 && !dataValidity.matchingPasswords) {
                  setDataValidity({
                    ...dataValidity,
                    isValidPassword:true
                  });
                }
              }}
              onEndEditing={(e) => handleMatchingPasswords(e.nativeEvent.text)}
            />
            {dataValidity.matchingPasswords ? null : (
                <Text style={styles.errorMsg}>Les mots de passe des entrees ne correspondent pas</Text>
              )}
          </ScrollView>
          <FormButton
            buttonTitle="Creez votre compte"
            onPress={() => {
              handleValidEmail(email);
              handleValidUser(username);
              handleValidPassword(password);
              handleMatchingPasswords(confirmPassword);
              if (dataValidity.isValidUser &&
                dataValidity.isValidEmail &&
                dataValidity.isValidPassword &
                dataValidity.matchingPasswords) {
                  register(email, password, username)
                }
            }}
          />
          <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.navButtonText}>
              Deja un compte? Connectez vous...</Text>
          </TouchableOpacity>
        </View>
        )
} 

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f9fafd',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    logo: {
      height: 150,
      width: 150,
      resizeMode: 'cover',
    },
    text: {
      fontFamily: 'Kufam-SemiBoldItalic',
      fontSize: 28,
      marginBottom: 10,
      color: '#051d5f',
    },
    navButton: {
      marginTop: 15,
    },
    forgotButton: {
      marginVertical: 35,
    },
    navButtonText: {
      fontSize: 18,
      fontWeight: '500',
      color: '#2e64e5',
      fontFamily: 'Lato-Regular',
    },
    errorMsg: {
      fontSize:13,
      color:'#ff0000',
    }
  });