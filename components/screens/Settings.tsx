import React, { useState, useEffect } from 'react'

import { StyleSheet, Text, TextInput, View, Button } from 'react-native'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

interface User {
  name: string,
  uid: string,
  email: string
}

export default function Settings(props: any) {
  const [user, setUser] = useState<User | null>(null)
  const [userName, setUsername] = useState('')
  useEffect(() => {
    // get the full current user document
    firestore()
      .collection('users')
      .where('user', '==', props.user.uid)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot) {
          return console.error('users query failed')
        }
        const data = querySnapshot.docs[0].data()
        const withId = {
          ...data,
          id: querySnapshot.docs[0].id
        }
        setUsername(data.name)
        return setUser(withId)
      })
  }, [])

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
