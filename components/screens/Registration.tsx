import React, { useState, useEffect } from 'react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

import { StyleSheet, Text, TextInput, TouchableOpacity, Button, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firestore from '@react-native-firebase/firestore'

import { RootStackParamList } from '../App'
import { StackNavigationProp } from '@react-navigation/stack'
type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>

type Props = {
  navigation: AuthScreenNavigationProp
}

export default function Register({ navigation }: Props) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState({})

  useEffect(() => {
    validateUsername()
  }, [username])

  const register = async () => {
    // first, check that the username is unique
    // if it's unique, then try to create the new auth account
    setError({})

    await firestore()
      .collection('users')
      .where('name', '==', username)
      .get()
      .then(querySnapshot => {
        // querySnapshot.empty still true if size is 0...?
        if (querySnapshot.size > 0) {
          return setError({userName: 'That username is taken!'})
        }
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then((user: FirebaseAuthTypes.UserCredential) => {
            // this will automatically send the user to /Lobby
            // now try to connec the auth account to a User record
            firestore()
              .collection('users')
              .add({
                name: username,
                email: email,
                user: user.user.uid,
              } as User)
              .then(() => {
                console.log('User added!')
              }).catch((err) => {
                console.log(err)
                // todo
              })
            console.log('User account created & signed in!')
          })
          .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              setError({email: 'That email address is already in use!'})
            }
            if (error.code === 'auth/invalid-email') {
              setError({email: 'That email address is invalid!'})
            }
          })
      })
  }

  const validateUsername = () => {
    if (username.length < 3) {
      return setError({ userName: "Your username must be at least 3 characters" })
    }
    if (username.match(/[^a-zA-Z0-9]/)) {
      return setError({ userName: "Usernames can only include letters and numbers" })
    }
    return setError({})
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="always">
        <TextInput
          placeholder="Username"
          placeholderTextColor="#aaaaaa"
          value={username}
          style={styles.authInput}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={value => setUsername(value)}
        />
        {error.userName && (
          <Text style={styles.error}>{error.userName}</Text>
        )}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaaaaa"
          value={email}
          style={styles.authInput}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={value => setEmail(value)}
        />
        {error.email && (
          <Text style={styles.error}>{error.email}</Text>
        )}
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaaaaa"
          value={password}
          style={styles.authInput}
          maxLength={15}
          secureTextEntry={true}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={value => setPassword(value)}
        />
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => register()}
        >
          <Text style={styles.buttonTitle}>
            Sign Up
          </Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={styles.signUpText}>
            <Text style={styles.signUpLink} onPress={() => navigation.navigate('Login')}>Sign In</Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#efefef'
  },
  scrollView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  authInput: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16
  },
  error: {
    fontSize: 12,
    color: '#cc2222',
    height: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: "bold"
  },
  footer: {
    marginTop: 20,
    alignItems: 'center'
  },
  signUpText: {
    fontSize: 16,
    color: '#2e2e2d'
  },
  signUpLink: {
    color: "#788eec",
    fontWeight: "bold",
    fontSize: 16
  }
})
