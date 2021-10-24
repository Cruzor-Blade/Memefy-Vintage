import React, { useState, useContext } from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../navigation/AuthProvider';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {register} = useContext(AuthContext)

    return(
        <View style={styles.container}>
          <Text style={styles.text}>Creez un compte</Text>  
          <FormInput
          labelValue={email}
          onChangeText={(userEmail) => setEmail(userEmail)}
          placeholder="Email"
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          />
          <FormInput
          labelValue={password}
          onChangeText={(userPassword) => setPassword(userPassword)}
          placeholder="Mot de passe"
          iconType="lock"
          secureTextEntry={true}
          />
          <FormInput
          labelValue={confirmPassword}
          onChangeText={(userConfirmPassword) => setConfirmPassword(userConfirmPassword)}
          placeholder="Confirmez votre mot de passe"
          iconType="lock"
          secureTextEntry={true}
          />
          <FormButton
            buttonTitle="Creez votre compte"
            onPress={() => register(email, password)}
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
  });