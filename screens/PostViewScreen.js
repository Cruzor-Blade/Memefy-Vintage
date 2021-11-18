import React, { useContext, useEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore';
import { windowWidth } from "../utils/Dimentions";
import Ionicons from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';

import { Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    Alert
    } from "react-native";
import { PostTime, UserImg, UserInfo, UserInfoText, UserName } from "../styles/FeedStyles";

import { defaultProfilePicture } from '../utils/Defaults';
import moment from 'moment';
import { AuthContext } from "../navigation/AuthProvider";

const PostViewScreen = ({route, navigation}) => {
    const { user } = useContext(AuthContext);

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState("");
    const [userData, setUserData] = useState(null);


    const getPostData = async() => {
        await firestore()
        .collection('posts')
        .doc(route.params.postId)
        .get()
        .then((documentSnapshot) => {
          if( documentSnapshot.exists ) {
            console.log('Post Data', documentSnapshot.data());
            setPost(documentSnapshot.data());
          }
        })
      }

    useEffect(() => {
        getPostData(route.params.postId);
        getUser();
    }, []);


    function matchUserToComment(comments) {
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].hasOwnProperty('user')) {
                continue;
            }
            
            firestore()
            .collection('users')
            .doc( comments[i].creator)
            .get()
            .then((documentSnapshot) => {
                if( documentSnapshot.exists ) {
                    console.log('Individual User Data for comments', documentSnapshot.data());
                    const { userImg, fname, lname } = documentSnapshot.data();
                    comments[i].user = [userImg, fname, lname ]
                    console.log("About the comments", comments)
                    setComments(comments)
                }
            })     
        }
    }

    useEffect(() => {
        if (route.params.postId !== postId) {
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


    }, [route.params.postId]);

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
    
    console.log("User Data:",userData);


    const handleDelete = (postId) => {
        Alert.alert(
          'Delete Post',
          'Are You Sure?',
          [
            {
              text:'Cancel',
              onPress: () => console.log('Cancel pressed !'),
              style:'cancel'
            },
            {
              text:'Confirm',
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
              'Post deleted!',
              'Your post has been deleted successfully!',
            );

          })
          .catch((e) => console.log('Error deleting posst.', e));
      };

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback>
                <View style={styles.imageContainer}>
                    <ImageBackground
                        source={post ? {uri: post.postImg} : require("../assets/default-img.jpg")}
                        style={styles.image}
                    >
                        <View style={styles.postDetailsContainer}>
                            <UserInfo>
                                <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', {userId:post.userId})}>
                                    <UserImg source={{uri : userData ? userData.userImg || defaultProfilePicture : defaultProfilePicture}} />
                                </TouchableOpacity>
                                <UserInfoText>
                                    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', {userId:post.userId})}>
                                        <UserName>
                                            {userData ? userData.fname || 'Test' : 'Test' } {userData ? userData.lname || 'User' : 'User'}
                                        </UserName>
                                    </TouchableOpacity>
                                    <PostTime>{post ? moment(post.postTime.toDate()).fromNow() : null}</PostTime>
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
                                <TouchableOpacity style={{marginHorizontal: 6}}>
                                    <Ionicons
                                        name="ios-download-outline"
                                        size = {29}
                                        color="#00ff00"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </TouchableWithoutFeedback>
            <View>
                <FlatList
                    data={comments}
                    numColumns={1}
                    horizontal={false}
                    renderItem={({item}) => (
                          <View style={styles.commentCard}>
                          <Text style={styles.commentUsername}>{item.user ? item.user[1] || 'Test' : 'Test'} {item.user ? item.user[2] || 'Name' : 'Name'}</Text>
                              <Text>{item.commentText}</Text>
                          </View>
                    )}
                />
            </View>
        </View>
    )
}

export default PostViewScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageContainer:{
        position:'relative',
        width:windowWidth,
        minHeight:windowWidth,
        maxHeight:windowWidth*1.4
    },
    image:{
        position:'relative',
        width:windowWidth,
        minHeight:windowWidth,
        maxHeight:windowWidth*1.1,
        resizeMode:'contain'
    },
    viewReactionsContainer:{
        flexDirection:'row',
        alignItems:'flex-start',
        marginRight:8,
   
    },
    postDetailsContainer:{
        height:80,
        width:windowWidth,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',

    },
    commentCard: {
        backgroundColor: '#dcdcdc',
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