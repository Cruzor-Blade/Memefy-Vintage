import React, { useContext, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useTheme } from 'react-native-paper';

import PostCard from '../components/PostCard';

import { AuthContext } from '../navigation/AuthProvider';
import { LanguageContext } from "../languages/languageContext";

import { Container } from '../styles/FeedStyles';

import firestore from '@react-native-firebase/firestore';
import { defaultProfilePicture } from '../utils/Defaults';



const HomeScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const {selectedLanguage} = useContext(LanguageContext)

  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchPosts = async () => {
    
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
      const list = []
      let notUserFollowingPosts =[];

      await firestore()
      .collection('posts')
      .orderBy('postTime', 'desc')
      .where('language', '==', selectedLanguage )
      .get()
      .then((querySnapshot) => {
        let showPostTime = 0;

        querySnapshot.forEach(doc => {
          const {userId, post, postImg, postTime, reactions, likes, comments, ImgDimensions} = doc.data();
          if (followArray.includes(userId)) {
            list.push({
              id:doc.id,
              userId,
              userName:'no_name',
              userImg:defaultProfilePicture,
              postTime,
              post,
              postImg,
              ImgDimensions,
              liked: false,
              reactions,
              likes,
              comments,
              following:true
            })
          } else {
            notUserFollowingPosts.push({
              id:doc.id,
              userId,
              userName:'no_name',
              userImg:defaultProfilePicture,
              postTime,
              post,
              postImg,
              ImgDimensions,
              liked: false,
              reactions,
              likes,
              comments,
              following:false
            })
          }

          if (showPostTime == 0 && notUserFollowingPosts.length != 0) {
            const randomPostIndex = Math.floor(Math.random() * notUserFollowingPosts.length)
            list.push(notUserFollowingPosts[randomPostIndex])
            notUserFollowingPosts = []
            showPostTime == Math.round(Math.random() * 18 + 7);
          } else {
            showPostTime= showPostTime - 1;
          }
          
        })

      })

      setPosts(list);

      if (loading) {
        setLoading(false);
      }

      // console.log('Posts: ', list)
    } catch (e) {
      console.log (e)
    }
  }

  useEffect(() =>{
    fetchPosts();
  }, [])

  
  return (
    <Container style={useTheme().dark ? {backgroundColor:'#555555'} : {backgroundColor:'#ffffff'}}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchPosts}
        refreshing={loading}
        renderItem={({item}) => 
          <PostCard
            item={item}
            onProfilePress={() => navigation.navigate('ProfileScreen', {userId:item.userId})}
            onCommentPress={() => navigation.navigate('CommentsScreen', {postId:item.id, uid:item.userId})}
            onImagePress={() => navigation.navigate('PostViewScreen', {postId:item.id, uid:item.userId, ImgDimensions:item.ImgDimensions})}
              />}
            />
    </Container>
  )
}

export default HomeScreen;

