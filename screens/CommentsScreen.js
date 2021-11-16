import React, { useEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'
import Entypo from 'react-native-vector-icons/Entypo';

import { Text,
    View,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity
    } from "react-native";

const CommentsScreen = ({route}) => {
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState("");
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(false);


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

    const fetchComments = () => {
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
        setLoading(true);
        if (route.params.postId !== postId) {
            fetchComments();

            setPostId(route.params.postId);
        }

        setLoading(false);
    }, [route.params.postId]);

    const onCommentSend = async () => {
        await firestore()
        .collection('posts')
        .doc(route.params.postId)
        .collection('comments')
        .add({
            creator: auth().currentUser.uid,
            commentText
        })
        setCommentText('');
    }

    console.log("These are the comments: ",comments);
    return (
        <View style={styles.container}>
            <FlatList
                data={comments}
                numColumns={1}
                horizontal={false}
                refreshing={loading}
                onRefresh={fetchComments}
                renderItem={({item}) => (
                    <View style={styles.commentCard} >
                        <TouchableOpacity>
                            <Text style={styles.commentUsername}>{item.user ? item.user[1] || 'Test' : 'Test'} {item.user ? item.user[2] || 'Name' : 'Name'}</Text>
                        </TouchableOpacity>
                        <Text>{item.commentText}</Text>
                    </View>
                )}
            />
            <View style={styles.sendCommentView}>
                <View style={styles.inputView}>
                    <TextInput
                        value={commentText}
                        placeholder="Envoyer un commentaire..."
                        onChangeText={(text) => setCommentText(text)}
                        style={styles.textInput}    
                        />
                </View>
                <TouchableOpacity>
                    <View style={styles.sendIconView}>
                        <Entypo
                            name="paper-plane"
                            onPress={() => onCommentSend()}
                            backgroundColor="#fff"
                            color="#333"
                            size={28}
                            style={styles.sendIcon}
                            />
                    </View>
                </TouchableOpacity>
            </View>    
        </View>
    )
}

export default CommentsScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1
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
        fontSize:16,
        borderWidth: 1,
        width:'100%',
    },
    sendIconView :{
        flex:1,
        elevation:1
    },
    sendIcon: {
        alignSelf:'center',
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