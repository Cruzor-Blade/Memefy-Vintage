import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';

import FormButton from '../components/FormButton';
import PostCard from '../components/PostCard';

import storage from '@react-native-firebase/storage';
import { AuthContext } from '../navigation/AuthProvider';

import { Container } from '../styles/FeedStyles';

import firestore from '@react-native-firebase/firestore';
import { defaultProfilePicture } from '../utils/Defaults';

const Posts = [
  {
    id: '1',
    userName: 'Jenny Doe',
    userImg: require('../assets/users/user-3.jpg'),
    postTime: '4 mins ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-img-3.jpg'),
    liked: true,
    likes: '14',
    comments: '5',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../assets/users/user-1.jpg'),
    postTime: '2 hours ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: 'none',
    liked: false,
    likes: '8',
    comments: '0',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../assets/users/user-4.jpg'),
    postTime: '1 hours ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-img-2.jpg'),
    liked: true,
    likes: '1',
    comments: '0',
  },
  {
    id: '4',
    userName: 'Selina Paul',
    userImg: require('../assets/users/user-6.jpg'),
    postTime: '1 day ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-img-4.jpg'),
    liked: true,
    likes: '22',
    comments: '4',
  },
  {
    id: '5',
    userName: 'Christy Alex',
    userImg: require('../assets/users/user-7.jpg'),
    postTime: '2 days ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: 'none',
    liked: false,
    likes: '0',
    comments: '0',
  },
];


const HomeScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [followingList, setFollowingList] = useState(false);


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
      .get()
      .then((querySnapshot) => {
        let showPostTime = 0;

        querySnapshot.forEach(doc => {
          const {userId, post, postImg, postTime, likes, comments, ImgDimensions} = doc.data();
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

  useEffect(() => {
    fetchPosts();
    setDeleted(false);
  }, [deleted]);


  
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

