import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabase/init'

import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { RootStackParamList } from '../../App'
import { StackNavigationProp } from '@react-navigation/stack'
type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>

type Props = {
  navigation: AuthScreenNavigationProp
}

export default function Register({ navigation }: Props) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<{ [field: string]: string | undefined }>({})

  useEffect(() => {
    validateUsername()
  }, [username])

  const register = async () => {
    // first, check that the username is unique
    // before trying to create the new auth account
    setError({})
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      return Alert.alert(
        'Login failed', // alert title
        error.message, // alert body
        [
          { text: 'OK', onPress: () => console.log('TODO') }
        ],
        { cancelable: true }
      )
    } else {
      // add user record (email and auth ID) to the supabase database
      const addUser = await supabase.from('Users').insert([
        { username: username, email: email, auth_uuid: data?.user?.id }
      ])
      
      return Alert.alert(
        'Success', // alert title
        'Please check your email to verify your account before logging in', // alert body
        [
          { text: 'OK', onPress: () => navigation.navigate('Login')}
        ],
        { cancelable: true }
      )
    }
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
