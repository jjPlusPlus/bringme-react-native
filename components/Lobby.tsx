import React, { useState, useEffect } from 'react'

import { StyleSheet, Text, View, Button } from 'react-native'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'


interface User {
  name: string,
  uid: string,
  email: string
}

export default function Lobby(props:any) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    firestore()
      .collection('users')
      .where('user', '==', props.user.uid)
      .get()
      .then(querySnapshot => {
        console.log(querySnapshot.docs[0].data())
        return setUser(querySnapshot.docs[0].data())
      })
  }, [props.user])
  /* 
    Lobby
    - fetch user information
    - needs slide-out menu
      - user info
      - sign out button
    - 'play online' button
    - single-player mode button
  */ 

  const startMatchmaking = () => {

  }

  const startSinglePlayer = () => {

  }

  return (
    <View style={styles.container}>
      <Text>Bring Me</Text>
      <Text>{user?.name}</Text>
      <Button onPress={startMatchmaking} title="Play Online">Play Online</Button>
      <Button onPress={() => props.navigation.navigate('Match')} title="Single Player">Single Player</Button>
      <Button onPress={() => auth().signOut()} title="Sign Out">Sign Out</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
