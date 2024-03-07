import React, { useState, useEffect } from 'react'
import { StyleSheet, Linking } from 'react-native'

// import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { Session } from '@supabase/supabase-js'
import { supabase } from './supabase/init'
import { useFonts } from 'expo-font'

import Login from './components/screens/Login'
import Registration from './components/screens/Registration'
import Home from './components/screens/Home'
import Settings from './components/screens/Settings'
import MatchLobby from './components/screens/MatchLobby'
import JoinMatch from './components/screens/JoinMatch'

import Match from './components/screens/Match'

import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});

import { User } from './components/types'

export type RootStackParamList = {
  Login: undefined
  Register: undefined
  Auth: undefined
  Home: undefined
  Settings: undefined
  JoinMatch: undefined
  MatchLobby: { room_code: string | undefined } | undefined
  Match: { room_code: string } | undefined
}

export default function App() {
  const [loading, setLoading] = useState<boolean>(false)
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const [fontsLoaded] = useFonts({
    'LuckiestGuy-Regular': require('./assets/fonts/LuckiestGuy-Regular.ttf'),
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      getUserData(session?.user?.id || '')
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      getUserData(session?.user?.id || '')
    })

    /* REDIRECT USERS FROM AUTH PROVIDER LOGIN FLOW */
    Linking.addEventListener('url', (event) => {
      let urlString = event.url
      // This is a hack to convert the returned url to a query string where we can use URLSearchParams
      // See here https://github.com/orgs/supabase/discussions/1717
      if (event.url.includes('authRedirectHandler#')) {
        urlString = event.url.replace(
          'authRedirectHandler#',
          'authRedirectHandler?',
        )
      }
      // This is a hack to convert the returned url to a query string where we can use URLSearchParams
      // ... at some point, the above hack stopped working when Google changed the format of the returned url,
      // so we added this one
      if (event.url.includes('#access_token')) {
        urlString = event.url.replace(
          '#access_token',
          '?access_token',
        )
      }
      let url = new URL(urlString)
      const refreshToken = url.searchParams.get('refresh_token')
      const accessToken = url.searchParams.get('access_token')
      if (accessToken && refreshToken) {
        supabase.auth
          .setSession({
            ...session,
            refresh_token: refreshToken,
            access_token: accessToken,
          })
          .catch(err => console.log({ err }))
      }
    })

    return () => {
      Linking.removeAllListeners('url')
    }
  }, [])

  const getUserData = async (user_id: string) => {
    let { data: users, error } = await supabase
      .from('users')
      .select("*")
      .eq('auth_uuid', user_id)
    if (error || !users) {
      console.log('failed to fetch user data')
    } else {
      setUser(users[0] as User)
    }
  }

  const Stack = createStackNavigator<RootStackParamList>();

  return loading || !fontsLoaded ? (
    null
  ) : (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <>
            <Stack.Screen name="Home" options={{ title: 'Home', headerShown: false }}>
              {(props: any) => <Home {...props} user={user} />}
            </Stack.Screen>

            <Stack.Screen name="Settings" options={{ title: 'Settings' }} >
              {(props: any) => <Settings {...props} user={user} setUser={setUser} />}
            </Stack.Screen>

            <Stack.Screen name="JoinMatch" options={{ title: 'Join Match' }} >
              {(props: any) => <JoinMatch {...props} user={user} />}
            </Stack.Screen>

            <Stack.Screen name="MatchLobby" options={{ title: 'Match Lobby' }} >
              {(props: any) => <MatchLobby {...props} user={user} />}
            </Stack.Screen>

            <Stack.Screen name="Match" options={{ title: 'Match', headerShown: false }} >
              {(props: any) => <Match {...props} user={user} />}
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
