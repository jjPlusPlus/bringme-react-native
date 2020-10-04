import React, { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth'

import { Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, Button, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { RootStackParamList } from '../../App'
import { StackNavigationProp } from '@react-navigation/stack'
import { t } from 'react-native-tailwindcss'
import styled from 'styled-components/native'

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
      <View style={[t.mT4, t.pL8, t.pR4, t.wFull]}>
        <Image source={require('../../assets/logo.png')} style={[t.objectContain, t.selfEnd, { width: '80%' }]} />
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="always">
        <View style={[t.p4]}>
          <Image source={require('../../assets/nature.png')} style={[t.objectContain, t.selfCenter, { height: 250 } ]} />
          <Text style={[t.p4, t.textCenter]}>
            A fun description about Bring Me here.
          </Text>
        </View>
        <StyledInput
          placeholder="Email"
          placeholderTextColor="#aaaaaa"
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={value => setEmail(value)}
        />
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
          onPress={() => logIn()}
        >
          <StyledButtonText>
            Sign In
          </StyledButtonText>
        </StyledButton>
        <View style={styles.footer}>
          <Text style={styles.signUpText}>
            Don't have an account? <Text style={{color: '#2568EF'}} onPress={() => navigation.navigate('Register')}>Sign Up</Text>
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

// TODO -- review why these styled components need explicit type
const StyledInput: typeof TextInput = styled(TextInput)`
  ${[t.border4, t.m3, t.p4, { borderColor: '#2568EF', borderRadius: 20 }]}
`;

const StyledButton: typeof TouchableOpacity = styled(TouchableOpacity)`
  ${[t.p4, t.m3, { backgroundColor: '#FFE8E7', borderRadius: 20 }]}
`;

const StyledButtonText = styled(Text)`
  ${[t.fontBold,t.pT2, t.textCenter, t.textXl, { color: '#2568EF', fontFamily: 'LuckiestGuy-Regular'}]}
`;