import React, {useContext, useState, useEffect, useRef} from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, StyleSheet, View, Image, Animated } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { windowWidth} from '../utils/Dimentions';
import {
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
  ProfileMask
} from '../styles/FeedStyles';
import { defaultProfilePicture } from '../utils/Defaults';

import moment from 'moment';
import frLocale from "moment/locale/fr";
import { AuthContext } from '../navigation/AuthProvider';
import { ActionsContext } from '../userContext/Actions';
import { useTheme, Text } from 'react-native-paper';
import MaskedView from '@react-native-community/masked-view';

const iconSize = 36.0;
const mvDuration = 500;
const containerWidth= windowWidth * (3/4);

const PostCard = ({item, onProfilePress, onCommentPress, onImagePress, ...props}) => {
  const {user} = useContext(AuthContext);
  const {onFollowUser} = useContext(ActionsContext);
  const currentTheme = useTheme();
  
  const [userData, setUserData] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [currentUserReaction, setCurrentUserReaction] = useState(null);
  const [userFollowing, setUserFollowing] = useState(item.following);
  
  const [ changeReactions, setChangeReactions ]= useState({prev:null, current:null});

  const laughLeft = containerWidth*(1/6) - iconSize*1.25;
  const heartLeft = containerWidth*(2/6) - iconSize*1.25;
  const coolLeft = containerWidth*(3/6) - iconSize*1.25;
  const dontcareLeft = containerWidth*(3/6) - iconSize*1.25;
  const sadLeft = containerWidth*(3/6) - iconSize*1.25;
  const prevLeft = containerWidth*(3/6) - iconSize*1.25;

  const FdontcareLeft = containerWidth*(1/6);
  const FsadLeft = containerWidth*(2/6);
  const FprevLeft = containerWidth*(3/6);

  function ParseFloat(str, val) {
    str = str.toString();
    if (! str.includes(".")) {
      return Number(str)
    } else {
      str = str.slice(0, (str.indexOf(".")) + val + 1);
      return Number(str);
    }
  }

  const numDisplay = (number) => {
    if (0<=number && number <=999) return number;
    else if (1000<= number && number <=999999) return `${ParseFloat(number/1000, 1)}k`
    else if (number >=1000000) return `${ParseFloat(number/1000000, 1)}M`
  }

  
  const handlereactionChange = (reaction) => {
    if (!changeReactions.current && reaction) {
      animateChatBubble();
    }
    setChangeReactions({
      prev:changeReactions.current,
      current:reaction
    })
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

  const onFollow = async () => {
      await onFollowUser(user.uid, item.userId);

      animateFollowOpacity('hide');
      setTimeout(() => {
        setUserFollowing(true);
      }, mvDuration*0.2)
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
        // console.log("Query snapshot reaction: ", querySnapshot.data())
        // console.log("Post reaction: ",userReaction);
        setCurrentUserReaction(userReaction);
      }
    })
  }

  const onReactionPress = async (userReaction) => {
        handlereactionChange(userReaction);
        setCurrentUserReaction(userReaction);

        await firestore()
        .collection("posts")
        .doc(item.id)
        .collection("reactions")
        .doc(user.uid)
        .get()
        .then(async documentSnapshot => {
          if (!documentSnapshot) {
          firestore()
          .collection("posts")
          .doc(item.id)
          .update({'reactions': firestore.FieldValue.increment(1)});
          }
        }).catch(e => {
          console.log(e)
        })

        firestore()
        .collection("posts")
        .doc(item.id)
        .collection("reactions")
        .doc(user.uid)
        .set({userReaction})
  };

  const onRmvReactionPress = async () => {
        handlereactionChange(null);
        setCurrentUserReaction(null);

        await firestore()
        .collection("posts")
        .doc(item.id)
        .collection("reactions")
        .doc(user.uid)
        .get()
        .then(async documentSnapshot => {
          if (documentSnapshot) {
            await firestore()
            .collection("posts")
            .doc(item.id)
            .collection("reactions")
            .doc(user.uid)
            .delete()

          firestore()
          .collection("posts")
          .doc(item.id)
          .update({'reactions': firestore.FieldValue.increment(-1)});
          }
        }).catch(e => {
          console.log(e)
        })
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
      const barSize = (iconSize-10)*(1/2)
      return (
        <TouchableWithoutFeedback
            onPress={() => {
                SwitchReactions();
            }}
        >
            <View style={[styles.prev]}>
              <Animated.Image
                source={require('../assets/reactions/prevComp.png')}
                style={{height:barSize, width:barSize, position:'absolute',
                  transform:[{translateY: prevUpbarTrans}, {translateX: prevUpbarTransH}]
                }}
                />
              <Animated.Image
                source={require('../assets/reactions/prevComp.png')}
                style={[{height:barSize, width:barSize, position:'absolute',
                  transform:[{rotate:'90deg'}, {translateX: prevBotbarTrans}, {translateY: prevBotbarTransH}]
                }]}
              />
            </View>
        </TouchableWithoutFeedback>
);

    } else {
      return (
        <TouchableOpacity
            onPress={() => {
              if (showReactions) {
                  SwitchReactions();
                }
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

  const dontcareTrans = useRef(new Animated.Value(0)).current;
  const sadTrans = useRef(new Animated.Value(0)).current;
  const prevTrans = useRef(new Animated.Value(0)).current;
  const prevUpbarTrans= useRef(new Animated.Value(0)).current;
  const prevBotbarTrans= useRef(new Animated.Value(0)).current;
  const prevUpbarTransH = useRef(new Animated.Value(0)).current;
  const prevBotbarTransH = useRef(new Animated.Value(0)).current;
  const chatBubbleScale = useRef(new Animated.Value(0)).current;
  const followOpacity = useRef(new Animated.Value(0)).current;


  function animateChatBubble() {
    setTimeout(() => {
      Animated.spring (chatBubbleScale, {
        toValue:1.3,
        duration:1000,
        useNativeDriver:true
      }).start();
    }, 3000);
    setTimeout(() => {
      Animated.spring (chatBubbleScale, {
        toValue:1,
        duration:1000,
        useNativeDriver:true
      }).start();
    }, 7000);
  }

  function animateFollowOpacity (status) {
    Animated.timing(followOpacity, {
      toValue: status === 'hide' ? 0 : 1,
      duration: mvDuration*0.75,
      useNativeDriver:true
    }).start();
  }

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

  function mvPrevUpbar() {
    //translate the prevUpbar vertically
    Animated.timing(prevUpbarTrans, {
      toValue:showReactions ? (iconSize-6)/6 : -(iconSize-6)/6,
      duration:mvDuration,
      useNativeDriver:true
    }).start();

    //Translates prevUpbar Horizontally
    Animated.timing(prevUpbarTransH, {
      toValue: showReactions ? 1 : -1,
      duration: mvDuration,
      useNativeDriver: true
    }).start();
  }

  function mvPrevBotbar() {
    //Translates the prevBotbar vertically
    Animated.timing(prevBotbarTrans, {
      toValue:showReactions ? -(iconSize-6)/6 : (iconSize-6)/6,
      duration:mvDuration,
      useNativeDriver:true
    }).start();

    //Translates the prevBotbar horizontally
    Animated.timing(prevBotbarTransH, {
      toValue: showReactions ? -1 : 1,
      duration: mvDuration,
      useNativeDriver: true
    }).start();
  }

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
      mvPrevUpbar();
      mvPrevBotbar();
  };


  const SwitchReactions = () => {
    setShowReactions(!showReactions);
    mvPrev();
    animateFollowOpacity(showReactions? 'show' : 'hide');
    setTimeout(() => mvSad() ,
      showReactions ? mvDuration/6 : mvDuration/3);
    setTimeout(() => mvDontcare(),
      showReactions ? mvDuration/4 : mvDuration/2);
  }

  useEffect(() => {
    getUser();
    getFirebaseReaction();
    followOpacity.setValue(1);
    chatBubbleScale.setValue(1);
    prevUpbarTrans.setValue((iconSize-6)/6);
    prevBotbarTrans.setValue(-(iconSize-6)/6);
    prevUpbarTransH.setValue(1);
    prevBotbarTransH.setValue(-1);
  }, []);

  useEffect(() => {
    getFirebaseReaction();
  }, [currentUserReaction])

  return(
    <Card style={[{width:windowWidth, ...props}, {backgroundColor:currentTheme.dark ? '#333333' : '#f6f6f6'}]}>
        <UserInfo >
          <TouchableOpacity onPress={onProfilePress}>
            <MaskedView
              style={{width:55, height:55, alignItems:'center', justifyContent:'center'}}
              maskElement={
                <ProfileMask source={require('../assets/masks/profileMask.png')}/>
              }
              >
              <UserImg source={{uri : userData ? userData.userImg || defaultProfilePicture : defaultProfilePicture}} />
            </MaskedView>
          </TouchableOpacity>
          <UserInfoText>
            <TouchableOpacity onPress={onProfilePress}>
              <UserName style={currentTheme.dark ? {color:'#eeeeee'} : {color:'#333333'}}>
                {userData ? userData.fname || 'No' : 'No' } {userData ? userData.lname || 'Name' : 'Name'}
              </UserName>
            </TouchableOpacity>
            <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
          </UserInfoText>
        </UserInfo>
        {item.post && <PostText style={currentTheme.dark ? {color:'#cccccc'} : {color:'#333333'}}>
          {item.post}</PostText>}
        {item.postImg === null ? <Divider/>
        : //if there is an user image available
        <TouchableOpacity onPress={onImagePress}>
          <PostImg source={{uri: item.postImg}} 
            style={{height:item.ImgDimensions ? (item.ImgDimensions.height/item.ImgDimensions.width)*windowWidth : 250}}/>
        </TouchableOpacity>
        }
        <InteractionWrapper>
          <View style={[styles.commentsViewReaction, {backgroundColor:currentTheme.dark ? '#444444' : '#eeeeee'}]}>
            <TouchableOpacity onPress={onCommentPress}>
              <View style={styles.commentsView}>
                <Animated.Image source={require('../assets/reactions/chatBubble.png')}
                  style={[{height:28, width:26, resizeMode:'contain', tintColor: currentTheme.dark ? '#cccccc': '#222222',
                    transform:[{scale:chatBubbleScale}]
                  }]} />
                  <Text style={{fontSize:11.5}}>{numDisplay(item.comments)}</Text>
              </View>
            </TouchableOpacity>
            <View style={{width:36, height:44, alignItems:'center', justifyContent:'space-between', marginBottom:-4}}>
              {currentUserReaction ? (
                <TouchableOpacity onPress={() => onRmvReactionPress()}>
                  <Image
                  source={reactions[currentUserReaction]}
                  style={{height:25, width:25, opacity:0.7}}
                  />
                </TouchableOpacity>
              ) : null}
              <Text style={{fontSize:11.5}}>{numDisplay(item.reactions)}</Text>
            </View>
          </View>
          <View style={styles.reactionsContainer}>
              {!userFollowing && (item.userId != user.uid) ?
                <Animated.View style={{position:'absolute', left: containerWidth-iconSize*1.75, opacity:followOpacity}}>
                  <TouchableOpacity onPress={() => onFollow()}>
                    <Image
                      style={{height: 27, width:34.87, resizeMode:'contain'}}
                      source={require('../assets/reactions/follow.png')}
                      />
                  </TouchableOpacity>
                </Animated.View>
                : null
              }
                
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
  postBottomStyles: {
      height: 45,
      width: windowWidth,
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'row',
  },
  reactionsContainer: {
      height:45,
      width: containerWidth,
      flexDirection:'row',
      alignItems:'center',
  },
  commentsViewReaction: {
    height:45,
    width: windowWidth-containerWidth,
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-evenly',
    borderBottomLeftRadius:8,
    borderBottomRightRadius:8,
    paddingVertical:10
  },
  reactionView: {
      height:iconSize+2,
      width:iconSize+2,
      alignItems:'center',
      justifyContent:'center',
      position:'absolute',
  },
  reaction: {
      height:iconSize,
      width:iconSize
  },
  prev : {
      backgroundColor:'#808285',
      height: iconSize+1,
      width:iconSize+1,
      borderRadius:(iconSize+1)/2,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center'
  },
  commentsView: {
    flexDirection:'column',
    alignItems:'center',
    marginTop:3
  }
})