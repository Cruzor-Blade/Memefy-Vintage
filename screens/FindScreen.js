import React, { useContext, useState } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import { Text, useTheme } from 'react-native-paper';

import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { defaultProfilePicture } from '../utils/Defaults';
import { ProfileMask, UserImg, Divider } from '../styles/FeedStyles';

const FindScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  const fetchUsers = async (search) => {
    await firestore()
    .collection('usernames')
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
                <MaskedView
                  style={{width:45, height:45, alignItems:'center', justifyContent:'center'}}
                  maskElement={
                    <ProfileMask
                      style={{height:45, width:45}}
                      source={require('../assets/masks/profileMask.png')}/>
                  }
                  >
                  <UserImg source={{uri : item ? item.userImg || defaultProfilePicture : defaultProfilePicture}} />
                </MaskedView>
                <View style={styles.infoView}>
                  <Text style={{fontSize:15, fontWeight:"bold"}}>@{item.username}</Text>
                  <Text>({item.fname ? item.fname : 'No'} {item.lname ? item.lname : 'Name'})</Text>
                </View>
              </View>
              <Divider style={{width:'85%', marginTop:5}}/>
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
    marginTop:8,
    marginBottom:15,
  },
  userItem: {
    flexDirection:'row',
    alignItems:'center',
    padding:4,
    marginHorizontal:10
  },
  infoView: {
    paddingHorizontal:12
  }
});