import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormButton from '../components/FormButton';

import { AuthContext } from '../navigation/AuthProvider';

const PreferencesScreen = () => {
  const {user, logout} = useContext(AuthContext);
  return (
    <Text style={styles.container}>Preferences Screen</Text>
  )
}

export default PreferencesScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    color: '#333333'
  }
});