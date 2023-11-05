import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabase/init'

import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { styled } from 'nativewind'
import pen from '../../assets/register.png'

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
          { text: 'OK', onPress: () => navigation.navigate('Login') }
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
    <View className="bg-white flex-1 w-full">
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="always"
      >
        <Image source={pen} className="h-40 m-4 -mt-12 mb-8" resizeMode="contain" />
        <StyledInput
          placeholder="Username"
          placeholderTextColor="#aaaaaa"
          value={username}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={value => setUsername(value)}
        />
        {error.userName && (
          <StyledErrorText>{error.userName}</StyledErrorText>
        )}
        <StyledInput
          placeholder="Email"
          placeholderTextColor="#aaaaaa"
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={value => setEmail(value)}
        />
        {error.email && (
          <StyledErrorText>{error.email}</StyledErrorText>
        )}
        <StyledInput
          placeholder="Password"
          placeholderTextColor="#aaaaaa"
          value={password}
          maxLength={15}
          secureTextEntry={true}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={value => setPassword(value)}
        />

        <StyledButton
          onPress={() => register()}
        >
          <StyledButtonText>
            Sign Up
          </StyledButtonText>
        </StyledButton>
        <View className="items-center pt-4">
          <Text className="font-bold text-bmBlue text-xl uppercase" onPress={() => navigation.navigate('Login')}>Sign In</Text>
        </View>
      </KeyboardAwareScrollView >
    </View >
  )

}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 16
  },
})

const StyledInput = styled(TextInput, 'border-bmBlue border-4 my-2 rounded-[20px] p-4');
const StyledButton = styled(TouchableOpacity, 'bg-bmBlue items-center justify-center mb-1 mt-4 p-3 rounded-[20px] w-full');
const StyledButtonText = styled(Text, 'font-bold text-center text-xl text-white uppercase');
const StyledErrorText = styled(Text, 'pl-2 text-red-600')