import React, { useContext, useEffect, useRef, useState } from "react";
import firestore from '@react-native-firebase/firestore';
import { windowWidth } from "../utils/Dimentions";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Oticons from 'react-native-vector-icons/Octicons';
import storage from '@react-native-firebase/storage';
import MaskedView from '@react-native-community/masked-view';

import {
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    Alert,
    PermissionsAndroid,
    Platform,
    Animated,
    ScrollView
    } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useTheme, Text } from "react-native-paper";
import { PostTime, ProfileMask, UserImg, UserInfo, UserInfoText, UserName } from "../styles/FeedStyles";

import { defaultProfilePicture } from '../utils/Defaults';
import moment from 'moment';
import { AuthContext } from "../navigation/AuthProvider";
import RNFetchBlob from "rn-fetch-blob";
import { LanguageContext } from "../languages/languageContext";
import { Card } from "../styles/FeedStyles";
import AdView from "../components/ads/AdView";
import { AdManager } from "react-native-admob-native-ads";
import { ActionsContext } from "../userContext/Actions";

const PostViewScreen = ({route, navigation}) => {
    const {user} = useContext(AuthContext);
    const {postViewScreen, currentLanguage} = useContext(LanguageContext);
    const {adsEnabled, PVSi} = useContext(ActionsContext);

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState("");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showInfo, setShowInfo] = useState (false);

    const [showImageAd, setShowImageAd] = useState(false);
    
    const currentTheme = useTheme();

    const postDetailsOpacity = useRef(new Animated.Value(0)).current;

    moment.locale(currentLanguage)

    const onAdClosePress = () => {
      setShowImageAd(false)
      // console("Show Image Ad:", showImageAd);
    };

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

    const reportPost = () => {
      const addReport = () => {
        firestore()
        .collection('metaPosts')
        .doc('reports')
        .collection(postId)
        .doc(user.uid)
        .set({})
        .then(() => Alert.alert(
          postViewScreen.reportedAlertTitle,
          postViewScreen.reportedAlertSubtitle,
        ))
      }
      Alert.alert(
        postViewScreen.reportAlertTitle,
        postViewScreen.reportAlertSubtitle,
        [
          {
            text:postViewScreen.reportAlertCancel,
            onPress: () => console.log('Cancel pressed !'),
            style:'cancel'
          },
          {
            text:postViewScreen.reportAlertDone,
            onPress: () => addReport(),
            style:'cancel'
          }
        ],
        {cancelable: false}
      );
    };

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
            path: PictureDir + '/memefy/Memefy_' +
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
        // Deciding by a probability of 1/5 if an ad is to be shown on the postView
        const showImageProb = Math.random();
        console.log("Show Image Prob", showImageProb)
        if (showImageProb >= 0.6) {
          setShowImageAd(true);
        }
       
        //Getting data about the current post  
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
            {showInfo &&
              <Animated.View style={[styles.postDetailsContainer, {opacity:postDetailsOpacity, zIndex:1}]}>
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
                          <TouchableOpacity style={styles.userName} onPress={() => navigation.navigate('ProfileScreen', {userId:post.userId})}>
                              <UserName style={{color:currentTheme.dark ? "#eeeeee" :"#222222"}}>
                                  {userData ? userData.fname || 'No' : '' } {userData ? userData.lname || 'Name' : ''}
                              </UserName>
                          </TouchableOpacity>
                          <PostTime style={{color:currentTheme.dark ? "#eeeeee" :"#222222"}}>{post ? moment(post.postTime.toDate()).fromNow() : null}</PostTime>
                      </UserInfoText>
                  </UserInfo>
                  <View style={styles.viewReactionsContainer}>
                      {route.params.uid === user.uid ? (
                      <TouchableOpacity style={{marginHorizontal:4}}
                          onPress={() => handleDelete(route.params.postId)}>
                          <Ionicons
                              name="ios-trash-bin-outline"
                              size = {29}
                              color="#00ff00"
                          />
                      </TouchableOpacity>)
                      : null}
                      <TouchableOpacity style={{marginHorizontal: 4}} onPress={checkPermission}>
                          <Ionicons
                              name="ios-download-outline"
                              size = {29}
                              color="#00ff00"
                          />
                      </TouchableOpacity>
                      <TouchableOpacity style={{marginHorizontal: 4, marginTop:4}} onPress={reportPost}>
                          <Oticons
                              name="stop"
                              size = {27}
                              color="#ff0000"
                          />
                      </TouchableOpacity>
                  </View>
              </Animated.View>
            }
            <TouchableWithoutFeedback onPress={() => {
              switchDetailsVisible();
              setTimeout(() => setShowInfo(!showInfo), showInfo ? 700:0)
              }}>
               
                  <ScrollView style={styles.imageContainer}>
                    <ImageBackground
                        source={post ? {uri: post.postImg} : require("../assets/default-img.jpg")}
                        style={[styles.image,
                          {width:windowWidth,
                            height: (route.params.ImgDimensions.height/route.params.ImgDimensions.width)*windowWidth}]}
                    />
                  </ScrollView>
               
            </TouchableWithoutFeedback>
            { adsEnabled && showImageAd && <View style={{zIndex:3, position:'absolute', width:windowWidth, borderRadius:10, marginTop:2, backgroundColor:'#cccccc'}} >
              <AdView closable onClosePress={onAdClosePress} adId={PVSi} media={true} />
            </View>}
            
                <FlatList
                    showsVerticalScrollIndicator={false}
                    onRefresh={fetchComments}
                    refreshing={loading}
                    data={comments}
                    numColumns={1}
                    horizontal={false}
                    renderItem={({item}) => (
                          <View style={[styles.commentCard, {backgroundColor: currentTheme.dark ? '#666666' : '#dcdcdc'}]}>
                          <Text style={{fontSize:14, fontWeight:'bold', color: currentTheme.dark ? '#dddddd' : '#222222'}}>
                            {item.user ? item.user.fname || 'No' : ''} {item.user ? item.user.lname || 'Name' : ''}
                          </Text>
                              <Text style={{color: currentTheme.dark ? '#cccccc' : '#333333'}}>{item.commentText}</Text>
                          </View>
                      )}
                      ListEmptyComponent= {() => (
                        <>
                            <Text style={{fontSize:16, marginHorizontal:'auto', textAlign:'center', marginHorizontal:25, marginTop:20}}>
                              {postViewScreen.noCommentsTitle}
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("CommentsScreen", {postId:route.params.postId})}>
                              <Text style={{fontSize:17, color:'blue', marginHorizontal:'auto', textAlign:'center', margin:10, fontWeight:'bold'}}>
                                {postViewScreen.noCommentsSubtitle}
                              </Text>
                            </TouchableOpacity>
                        
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
        maxHeight:windowWidth*1.2,
        elevation:8,
        backgroundColor:"#f8f8f8",
        shadowOffset:{
          width:0,
          height:3
        }
    },
    userName:{
      color:"#000000"
      // textShadowColor: 'rgba(128, 128, 128, 0.75)',
      // textShadowOffset: {
      //   width: -3,
      //   height:3
      // },
      // textShadowRadius:10
    },
    image:{
        position:'relative',
        resizeMode:'cover'
    },
    viewReactionsContainer:{
        flexDirection:'row',
        alignItems:'flex-start',
        marginRight:8,
        opacity:0.7
    },
    postDetailsContainer:{
        height:80,
        width:windowWidth,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        position:'absolute'

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