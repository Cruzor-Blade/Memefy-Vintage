import React, { useState, useContext } from 'react';
import { Text, StyleSheet, View, Image, ActivityIndicator } from 'react-native';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { AuthContext } from '../navigation/AuthProvider';

const LoginScreen = ({navigation}) => {
  const {login, loginLoading} = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  
  const handleValidEmail = (val) => {
    if (val.split(" ").join("").length >= 4 && val.includes("@", ".") && val != "") {
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
    return(
        <View style={styles.container}>
          <Image  
            style={styles.logo}
            source={require("../assets/logo.png")} />
          <Text style={styles.text}>MemeBit</Text>
          <FormInput
            labelValue={email}
            placeholder="Email"
            iconType="user"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={"email"}
            onChangeText={(userEmail) => {
              setEmail(userEmail.split(" ").join(""))
            if (userEmail.split(" ").join("").length >= 4 && userEmail.includes("@", ".")){
              setIsValidEmail(true);
            } 
            }}
            onEndEditing={(e) => handleValidEmail(e.nativeEvent.text)}
          />
          {isValidEmail ? null : (
                <Text style={styles.errorMsg}>l'addresse email entree est incorrecte</Text>
              )}
          <FormInput
            labelValue={password}
            placeholder="Mot de passe"
            iconType="lock"
            secureTextEntry={true}
            onChangeText={(userPassword) => {
              setPassword(userPassword.split(" ").join(""))
              if (userPassword.split(" ").join("").length >=8 && !isValidPassword) {
                setIsValidPassword(true)
              }
              }}
            onEndEditing={(e) => handleValidPassword(e.nativeEvent.text)}
          />
          {isValidPassword ? null : (
            <Text style={styles.errorMsg}>Le mot de passe doit avoir au moins 8 caracteres</Text>
          )}
          {loginLoading && <ActivityIndicator size='small' style={{margin:3}}/>}
          <FormButton
            buttonTitle="Se Connecter"
            onPress={() => {
              handleValidEmail(email);
              handleValidPassword(password);
              if (email.split(" ").join("").length >= 4 && email.includes("@", ".") && email != ""
                  && password.split(" ").join("").length >= 8 && password !="") {
                  login(email, password)
              }
              }
            }
          />
          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.navButtonText}>
              Pas encore un compte? Creez en un...</Text>
          </TouchableOpacity>
        </View>
        )
} 

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f9fafd',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding:20
    },
    logo: {
      height: 130,
      width: 180,
      resizeMode: 'cover',
      marginBottom:3,
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