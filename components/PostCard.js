import React, {useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

const PostCard = ({item, onDelete, ...props}) =>{
  const {user} = useContext(AuthContext);

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

  return(
    <Card style={{width:windowWidth, ...props}}>
        <UserInfo>
          <UserImg source={{uri : item.userImg}} />
          <UserInfoText>
            <UserName>{item.userName}</UserName>
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