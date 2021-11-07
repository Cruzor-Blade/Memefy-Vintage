import React, { useEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'
import Entypo from 'react-native-vector-icons/Entypo';

import { Text,
    View,
    StyleSheet,
    FlatList,
    TextInput,
    } from "react-native";

const CommentsScreen = ({route}) => {
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState("");
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(false);


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
            setComments(comments);
            
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
                    <View>
                        <View>
                            <Text>{item.commentText}</Text>
                        </View>
                    </View>
                )}
            />
            <View>
                <TextInput
                    placeholder="Envoyer un commentaire..."
                    onChangeText={(text) => setCommentText(text)}
                    style={styles.textInput}    
                />
                <Entypo.Button
                    name="paper-plane"
                    onPress={() => onCommentSend()}
                    backgroundColor="#fff"
                    color="#333"
                    />
            </View>    
        </View>
    )
}

export default CommentsScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
})