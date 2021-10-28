import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import FormButton from '../components/FormButton';

import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

const FindScreen = () => {
  const {user, logout} = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  const fetchUsers = async (search) => {
    await firestore()
    .collection('users')
    .where('username', '>=', search)
    .get()
    .then((querySnapshot) => {
      let users = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const id = doc.id;
        return {id, ...data}
      });
      setUsers(users);

    })
  }

  
  return (
    <View>
      <TextInput
        style={styles.searchInput}
        placeholder="Recherchez un individu..."
        onChangeText={(text) => fetchUsers(text)}
      />
      <FlatList
       data= {users}
       numColumns={1}
       horizontal={false}
       renderItem={({item}) => (
         <Text>{item.id}</Text>
       )}
      />
    </View>
  )
}

export default FindScreen;

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
  },
  searchInput: {
    height:40,
    width:'95%'
  }
});