import React, { useState, useContext } from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { AuthContext } from '../navigation/AuthProvider';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  
  const {login} = useContext(AuthContext);

  const handleValidEmail = (val) => {
    if (val.trim().length >= 4 && val.includes("@", ".")) {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(false);
    }
  }

  const handleValidPassword = (val) => {
    if (val.trim().length >= 8) {
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
          <Text style={styles.text}>Memebit</Text>
          <FormInput
            labelValue={email}
            placeholder="Email"
            iconType="user"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(userEmail) => {
              setEmail(userEmail.trim())
            if (userEmail.trim().length >= 4 && userEmail.includes("@", ".")){
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
              setPassword(userPassword.trim())
              if (userPassword.trim().length >=8 && !isValidPassword) {
                setIsValidPassword(true)
              }
              }}
            onEndEditing={(e) => handleValidPassword(e.nativeEvent.text)}
          />
          {isValidPassword ? null : (
            <Text style={styles.errorMsg}>Le mot de passe doit avoir au moins 8 caracteres</Text>
          )}
          <FormButton
            buttonTitle="Se Connecter"
            onPress={() => {
              handleValidEmail(email);
              handleValidPassword(password);
              if (isValidEmail && isValidPassword) {
                login(email, password)}}
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