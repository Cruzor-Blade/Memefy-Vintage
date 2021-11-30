import React, { useState, useContext } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Image} from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import { Text, useTheme } from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';
import { defaultProfilePicture } from '../utils/Defaults';
import { ProfileMask, UserImg, Divider } from '../styles/FeedStyles';
import { LanguageContext } from '../languages/languageContext';

const FindScreen = ({navigation}) => {
  const {findScreen} = useContext(LanguageContext);
  const [searchValue, setSearchValue] = useState("")
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentTheme = useTheme();

  const fetchUsers = (search) => {
    setLoading(true);
    firestore()
    .collection('users')
    .where('username', '>=', search)
    .where('username', '<=', search + '~')
    .get()
    .then((querySnapshot) => {
      let users = querySnapshot.docs.map(doc => {
        console.log(doc.data())
        const data = doc.data();
        const id = doc.id;
        return {id, ...data}
      });
      setUsers(users);
      setLoading(false);
    })
  }

  
  return (
    <View>
      <TextInput
        autoCapitalize='none'
        style={[styles.searchInput, {color: currentTheme.dark ? "#fff" :"333"}]}
        placeholder={findScreen.searchPlaceholder}
        onChangeText={(text) => {
            setSearchValue(text);
            if (text == '') {
              setUsers([]);
            } else {
              fetchUsers(text)
            }
          }
        }
        placeholderTextColor={useTheme().dark ? "#cdcdcd" : "#333"}
        tvParallaxShiftDistanceX="8"
      />
      {loading && <ActivityIndicator style={{marginHorizontal:'auto', marginVertical:4}} size="large" />}
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
        ListEmptyComponent= {() => searchValue && !loading ? (
          <>
              <Text style={{fontSize:17, marginHorizontal:'auto', textAlign:'center', marginHorizontal:25, marginTop:20, fontWeight:"bold"}}>
                {findScreen.noUsersTitle}
              </Text>
              <Image
                source={require("../assets/maintab/not-found.png")}
                style={{alignSelf:'center', height:160, width:160, tintColor:"#666666"}}
                />
              {/* <Text style={{fontSize:17, marginHorizontal:'auto', textAlign:'center', margin:10, fontWeight:'bold'}}>
                {findScreen.noUsersSubtitle}
              </Text> */}
          </>
          ) : null}
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