import React, { useEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore';
import { windowWidth } from "../utils/Dimentions";

import { Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    } from "react-native";

const PostViewScreen = ({route}) => {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState("");

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
    }, [])

    useEffect(() => {
        if (route.params.postId !== postId) {
            await firestore()
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

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback>
                <View style={styles.imageContainer}>
                    <Image
                        source={require("../assets/posts/post-img-1.jpg")}
                        style={styles.image}
                    />
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
                                <Text>{item.text}</Text>
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
        maxHeight:windowWidth*1.4
    },
    image:{
        position:'relative',
        width:windowWidth,
        maxHeight:windowWidth*1.1
    }
})