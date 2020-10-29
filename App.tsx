import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';

import React, { useState, useEffect } from 'react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

import { StyleSheet, Text, View } from 'react-native'

import Login from './components/screens/Login'
import Registration from './components/screens/Registration'
import Home from './components/screens/Home'
import Settings from './components/screens/Settings'
import SinglePlayer from './components/screens/SinglePlayer'
import Multiplayer from './components/screens/Multiplayer'
import Matchmaking from './components/screens/Matchmaking'
import Match from './components/screens/Match'


export type RootStackParamList = {
  Login: undefined
  Register: undefined
  Auth: undefined
  Home: undefined
  Settings: undefined
  SinglePlayer: undefined
  Multiplayer: undefined
  Matchmaking: undefined
  Match: undefined
}

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
            <Stack.Screen name="Home" options={{ title: 'Home', headerShown: false }}>
              {props => <Home {...props} user={user} />}
            </Stack.Screen>

            <Stack.Screen name="Settings" options={{ title: 'Settings' }} >
              {props => <Settings {...props} user={user} />}
            </Stack.Screen>

            <Stack.Screen name="Multiplayer" options={{ title: 'Multiplayer' }} >
              {props => <Multiplayer {...props} user={user} />}
            </Stack.Screen>

            <Stack.Screen name="Matchmaking" options={{ title: 'Matchmaking' }} >
              {props => <Matchmaking {...props} user={user} />}
            </Stack.Screen>

            <Stack.Screen name="Match" options={{ title: 'Match' }} >
              {props => <Match {...props} user={user} />}
            </Stack.Screen>

            <Stack.Screen name="SinglePlayer" options={{ title: 'Single Player' }} >
              {props => <SinglePlayer {...props} user={user} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ title: 'Sign In', headerShown: false }} />
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
