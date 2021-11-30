import React, { useContext, useEffect, useRef, useState } from "react";
import firestore from '@react-native-firebase/firestore';
import { windowWidth } from "../utils/Dimentions";
import Ionicons from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';
import MaskedView from '@react-native-community/masked-view';

import {
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    Alert,
    PermissionsAndroid,
    Platform,
    Animated
    } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { PostTime, ProfileMask, UserImg, UserInfo, UserInfoText, UserName } from "../styles/FeedStyles";

import { defaultProfilePicture } from '../utils/Defaults';
import moment from 'moment';
import { AuthContext } from "../navigation/AuthProvider";
import RNFetchBlob from "rn-fetch-blob";
import { LanguageContext } from "../languages/languageContext";

const PostViewScreen = ({route, navigation}) => {
    const {user} = useContext(AuthContext);
    const {postViewScreen, currentLanguage} = useContext(LanguageContext);

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState("");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showInfo, setShowInfo] = useState (false);
    const currentTheme = useTheme();

    const postDetailsOpacity = useRef(new Animated.Value(0)).current;

    moment.locale(currentLanguage)

    const getPostData = async() => {
        await firestore()
        .collection('posts')
        .doc(route.params.postId)
        .get()
        .then((documentSnapshot) => {
          if( documentSnapshot.exists ) {
            // console.log('Post Data', documentSnapshot.data());
            setPost(documentSnapshot.data());
          }
        })
      }


    const matchUserToComment = async (comments) => {
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].hasOwnProperty('user')) {
                continue;
            }
            
            await firestore()
            .collection('users')
            .doc( comments[i].creator)
            .get()
            .then((documentSnapshot) => {
                if( documentSnapshot.exists ) {
                    // console.log('Individual User Data for comments', documentSnapshot.data());
                    const { userImg, fname, lname } = documentSnapshot.data();
                    comments[i].user = {userImg, fname, lname }
                    // console.log("About the comments", comments)
                  }
                })     
            setComments(comments)
        }
        setLoading(false);
    }

    const fetchComments = () => {
        setLoading(true);
        firestore()
        .collection('posts')
        .doc(route.params.postId)
        .collection('comments')
        .get()
        .then((querySnapshot) => {
            let comments = querySnapshot.docs.map(doc => {
                const data= doc.data();
                const id = doc.id;
                return {id, ...data};
            });
            matchUserToComment(comments);

        })
        setPostId(route.params.postId);
    }

    
    const getUser = async () => {
        await firestore()
        .collection('users')
        .doc(route.params.uid)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            console.log('User Data', documentSnapshot.data());
            setUserData(documentSnapshot.data())
          }
        })
      }
    
    // console.log("User Data:",userData);


    const handleDelete = (postId) => {
        Alert.alert(
          postViewScreen.deleteAlertTitle,
          postViewScreen.deleteAlertSubtitle,
          [
            {
              text:postViewScreen.deleteAlertCancel,
              onPress: () => console.log('Cancel pressed !'),
              style:'cancel'
            },
            {
              text:postViewScreen.deleteAlertDone,
              onPress: () => deletePost(postId),
              style:'cancel'
            }
          ],
          {cancelable: false}
        )
      }

    const deletePost = (postId) => {
        console.log('Current Post Id: ', postId);
    
        firestore()
          .collection('posts')
          .doc(postId)
          .get()
          .then((documentSnapshot) => {
            if (documentSnapshot.exists) {
              const {postImg} = documentSnapshot.data();
    
              if (postImg != null) {
                const storageRef = storage().refFromURL(postImg);
                const imageRef = storage().ref(storageRef.fullPath);
    
                imageRef
                  .delete()
                  .then(() => {
                    console.log(`${postImg} has been deleted successfully.`);
                    deleteFirestoreData(postId);
                    navigation.navigate('HomeScreen')
                  })
                  .catch((e) => {
                    console.log('Error while deleting the image. ', e);
                  });
                // If the post image is not available
              } else {
                deleteFirestoreData(postId);
              }
            }
          });
      };
    
    
      const deleteFirestoreData = (postId) => {
        firestore()
          .collection('posts')
          .doc(postId)
          .delete()
          .then(() => {
            Alert.alert(
              postViewScreen.deletedAlertTitle,
              postViewScreen.deletedAlertSubtitle,
            );

          })
          .catch((e) => console.log('Error deleting posst.', e));
      };


      const checkPermission = async () => {
        if (Platform.OS === 'ios') {
          downloadImage();
        } else {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title:postViewScreen.internalStorageAccesDemandTitle,
                message:postViewScreen.internalStorageAccesDemandSubtitle
              }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('Storage Permission Granted');
              downloadImage();
            } else {
              alert(postViewScreen.internatStorageAccessDenied);
            }
          } catch (error) {
            console.warn(error);
          }
        }
      }

      const downloadImage = () => {
        let date = new Date();
        const ImgURI = post.postImg;
        let ext = getExtension(ImgURI);
        ext = '.' + ext[0];

        //Get config and fs from RNFetchBlob
        const {config, fs} = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir;
        let options = {
          fileCache: true,
          addAndroidDownloads: {
            //related to android only
            useDownloadManager: true,
            notification:true,
            path: PictureDir + '/memebit/meme_' +
            Math.floor(date.getTime() + date.getSeconds()/2) + ext,
            description: 'Image'
          }
        }

        config(options)
        .fetch('GET', ImgURI)
        .then((res) => {
          //Showing alert for successful download
          let status = res.info().status;
          if (status == 200) {
            alert(postViewScreen.dowloadSuccessAlert)
          } else {
            alert(postViewScreen.dowloadFailAlert)
            console.log('Response error: ', JSON.stringify(res))
          }
        })
        .catch((error) => {
          console.log('Error while downloading: ', error)
        })
      }

      const getExtension = (filename) => {
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined ;
      }


      function switchDetailsVisible () {
        Animated.timing(postDetailsOpacity, {
          toValue:!showInfo ? 1 : 0,
          duration:600,
          useNativeDriver:true,
        }

        ).start();
      }

      useEffect(() => {
        getPostData(route.params.postId);
        getUser();
    }, []);

      useEffect(() => {
        if (route.params.postId !== postId) {
           fetchComments(); 
        }
    }, [route.params.postId]);


    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => {
              switchDetailsVisible();
              setTimeout(() => setShowInfo(!showInfo), showInfo ? 700:0)
              }}>
                <View style={styles.imageContainer}>
                    <ImageBackground
                        source={post ? {uri: post.postImg} : require("../assets/default-img.jpg")}
                        style={[styles.image,
                          {width:windowWidth,
                            height: (route.params.ImgDimensions.height/route.params.ImgDimensions.width)*windowWidth}]}
                    >
                        {showInfo &&
                          <Animated.View style={[styles.postDetailsContainer, {opacity:postDetailsOpacity}]}>
                              <UserInfo>
                                  <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', {userId:post.userId})}>
                                      <MaskedView
                                        style={{width:55, height:55, alignItems:'center', justifyContent:'center'}}
                                        maskElement={
                                          <ProfileMask source={require('../assets/masks/profileMask.png')}/>
                                        }
                                        >
                                        <UserImg source={{uri : userData ? userData.userImg || defaultProfilePicture : defaultProfilePicture}} />
                                      </MaskedView>
                                  </TouchableOpacity>
                                  <UserInfoText>
                                      <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', {userId:post.userId})}>
                                          <UserName style={{color:currentTheme.dark ? "#eeeeee" :"#222222"}}>
                                              {userData ? userData.fname || 'No' : 'No' } {userData ? userData.lname || 'Name' : 'Name'}
                                          </UserName>
                                      </TouchableOpacity>
                                      <PostTime style={{color:currentTheme.dark ? "#eeeeee" :"#222222"}}>{post ? moment(post.postTime.toDate()).fromNow() : null}</PostTime>
                                  </UserInfoText>
                              </UserInfo>
                              <View style={styles.viewReactionsContainer}>
                                  {route.params.uid === user.uid ? (
                                  <TouchableOpacity style={{marginHorizontal:6}}
                                      onPress={() => handleDelete(route.params.postId)}>
                                      <Ionicons
                                          name="ios-trash-bin-outline"
                                          size = {29}
                                          color="#00ff00"
                                      />
                                  </TouchableOpacity>)
                                  : null}
                                  <TouchableOpacity style={{marginHorizontal: 6}} onPress={checkPermission}>
                                      <Ionicons
                                          name="ios-download-outline"
                                          size = {29}
                                          color="#00ff00"
                                      />
                                  </TouchableOpacity>
                              </View>
                          </Animated.View>
                        }
                    </ImageBackground>
                </View>
            </TouchableWithoutFeedback>
            
                <FlatList
                    showsVerticalScrollIndicator={false}
                    onRefresh={fetchComments}
                    refreshing={loading}
                    data={comments}
                    numColumns={1}
                    horizontal={false}
                    renderItem={({item}) => (
                          <View style={[styles.commentCard, {backgroundColor: currentTheme.dark ? '#666666' : '#dcdcdc'}]}>
                          <Text style={{fontSize:14, fontWeight:'700', color: currentTheme.dark ? '#dddddd' : '#222222'}}>
                            {item.user ? item.user.fname || 'No' : 'No'} {item.user ? item.user.lname || 'Name' : 'Name'}
                          </Text>
                              <Text style={{color: currentTheme.dark ? '#cccccc' : '#333333'}}>{item.commentText}</Text>
                          </View>
                      )}
                      ListEmptyComponent= {() => (
                        <>
                            <Text style={{fontSize:16, marginHorizontal:'auto', textAlign:'center', marginHorizontal:25, marginTop:20}}>
                              {postViewScreen.noCommentsTitle}
                            </Text>
                            <Text style={{fontSize:17, marginHorizontal:'auto', textAlign:'center', margin:10, fontWeight:'bold'}}>
                              {postViewScreen.noCommentsSubtitle}
                            </Text>
                        
                        </>
                        )}
                />
            
        </View>
    )
}

export default PostViewScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer:{
        position:'relative',
        width:windowWidth,
        maxHeight:windowWidth*1.4,
        elevation:8,
        backgroundColor:"#333",
        shadowOffset:{
          width:0,
          height:3
        }
    },
    image:{
        position:'relative',
        resizeMode:'cover'
    },
    viewReactionsContainer:{
        flexDirection:'row',
        alignItems:'flex-start',
        marginRight:8,
        opacity:0.4
    },
    postDetailsContainer:{
        height:80,
        width:windowWidth,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',

    },
    commentCard: {
        padding:10,
        marginLeft:15,
        marginVertical:8,
        maxWidth:'73%',
        minWidth:'20%',
        borderRadius:10,
        elevation:1
  },
  commentUsername: {
      fontSize:14,
      fontWeight:'700'
  }
})