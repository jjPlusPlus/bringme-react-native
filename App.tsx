import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';

import React, { useState, useEffect } from 'react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'

import Lobby from './components/Lobby'
import Match from './components/Match'
import Login from './components/Login'
import Registration from './components/Registration'

export type RootStackParamList = {
  Login: undefined
  Register: undefined
  Auth: undefined
  Lobby: undefined
  Match: undefined
};

export default function App() {
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)

  useEffect(() => {
    auth().onAuthStateChanged(userState => {
      setUser(userState)
      if (loading) {
        setLoading(false)
      }
    })
  }, [])

  const Stack = createStackNavigator<RootStackParamList>();

  return loading ? (
    null
  ) : (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <>
            <Stack.Screen name="Lobby" options={{ title: 'Lobby' }}>
              {props => <Lobby {...props} user={user}/>}
            </Stack.Screen>
            <Stack.Screen name="Match" component={Match} options={{ title: 'Match' }} />
          </>
        ) : (
          // <Stack.Screen name="Auth" component={Auth} options={{ title: 'Sign In' }} />
          <>
            <Stack.Screen name="Login" component={Login} options={{ title: 'Sign In' }} />
            <Stack.Screen name="Register" component={Registration} options={{ title: 'Sign Up' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
