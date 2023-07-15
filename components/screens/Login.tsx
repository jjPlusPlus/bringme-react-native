import React, { useState } from 'react'
import { supabase } from '../../supabase/init'

import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Linking } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { RootStackParamList } from '../../App'
import { StackNavigationProp } from '@react-navigation/stack'
import { styled } from "nativewind"

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>

type Props = {
  navigation: AuthScreenNavigationProp
}

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, isLoading] = useState(false)

  const logIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      //function to make simple alert
      Alert.alert(
        'Login failed', // alert title
        error.message, // alert body
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') } // button with NO onPress function
        ],
        { cancelable: true }
      )
    }
  }
  const SUPABASE_URL = 'https://sbpcfajrdufyvkfirvnx.supabase.co'
  const googleAuthUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=myapp://auth`
  const signInWithGoogle = async () => {
    /*
      // The path recommended by Supabase; does not work in React Native
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
    */

    // Redirect the user to the OAuth provider
    Linking.openURL(googleAuthUrl)
  }

  return (
    <View style={styles.container}>
      <View className="mt-4 pr-4 w-full">
        <Image
          source={require('../../assets/logo.png')}
          className="object-contain self-end w-[250px]"
          resizeMode="contain"
        />
      </View>
      <KeyboardAwareScrollView
        className="flex-1"
        keyboardShouldPersistTaps="always"
      >
        <View className="p-4">
          <Image
            source={require('../../assets/hero.png')}
            className="self-center h-[250px]"
            resizeMode="contain"
          />
        </View>
        <View className="gap-6 p-2">
          <StyledInput
            placeholder="Email"
            placeholderTextColor="#aaaaaa"
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            disabled={loading}
            onChangeText={(value: string) => setEmail(value)}
          />
          <StyledInput
            placeholder="Password"
            placeholderTextColor="#aaaaaa"
            value={password}
            maxLength={15}
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            disabled={loading}
            onChangeText={(value: string) => setPassword(value)}
          />
        </View>
        <View className="gap-3 p-3">
          <StyledButton
            onPress={() => logIn()}
            disabled={loading}
          >
            <StyledButtonText>
              Sign In
            </StyledButtonText>
          </StyledButton>

          <StyledButton
            onPress={() => signInWithGoogle()}
            disabled={loading}
          >
            <StyledButtonText>
              Sign In With Google
            </StyledButtonText>
          </StyledButton>
        </View>
        <View style={styles.footer}>
          <Text style={styles.signUpText}>
            Don't have an account? <Text style={{ color: '#2568EF' }} onPress={() => navigation.navigate('Register')}>Sign Up</Text>
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
    backgroundColor: '#fff'
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

const StyledInput = styled(TextInput, 'border-bmBlue border-4 rounded-[20px] p-4');
const StyledButton = styled(TouchableOpacity, 'bg-bmPeach p-3 rounded-[20px]');
const StyledButtonText = styled(Text, 'color-bmBlue font-bold pt-2 text-center text-xl uppercase');