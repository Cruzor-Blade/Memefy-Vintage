import React, { useState, useContext } from 'react';
import { Text, StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../navigation/AuthProvider';
import { windowWidth } from '../utils/Dimentions';
import { LanguageContext } from '../languages/languageContext';

const SignupScreen = ({navigation}) => {
  const {register, registerLoading} = useContext(AuthContext);
  const { signUpScreen } = useContext(LanguageContext);

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const[isValidUser, setIsValidUser] = useState(true);
  const[isValidEmail, setIsValidEmail] = useState(true);
  const[isValidPassword, setIsValidPassword] = useState(true);
  const[matchingPasswords, setMatchingPasswords] = useState(true);


  
  const handleValidUser = (val) => {
    if (val.split(" ").join("").length >= 4 && val !="") {
      setIsValidUser(true);
    } else {
      setIsValidUser(false);
    }
  }

  const handleValidEmail = (val) => {
    if (val.split(" ").join("").length >= 4 && val.includes("@", ".") && val !="") {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(false);
    }
  }

  const handleValidPassword = (val) => {
    if (val.split(" ").join("").length >= 8 && val !="") {
      setIsValidPassword(true);
    } else {
      setIsValidPassword(false);
    }
  }

  const handleMatchingPasswords = () => {
    if(password.split(" ").join("") == confirmPassword.split(" ").join("")) {
      setMatchingPasswords(true);
    } else {
      setMatchingPasswords(false);
    }
  }
   
  return(
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ width:windowWidth-40, minHeight:200}}>
            <Text style={styles.text}>{signUpScreen.createAccountTitle}</Text>  
            <FormInput
              labelValue={username}
              placeholder={signUpScreen.usernamePlaceholder}
              iconType="user"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(username) => {
                  setUsername(username.split(/[\[\] ~@#^&:;,.|{=}]/).join("").toLowerCase())
                  if(username.split(/[ ~@#^&:;|{=}]/).join("").length >=4 && !isValidUser) {
                    setIsValidUser(true);
                  }
                }}
              onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
            />
            {isValidUser ? null : (
                <Text style={styles.errorMsg}>{signUpScreen.usernameErrorMsg}</Text>
              )}
            <FormInput
              labelValue={email}
              placeholder={signUpScreen.emailPlaceholder}
              iconType="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete={"email"}
              onChangeText={(userEmail) => {
                setEmail(userEmail.split(/[ \[\]~^:;|{=}]/).join(""))
                if (userEmail.split(" ").join("").length >= 4 && userEmail.includes("@", ".") && !isValidEmail) {
                  setIsValidEmail(true);
                }
              }}
              onEndEditing={(e) => handleValidEmail(e.nativeEvent.text)}
            />
            {isValidEmail ? null : (
                <Text style={styles.errorMsg}>{signUpScreen.emailErrorMsg}</Text>
              )}
            <FormInput
              labelValue={password}
              placeholder={signUpScreen.passwordPlaceholder}
              iconType="lock"
              secureTextEntry={true}
              onChangeText={(userPassword) => {
                setPassword(userPassword.split(" ").join(""))
                if (userPassword.split(" ").join("").length >=8 && !isValidPassword) {
                  setIsValidPassword(true);
                }
                }}
              onEndEditing={(e) => handleValidPassword(e.nativeEvent.text)}
              />
              {isValidPassword ? null : (
                <Text style={styles.errorMsg}>{signUpScreen.passwordErrorMsg}</Text>
              )}
            <FormInput
              labelValue={confirmPassword}
              placeholder={signUpScreen.confirmPasswordPlaceholder}
              iconType="lock"
              secureTextEntry={true}
              onChangeText={(userConfirmPassword) => {
                setConfirmPassword(userConfirmPassword.split(" ").join(""))
                if (confirmPassword.split(" ").join("").length >=8 && !matchingPasswords) {
                  setMatchingPasswords(true);
                }
              }}
              onEndEditing={(e) => handleMatchingPasswords(e.nativeEvent.text)}
            />
            {matchingPasswords ? null : (
                <Text style={styles.errorMsg}>{signUpScreen.confirmPasswordErrorMsg}</Text>
              )}
            {registerLoading && <ActivityIndicator size='small' style={{margin:3}}/>}
          </ScrollView>
          <FormButton
            buttonTitle={signUpScreen.signInButtonLabel}
            onPress={() => {
              handleValidUser(username);
              handleValidEmail(email);
              handleValidPassword(password);
              handleMatchingPasswords(confirmPassword);
              if (username.split(" ").join("").length >= 4 && username !="" && //Check if username is valid
                  email.split(" ").join("").length >= 4 && email.includes("@", ".") && email !="" && //Check if email is valid
                  password.split(" ").join("").length >= 8 && password !="" && //Check if password is valid
                  password.split(" ").join("") == confirmPassword.split(" ").join("") //Checks is passwords are matching
                ) {
                  register(email, password, username);
                }
            }}
          />
          <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.navButtonText}>
              {signUpScreen.signInTouchable}</Text>
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