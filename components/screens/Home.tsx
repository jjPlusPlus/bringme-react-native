import React, { useState, useEffect } from 'react'

import { Button, Image, TouchableOpacity, StyleSheet, Text, View,} from 'react-native'

import firestore from '@react-native-firebase/firestore'

import { t } from 'react-native-tailwindcss';
import styled from 'styled-components/native';

interface User {
  name: string,
  uid: string,
  email: string
}

export default function Home(props:any) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    firestore()
      .collection('users')
      .where('user', '==', props.user.uid)
      .get()
      .then(querySnapshot => {
        return setUser(querySnapshot.docs[0].data())
      })
  }, [props.user])

  return (
    <View style={styles.container}>
      <Text>Bring Me</Text>
      <Text>{user?.name || "..."}</Text>

      <Button onPress={() => props.navigation.navigate('Multiplayer')} title="Multi Player" />
      <Button onPress={() => props.navigation.navigate('Match')} title="Single Player" />
      <Button onPress={() => props.navigation.navigate('Settings')} title="Settings" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
})

const StyledButton = styled(TouchableOpacity)`
  ${[t.justifyCenter, t.h20, t.p4, t.mY2, { backgroundColor: '#FFE8E7', borderTopRightRadius: 20, borderBottomRightRadius: 20}]}
`;

const StyledButtonText = styled(Text)`
  ${[t.fontBold,t.pT2, t.text3xl, { color: '#2568EF', fontFamily: 'LuckiestGuy-Regular'}]}
`;