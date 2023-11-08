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
          { text: 'OK', onPress: () => console.log('TODO') } // button with NO onPress function
        ],
        { cancelable: true }
      )
    }
  }
  const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL
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
      <View className="pt-2 pl-8 pr-4 w-full">
        <Image
          source={require('../../assets/logo.png')}
          className="self-end"
          style={{ width: '80%' }}
          resizeMode='contain'
        />
      </View>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always">
        <View className="p-4">
          <Image
            source={require('../../assets/hero.png')}
            resizeMode='contain'
            className="self-center h-[200]"
          />
          <Text className="p-4 text-center">
            A fun description about Bring Me here.
          </Text>
        </View>
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


const StyledInput = styled(TextInput, 'border-bmBlue border-4 m-3 mb-0 p-4 rounded-[20px]');
const StyledButton = styled(TouchableOpacity, 'bg-bmPeach items-center justify-center mx-3 mt-4 p-3 rounded-[20px]');
const StyledButtonText = styled(Text, 'text-bmBlue font-bold text-center text-xl uppercase');