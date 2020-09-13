import React, { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth'

import { StyleSheet, Text, TextInput, TouchableOpacity, Button, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { RootStackParamList } from '../App'
import { StackNavigationProp } from '@react-navigation/stack'
type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>

type Props = {
  navigation: AuthScreenNavigationProp
}

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const logIn = () => {
    auth().signInWithEmailAndPassword(email, password)
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="always">
        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaaaaa"
          value={email}
          style={styles.authInput}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={value => setEmail(value)}
        />
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
          onPress={() => logIn()}
        >
          <Text style={styles.buttonTitle}>
            Sign In
          </Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={styles.signUpText}>
            Don't have an account? <Text style={styles.signUpLink} onPress={() => navigation.navigate('Register')}>Sign Up</Text>
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
