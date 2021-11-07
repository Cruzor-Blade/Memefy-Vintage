import React, { useEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore';
import { windowWidth } from "../utils/Dimentions";
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    } from "react-native";
import { PostTime, UserImg, UserInfo, UserInfoText, UserName } from "../styles/FeedStyles";

import moment from 'moment';

const PostViewScreen = ({route}) => {
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
    }, [])

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
                setComments(comments);

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
                                <TouchableOpacity>
                                    <UserImg source={{uri : userData ? userData.userImg || 'https://firebasestorage.googleapis.com/v0/b/memebit-x.appspot.com/o/photos%2Fmeme-troll-face.png?alt=media&token=b0e1c29a-8fc0-4729-a244-f05e5d1e331a'
                                                                                            :
                                                                                            'https://firebasestorage.googleapis.com/v0/b/memebit-x.appspot.com/o/photos%2Fmeme-troll-face.png?alt=media&token=b0e1c29a-8fc0-4729-a244-f05e5d1e331a'}} />
                                </TouchableOpacity>
                                <UserInfoText>
                                    <TouchableOpacity>
                                    <UserName>
                                        {userData ? userData.fname || 'Test' : 'Test' } {userData ? userData.lname || 'User' : 'User'}
                                    </UserName>
                                    </TouchableOpacity>
                                    <PostTime>{post ? moment(post.postTime.toDate()).fromNow() : null}</PostTime>
                                </UserInfoText>
                            </UserInfo>
                            <View style={styles.viewReactionsContainer}>
                                <TouchableOpacity style={{marginHorizontal:6}}>
                                    <Ionicons
                                        name="ios-trash-bin-outline"
                                        size = {29}
                                        color="#00ff00"
                                    />
                                </TouchableOpacity>
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
                        <View>
                            <View>
                                <Text>{item.commentText}</Text>
                            </View>
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

    }
})