import React, { useEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'
import Feather from 'react-native-vector-icons/Feather';

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

    const onCommentSend = (text) => {
        firestore()
        .collection('posts')
        .doc(route.params.postId)
        .collection('comments')
        .add({
            creator: auth().currentUser.uid,
            commentText
        })
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={comments}
                numColumns={1}
                horizontal={false}
                renderItem={({item}) => (
                    <View>
                        <View>
                            <Text>{item.text}</Text>
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
                <Feather.Button
                    name="plane"
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