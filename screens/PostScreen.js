import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import {
  InputField,
  InputWrapper,
  AddImage,
  SubmitBtn,
  SubmitBtnText,
  StatusWrapper,
} from '../styles/AddPost';

import { AuthContext } from '../navigation/AuthProvider';
import { windowWidth } from '../utils/Dimentions';

const AddPostScreen = () => {
  const {user, logout} = useContext(AuthContext);

  const [image, setImage] = useState(null);
  const [imgDims, setImgDims] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth:640,
      compressImageMaxHeight:768,
      cropping: true,
      freeStyleCropEnabled:true,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      const {cropRect} = image;
      const ImgDimensions = {width: cropRect.width, height: cropRect.height};
      setImage(imageUri);
      setImgDims(ImgDimensions);
      console.log("Image Dimensions: ", imgDims);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth:640,
      compressImageMaxHeight:768,
      cropping: true,
      freeStyleCropEnabled:true,
      compressImageQuality:0.8,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      const {cropRect} = image;
      const ImgDimensions = {width: cropRect.width, height: cropRect.height};
      setImage(imageUri);
      setImgDims(ImgDimensions);
      console.log("Image Dimensions: ", imgDims);
    });
  };

  const submitPost = async () => {
    const imageUrl = await uploadImage();
    console.log('Image Url: ', imageUrl);
    console.log('Post: ', post);

    firestore()
    .collection('posts')
    // .doc(user.uid)
    // .collection('userPosts')
    .add({
      userId: user.uid,
      post: post,
      postImg: imageUrl,
      postTime: firestore.Timestamp.fromDate(new Date()),
      likes: null,
      comments: null,
      ImgDimensions:imgDims,
    })
    .then(() => {
      console.log('Post Added!');
      Alert.alert(
        'Post published!',
        'Your post has been published Successfully!',
      );
      setPost(null);
    })
    .catch((error) => {
      console.log('Something went wrong with added post to firestore.', error);
    });
  }

  const uploadImage = async () => {
    if( image == null ) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${user.uid}/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);
      setImgDims(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }

  };

  return (
    <View style={styles.container}>
      <InputWrapper>
        {image != null ?
        <AddImage
          source={{uri: image}}
          style={imgDims && {height:(imgDims.height/imgDims.width)*windowWidth, maxHeight:windowWidth*1.2, minHeight:windowWidth*(2/3)}}
        /> : null}

        <InputField
          placeholder="A quoi pensez vous ?"
          multiline
          numberOfLines={4}
          value={post}
          onChangeText={(content) => setPost(content)}
        />
        {uploading ? (
          <StatusWrapper>
            <Text>{transferred} % Completed!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </StatusWrapper>
        ) : (
          <SubmitBtn onPress={() => {
            if (post || image){
              submitPost();
            }
            }}>
            <SubmitBtnText>Post</SubmitBtnText>
          </SubmitBtn>
        )}
      </InputWrapper>
      <ActionButton buttonColor="#2e64e5">
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="Take Photo"
          onPress={takePhotoFromCamera}>
          <Icon name="camera-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title="Choose Photo"
          onPress={choosePhotoFromLibrary}>
          <Icon name="md-images-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </View>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 24,
    height: 27,
    color: 'white',
  },
});
