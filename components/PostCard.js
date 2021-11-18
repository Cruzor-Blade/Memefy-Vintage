import React, {useContext, useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, TouchableWithoutFeedback, StyleSheet, View, Image, Animated } from 'react-native';
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
  UserImageContainer,
} from '../styles/FeedStyles';

import moment from 'moment';
import { AuthContext } from '../navigation/AuthProvider';
import { useTheme } from 'react-native-paper';

const iconSize = 36.0;
const mvDuration = 500;
const containerWidth= windowWidth * (3/4);

const PostCard = ({item, onDelete, onProfilePress, onCommentPress, onImagePress, ...props}) =>{
  const {user} = useContext(AuthContext);
  const currentTheme = useTheme();

  const [userData, setUserData] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [currentUserReaction, setCurrentUserReaction] = useState(null);


  const laughLeft = containerWidth*(1/6) - iconSize*1.25;
  const heartLeft = containerWidth*(2/6) - iconSize*1.25;
  const coolLeft = containerWidth*(3/6) - iconSize*1.25;
  const dontcareLeft = containerWidth*(3/6) - iconSize*1.25;
  const sadLeft = containerWidth*(3/6) - iconSize*1.25;
  const prevLeft = containerWidth*(3/6) - iconSize*1.25;

  const FdontcareLeft = containerWidth*(1/6);
  const FsadLeft = containerWidth*(2/6);
  const FprevLeft = containerWidth*(3/6);


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

  const getFirebaseReaction = () => {
    firestore()
    .collection("posts")
    .doc(item.id)
    .collection("reactions")
    .doc(user.uid)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.exists) {
        const {userReaction} = querySnapshot.data();
        console.log("Query snapshot reaction: ", querySnapshot.data())
        console.log("Post reaction: ",userReaction);
        setCurrentUserReaction(userReaction);
      }
    })
  }

  const onReactionPress = async (userReaction) => {
        setCurrentUserReaction(userReaction);
        await firestore()
        .collection("posts")
        .doc(item.id)
        .collection("reactions")
        .doc(user.uid)
        .set({userReaction})
  };

  const onRmvReactionPress = async () => {
        setCurrentUserReaction(null);
        await firestore()
        .collection("posts")
        .doc(item.id)
        .collection("reactions")
        .doc(user.uid)
        .delete()
};

  const reactions = {
      laugh: require("../assets/reactions/laugh.png"),
      heart: require("../assets/reactions/heart.png"),
      cool: require("../assets/reactions/cool.png"),
      dontcare: require("../assets/reactions/dontcare.png"),
      sad: require("../assets/reactions/sad.png"),
      prev: require("../assets/reactions/prev.png"),
  }

  const ReactionItem = ({reaction}) => {
    if ( reaction == 'prev') {
      return (
        <TouchableWithoutFeedback
            onPress={() => {
                SwitchReactions();
            }}
        >
            <Image
                source={reactions[reaction]}
                style={[styles.reaction, {height: iconSize+1, width:iconSize+1}]}
            />
        </TouchableWithoutFeedback>
);

    } else {
      return (
        <TouchableOpacity
            onPress={() => {
                onReactionPress(reaction);
            }}
        >
            <Image
                source={reactions[reaction]}
                style={styles.reaction}
            />
        </TouchableOpacity>
);

    }
  }

  const coolTrans = useState(new Animated.Value(0))[0];
  const dontcareTrans = useState(new Animated.Value(0))[0];
  const sadTrans = useState(new Animated.Value(0))[0];
  const prevTrans = useState(new Animated.Value(0))[0];
  const prevRot = useState(new Animated.Value(0))[0];

  function mvDontcare() {
      if (!showReactions) {
          Animated.timing(dontcareTrans, {
              toValue:FdontcareLeft,
              duration:mvDuration*1/3,
              useNativeDriver:true
          }).start();
      } else {
          Animated.timing(dontcareTrans, {
              toValue:0,
              duration:mvDuration*1/3,
              useNativeDriver:true
          }).start();
      }
  };

  function mvSad() {
      if (!showReactions) {
          Animated.timing(sadTrans, {
              toValue:FsadLeft,
              duration:mvDuration*2/3,
              useNativeDriver:true
          }).start();
      } else {
          Animated.timing(sadTrans, {
              toValue:0,
              duration:mvDuration*2/3,
              useNativeDriver:true
          }).start();
      }
  };

  function mvPrev() {
      if (!showReactions) {
          Animated.timing(prevTrans, {
              toValue:FprevLeft,
              duration:mvDuration,
              useNativeDriver:true
          }).start();
      } else {
          Animated.timing(prevTrans, {
              toValue:0,
              duration:mvDuration,
              useNativeDriver:true
          }).start();
      }
  };


  const SwitchReactions = () => {
    setShowReactions(!showReactions);
    mvPrev();
    setTimeout(() => mvSad() , showReactions ? mvDuration/6 : mvDuration/3);
    setTimeout(() => mvDontcare(), showReactions ? mvDuration/4 : mvDuration/2);
  }

  useEffect(() => {
    getUser();
    getFirebaseReaction();
  }, []);

  useEffect(() => {
    getFirebaseReaction()
  }, [currentUserReaction])

  return(
    <Card style={[{width:windowWidth, ...props}, currentTheme.dark ? {backgroundColor:'#333333'} : {backgroundColor:'#f8f8f8'}]}>
        <UserInfo >
          <TouchableOpacity onPress={onProfilePress}>
            <UserImageContainer>
              <UserImg source={{uri : userData ? userData.userImg || 'https://firebasestorage.googleapis.com/v0/b/memebit-x.appspot.com/o/photos%2Fmeme-troll-face.png?alt=media&token=b0e1c29a-8fc0-4729-a244-f05e5d1e331a'
                                                                      :
                                                                      'https://firebasestorage.googleapis.com/v0/b/memebit-x.appspot.com/o/photos%2Fmeme-troll-face.png?alt=media&token=b0e1c29a-8fc0-4729-a244-f05e5d1e331a'}} />
            </UserImageContainer>
          </TouchableOpacity>
          <UserInfoText>
            <TouchableOpacity onPress={onProfilePress}>
              <UserName style={currentTheme.dark ? {color:'#eeeeee'} : {color:'#333333'}}>
                {userData ? userData.fname || 'Test' : 'Test' } {userData ? userData.lname || 'User' : 'User'}
              </UserName>
            </TouchableOpacity>
            <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
          </UserInfoText>
        </UserInfo>
        {item.post && <PostText>{item.post}</PostText>}
        {item.postImg === null ? <Divider/>
        : //if there is an user image available
        <TouchableOpacity onPress={onImagePress}>
          <PostImg source={{uri: item.postImg}}/>
        </TouchableOpacity>
        }
        <InteractionWrapper>
          <View style={styles.commentsViewReaction}>
            <TouchableOpacity onPress={onCommentPress}>
              <Ionicons name="md-chatbubble-outline" size={28} />
            </TouchableOpacity>
            <View style={{height:45, width:26, alignItems:'center', justifyContent:'center'}}>
              {currentUserReaction ? (
                <TouchableOpacity onPress={() => onRmvReactionPress()}>
                  <Image
                  source={reactions[currentUserReaction]}
                  style={{height:25, width:25, opacity:0.7}}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          <View style={styles.reactionsContainer}>
                <View style={[styles.reactionView, {left:laughLeft}]}>
                    <ReactionItem
                        reaction={'laugh'}
                    />
                </View>
                <View style={[styles.reactionView, {left:heartLeft}]}>
                    <ReactionItem
                        reaction={'heart'}
                        
                    />
                </View>
                <View style={[styles.reactionView, {left:coolLeft}]}>
                    <ReactionItem
                        reaction={'cool'}
                    />
                </View>
                <Animated.View style={[styles.reactionView,
                    {left:dontcareLeft, transform:[{translateX:dontcareTrans}]}]}>
                    <ReactionItem
                        reaction={'dontcare'}
                    />
                </Animated.View>
                <Animated.View style={[styles.reactionView,
                    {left:sadLeft, transform:[{translateX:sadTrans}]}]}>
                    <ReactionItem
                        reaction={'sad'}
                    />
                </Animated.View>
                <Animated.View style={[styles.reactionView,
                    {left:prevLeft, transform: [{translateX:prevTrans}]}]}>
                    <ReactionItem
                        reaction={'prev'}
                    />
                </Animated.View>
            </View>
        </InteractionWrapper>
      </Card>
  )
}

export default PostCard;

const styles = StyleSheet.create({
  postBottomStyles:{
      height: 45,
      width: windowWidth,
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'row',
      borderColor:"#222",
      borderWidth:1
  },
  reactionsContainer:{
      height:45,
      width: containerWidth,
      flexDirection:'row',
      alignItems:'center',
      borderColor:"#444",
      borderWidth:1
  },
  commentsViewReaction:{
    height:45,
    width: windowWidth-containerWidth,
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-evenly'

  },
  reactionView:{
      height:iconSize+2,
      width:iconSize+2,
      alignItems:'center',
      justifyContent:'center',
      position:'absolute',
  },
  reaction:{
      height:iconSize,
      width:iconSize
  }
})