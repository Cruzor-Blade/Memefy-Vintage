import React from 'react';
import { View, Text, StyleSheet } from 'react-native'

import { InputWrapper, InputField } from '../styles/AddPost';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

const PostScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Post</Text>
      <InputWrapper>
        <InputField
          placeholder="A quoi pensez vous ?"
          multiline
          numberOfLines={4}
        />
      </InputWrapper>
      <ActionButton buttonColor="rgba(231, 76, 60, 1)" >
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="Prendre une photo"
          onPress={() => console.log("notes tapped !")}
        >
          <Icon name='camera-outline' style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title="Importer..."
          onPress={() => console.log("Import tapped !")}
        >
          <Icon name='md-images-outline' style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </View>
  )
}

export default PostScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  actionButtonIcon:{
    fontSize:24,
    height:27,
    color:"white"
  }
})