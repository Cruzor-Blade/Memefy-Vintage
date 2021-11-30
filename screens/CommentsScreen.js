import React, { useContext, useEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'
import Entypo from 'react-native-vector-icons/Entypo';
import { useTheme } from "react-native-paper";

import { Text,
    View,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
    } from "react-native";
import { LanguageContext } from "../languages/languageContext";

const CommentsScreen = ({route}) => {
    const {commentsScreen} = useContext(LanguageContext);

    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState("");
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(false);
    const [sendingComment, setSendingComment] = useState(false);
    const currentTheme = useTheme();


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
                    console.log('Individual User Data for comments', documentSnapshot.data());
                    const { userImg, fname, lname } = documentSnapshot.data();
                    comments[i].user = {userImg, fname, lname }
                    console.log("About the comments", comments)
                }
            })     
            setComments(comments);
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
    }
    
    useEffect(() => {
 
        if (route.params.postId !== postId) {
            fetchComments();

            setPostId(route.params.postId);
        }

    }, [route.params.postId]);

    const onCommentSend = async () => {
        if (!sendingComment) {
            setSendingComment(true);
                if (commentText !=''){
                    try {

                        await firestore()
                        .collection('posts')
                        .doc(route.params.postId)
                        .collection('comments')
                        .add({
                            creator: auth().currentUser.uid,
                            commentText
                        })
                        
                        firestore()
                        .collection('posts')
                        .doc(route.params.postId)
                        .update({'comments': firestore.FieldValue.increment(1)});
                    } catch (error) {
                        console.log(error);
                    }
                setCommentText('');
                }
            setSendingComment(false)
        }
    }

    // console.log("These are the comments: ",comments);
    return (
        <View style={styles.container}>
            <FlatList
                data={comments}
                numColumns={1}
                horizontal={false}
                refreshing={loading}
                onRefresh={fetchComments}
                renderItem={({item}) => (
                    <View style={[styles.commentCard, {backgroundColor: currentTheme.dark ? '#666666' : '#dcdcdc'}]} >
                        <TouchableOpacity>
                            <Text style={{fontSize:14, fontWeight:'700', color: currentTheme.dark ? '#dddddd' : '#222222'}}>
                                {item.user ? item.user.fname : 'No'} {item.user ? item.user.lname : 'Name'}
                            </Text>
                        </TouchableOpacity>
                        <Text style={{color: currentTheme.dark ? '#cccccc' : '#333333'}}>{item.commentText}</Text>
                    </View>
                )}
                ListEmptyComponent= {() => (
                    <>
                        <Text style={{fontSize:16, marginHorizontal:'auto', textAlign:'center', marginHorizontal:25, marginTop:300, color:'#111'}}>{commentsScreen.noCommentsTitle}</Text>
                        <Text style={{fontSize:17, marginHorizontal:'auto', textAlign:'center', margin:10, fontWeight:'bold', color:'#111'}}>{commentsScreen.noCommentsSubtitle}</Text>
                    
                    </>
                    )}
            />
            <View style={styles.sendCommentView}>
                <View style={styles.inputView}>
                    <TextInput
                        multiline={true}
                        value={commentText}
                        placeholder="Envoyer un commentaire..."
                        onChangeText={(text) => setCommentText(text)}
                        style={styles.textInput}
                        placeholderTextColor={currentTheme.dark ? "#cdcdcd" : "#333"}
                        tvParallaxShiftDistanceX='18' 
                        />
                </View>
                <TouchableOpacity>
                    <View style={styles.sendIconView}>
                        <Entypo
                            name="paper-plane"
                            onPress={() => onCommentSend()}
                            backgroundColor="#fff"
                            color={currentTheme.dark ? "#cdcdcd" : "#333"}
                            size={28}
                            style={styles.sendIcon}
                            />
                        {sendingComment && <ActivityIndicator
                            size={28}
                            style={{opacity:0.7, margin:'auto', position:'absolute', alignSelf:'center'}}
                        />}
                    </View>
                </TouchableOpacity>
            </View>    
        </View>
    )
}

export default CommentsScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sendCommentView: {
        height:42,
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',

    },
    inputView: {
        flex:6
    },
    textInput: {
        alignItems:'center',
        borderColor: '#0000ff',
        borderRadius:10,
        fontSize:17,
        borderWidth: 1,
        width:'100%',
        marginLeft:3,
        paddingVertical:8,
        paddingHorizontal:14
    },
    sendIconView :{
        flex:1,
        elevation:1,
        width:52,
        alignItems:'center',
        justifyContent:'center'
    },
    sendIcon: {
        alignSelf:'center',
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
})