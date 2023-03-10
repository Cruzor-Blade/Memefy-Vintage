import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import MaskedView from '@react-native-community/masked-view';

import {AuthContext} from '../navigation/AuthProvider';
import { ActionsContext } from '../userContext/Actions';
import { useTheme, Text } from 'react-native-paper';
import { defaultProfilePicture } from '../utils/Defaults';

import firestore from '@react-native-firebase/firestore';
import PostCard from '../components/PostCard';
import { LanguageContext } from '../languages/languageContext';



const ProfileScreen = ({navigation, route}) => {
  const {user, logout} = useContext(AuthContext);
  const {profileScreen, selectedLanguage} = useContext(LanguageContext);

  const {onFollowUser, onUnfollowUser} = useContext(ActionsContext);
  const currentTheme = useTheme();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [following, setFollowing] = useState(false);
  const [lastDoc, setLastDoc] = useState(firestore.Timestamp.fromDate(new Date()));


  const fetchPosts = async (number) => {
    
    //Fetching the users Ids that the current user is following 
    let followArray = [];

    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('userFollowings')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        followArray.push(doc.id);
      })
    })


    try {
      const list = [];

      await firestore()
        .collection('posts')
        .where('userId', '==', route.params ? route.params.userId : user.uid)
        .where('language', '==', selectedLanguage )
        .orderBy('postTime', 'desc')
        .startAfter(lastDoc)
        .limit(number)
        .get()
        .then((querySnapshot) => {
          // console.log('Total Posts: ', querySnapshot.size);

          querySnapshot.forEach((doc) => {
            const {
              userId,
              post,
              postImg,
              ImgDimensions,
              postTime,
              likes,
              comments,
              reactions,
              followers,
              followings
            } = doc.data();
            list.push({
              id: doc.id,
              userId,
              userImg: defaultProfilePicture,
              postTime: postTime,
              post,
              following: route.params && !followArray.includes(route.params.userId) ? false : true,
              postImg,
              ImgDimensions,
              liked: false,
              likes,
              comments,
              reactions,
              followers,
              followings
            });
          });
        });

        if (list.length == 0) {
          setLastDoc(null);
          console.log("LatestDOc :", lastDoc)
        } else {
          setLastDoc(list[list.length - 1].postTime)
          setPosts(posts.concat(list));
        }

      if (loading) {
        setLoading(false);
      }

      console.log('Posts: ', posts);
    } catch (e) {
      console.log(e);
    }
  };

  const getUser = async() => {
    await firestore()
    .collection('users')
    .doc( route.params ? route.params.userId : user.uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        console.log('User Data', documentSnapshot.data());
        const {
          username,
          fname,
          lname,
          userImg,
          about,
          followers,
          followings
        } = documentSnapshot.data()
        console.log("username:", username)
        setUserData({
          username,
          fname,
          lname,
          userImg,
          about,
          followers,
          followings
        });
      }
    }).catch(error  => {
      console.log(error)
    })
  }

  const fetchUsersFollowing = () => {
    let followArray = [];
    firestore()
    .collection('users')
    .doc(user.uid)
    .collection('userFollowings')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        followArray.push(doc.id);
      })
      if (followArray.includes(route.params.userId)) {
        setFollowing(true);
      } else {
        setFollowing(false)
      }
    })
    
  }

  console.log(following)


  const onFollow = async () => {
    onFollowUser(user.uid, route.params.userId);
    setFollowing(true);
  }


  const onUnFollow = async () => {
    onUnfollowUser(user.uid, route.params.userId)
    setFollowing(false);
  }

  useEffect(() => {
    if (route.params) {
      fetchUsersFollowing();
    }
  }, [])

  useEffect(() => {
    getUser();
    fetchPosts(2);
    navigation.addListener("focus", () => setLoading(!loading));
  }, [navigation, loading]);


  const onEndReached = () => {
    if (lastDoc) {
      fetchPosts(5);
      console.log("On end threshold");
    }
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: currentTheme.dark ? '#555555' : '#fff'}}>
      

        {/* {posts.map((item) => (
          <PostCard key={item.id} item={item}/>
        ))} */}
        <FlatList
          ListHeaderComponent = {() => (
            <View
              style={styles.container}>
              <MaskedView
                  style={{height:150, width:150, alignItems:'center', justifyContent:'center'}}
                  maskElement={
                    <Image
                      source={require('../assets/masks/profileScreenMask.png')}
                      style={{height:150, width:150}}
                      />
                  }
                  >
                  <Image
                    style={{height:150, width:150}}
                    source={{uri: userData ? userData.userImg || defaultProfilePicture : defaultProfilePicture}}
                    />
              </MaskedView>
            <Text style={styles.userName}>{userData ? userData.fname || 'No' : ''} {userData ? userData.lname || 'Name' : ''}</Text>
            <Text style={[styles.userName, {fontSize:16, marginTop:0, marginBottom:15}]}>{userData && `@${userData.username}`}</Text>
            {/* <Text>{route.params ? route.params.userId : user.uid}</Text> */}
            <Text style={styles.aboutUser}>
            {userData ? userData.about || profileScreen.defaultDescription : ''}
            </Text>
            <View style={styles.userBtnWrapper}>
              {route.params && route.params.userId != user.uid ? (
                <>
                  {/* <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
                    <Text style={styles.userBtnTxt}>Message</Text>
                  </TouchableOpacity> */}
                  {following ? (
                  <TouchableOpacity style={styles.userBtn} onPress={() => onUnFollow()}>
                    <Text style={styles.userBtnTxt}>{profileScreen.unfollow}</Text>
                  </TouchableOpacity>
                  )
                    : 
                  (
                    <TouchableOpacity style={styles.userBtn} onPress={() => onFollow()}>
                    <Text style={styles.userBtnTxt}>{profileScreen.follow}</Text>
                  </TouchableOpacity>  
                  )}
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.userBtn}
                    onPress={() => {
                      navigation.navigate('EditProfileScreen');
                    }}>
                    <Text style={styles.userBtnTxt}>{profileScreen.edit}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.userBtn} onPress={() => logout()}>
                    <Text style={styles.userBtnTxt}>{profileScreen.logout}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <View style={styles.userInfoWrapper}>
              <View style={styles.userInfoItem}>
                <Text style={styles.userInfoTitle}>{posts.length}</Text>
                <Text style={styles.userInfoSubTitle}>{profileScreen.publications}</Text>
              </View>
              <View style={styles.userInfoItem}>
                {userData ? <Text style={styles.userInfoTitle}>{userData.followers}</Text> : <ActivityIndicator size="small" />}
                <Text style={styles.userInfoSubTitle}>{profileScreen.followers}</Text>
              </View>
              <View style={styles.userInfoItem}>
                { userData ? <Text style={styles.userInfoTitle}>{userData.followings}</Text> : <ActivityIndicator size="small" />}
                <Text style={styles.userInfoSubTitle}>{profileScreen.followings}</Text>
              </View>
            </View>
          </View>
          )}
          ListEmptyComponent= {() => (
            <Text style={{fontSize:16, marginHorizontal:'auto', textAlign:'center', margin:10}}>{profileScreen.noPostsLabel}</Text>
            )}
            data={posts}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => 
              <PostCard
                item={item}
                onCommentPress={() => navigation.navigate('CommentsScreen', {postId:item.id, uid:item.userId})}
                onImagePress={() => navigation.navigate('PostViewScreen', {postId:item.id, uid:item.userId, ImgDimensions:item.ImgDimensions})}
                  />}
            onEndReached={onEndReached}
            onEndReachedThreshold={2/(posts.length)}
            />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:8,
    alignItems:'center',
    justifyContent:'center'
  },
  profileMask:{
    height: 150,
    width:150
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  aboutUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#2e64e5',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#2e64e5',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
});
