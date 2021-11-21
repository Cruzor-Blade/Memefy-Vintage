import React, { useContext, useState } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

const FindScreen = ({navigation}) => {
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
        placeholderTextColor={useTheme().dark ? "#cdcdcd" : "#333"}
        tvParallaxShiftDistanceX="8"
      />
      <FlatList
        data= {users}
        numColumns={1}
        horizontal={false}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => navigation.navigate('FindProfile', {userId:item.id})}>
            <View style={styles.userItem}>
                <Image source={{uri: item.userImg}} style={{height:40, width:40}} />
                <Text>{item.username}</Text><Text>({item.id} ({item.fname} {item.lname})</Text>
              </View>
          </TouchableOpacity>
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
    alignItems:'center',
    borderColor: '#0000ff',
    borderRadius:10,
    fontSize:16,
    borderWidth: 1,
    width:'95%',
    height:40,
    alignSelf:'center',
    paddingHorizontal:14,
  },
  userItem: {
    flexDirection:'row',
    alignItems:'center',
    padding:4
  }
});