import React, { useState, useEffect } from 'react'

import {Button, Image, StyleSheet, Text, TextInput, View  } from 'react-native'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { t } from 'react-native-tailwindcss'
import styled from 'styled-components/native'

interface User {
  name: string,
  uid: string,
  email: string
}

export default function Settings(props: any) {
  const { user } = props

  const [userName, setUsername] = useState('')
  const [error, setError] = useState({})

  useEffect(() => {
    validateUsername()
  }, [userName])

  const validateUsername = () => {
    if (userName.length < 3) {
      return setError({userName: "Your username must be at least 3 characters"})
    }
    if (userName.match(/[^a-zA-Z0-9]/)) {
      return setError({userName: "Usernames can only include letters and numbers"})
    }
    return setError({})
  }

  const saveUsername = () => {
    if (Object.keys(error).length) {
      return 
    }
    /* Faking uniqueness*/
    firestore()
      .collection('users')
      .where('name', '==', userName)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot) {
          return console.error('update failed while looking for duplicates')
        }
        const existing = querySnapshot.docs.length
        if (existing) {
          return setError({userName: "That username is taken"})
        }
        // if it hasn't been found, update the username
        firestore()
          .collection('users')
          .doc(user.id)
          .update({
            name: userName
          })
          .then(() => {
            console.log('Username updated!');
            // some sort of nice notification here
          });  
      })
  }

  if (!user) {
    return <View style={styles.container}><Text>Error: User Not Found</Text></View>
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={{ height: 40 }}
        placeholder="Username"
        onChangeText={text => {
          setUsername(text)
        }}
        defaultValue={user.name}
      />
      {error.userName && <Text>{error.userName}</Text>}
      <Button onPress={saveUsername} title="Save" />
      <Button onPress={() => auth().signOut().then(() => console.log('User signed out!'))} title="Sign Out" />
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
