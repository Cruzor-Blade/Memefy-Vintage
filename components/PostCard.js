import React, {useContext, useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { windowWidth} from '../utils/Dimentions';
import { Container,
  Card,
  UserInfo,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  PostText,
  PostImg,
  Divider,
  InteractionWrapper,
  Interaction,
  InteractionText
} from '../styles/FeedStyles';

import moment from 'moment';
import { AuthContext } from '../navigation/AuthProvider';

const PostCard = ({item, onDelete, onPress, ...props}) =>{
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  const likeIcon = item.liked ? "heart" : "heart-outline";
  const likeIconColor = item.liked ? "#2e64e5" : "#333";
  let likeText;
  let CommentText;

  if (item.likes == 1 ) {
    likeText = "1 Like"
  } else if (item.likes >1) {
    likeText = item.likes + 'Likes'
  } else {
    likeText='Like'
  }

  if (item.comments == 1 ) {
    CommentText = "1 Comment"
  } else if (item.comments >1) {
    CommentText = item.comments + 'Comments'
  } else {
    CommentText='Comment'
  }

  const getUser = async () => {
    await firestore()
    .collection('users')
    .doc(item.userId)
    .get()
    .then((documentSnapshot) => {
      if (documentSnapshot.exists) {
        console.log('User Data', documentSnapshot.data());
        setUserData(documentSnapshot.data())
      }
    })
  }

  useEffect(() => {
    getUser();
  }, []);

  return(
    <Card style={{width:windowWidth, ...props}}>
        <UserInfo>
          <UserImg source={{uri : userData ? userData.userImg || 'https://firebasestorage.googleapis.com/v0/b/memebit-x.appspot.com/o/photos%2Fmeme-troll-face.png?alt=media&token=b0e1c29a-8fc0-4729-a244-f05e5d1e331a'
                                                                  :
                                                                  'https://firebasestorage.googleapis.com/v0/b/memebit-x.appspot.com/o/photos%2Fmeme-troll-face.png?alt=media&token=b0e1c29a-8fc0-4729-a244-f05e5d1e331a'}} />
          <UserInfoText>
            <TouchableOpacity onPress={onPress}>
              <UserName>
                {userData.username}
                {userData ? user.fname || 'Test' : 'Test' }
                {userData ? user.lname || 'User' : 'User'}
              </UserName>
            </TouchableOpacity>
            <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
          </UserInfoText>
        </UserInfo>
        <PostText>{item.post}</PostText>
        {item.postImg === null ? <Divider/> : <PostImg source={{uri: item.postImg}} />}
        <InteractionWrapper>
          <Interaction active={true} >
            <Ionicons name={likeIcon} size={25} color={likeIconColor} />
            <InteractionText active={item.liked}>{likeText}</InteractionText>
          </Interaction>
          <Interaction>
            <Ionicons name="md-chatbubble-outline" size={25} />
            <InteractionText>{CommentText}</InteractionText>
          </Interaction>
          {user.uid == item.userId ? (
            <Interaction onPress = {() => onDelete(item.id)}>
            <Ionicons name="md-trash-bin" size={25} />
          </Interaction>
          ) : null}
        </InteractionWrapper>
      </Card>
  )
}

export default PostCard;