import React, { useState, useEffect, FunctionComponent } from 'react'

import { Button, Image, TouchableOpacity, StyleSheet, Text, View,} from 'react-native'

import firestore from '@react-native-firebase/firestore'

import { t } from 'react-native-tailwindcss';
import styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

interface Props {
  navigation: StackNavigationProp<RootStackParamList>
  user: User
}

const Home: FunctionComponent<Props> = (props) => {
  const { user } = props

  return (
    <View style={styles.container}>
      <View style={[t.mT4, t.pL8, t.pR4, t.wFull]}>
        <Image source={require('../../assets/logo.png')} style={[t.objectContain, t.selfEnd, { width: '80%' }]} />
      </View>
      <View style={[t.flex1, t.wFull]}>
        <Image source={require('../../assets/list.png')} style={[ t.objectContain, t.wFull, { height: 350 } ]} />
        <View style={[t.p4]}>
          <Text style={[t.text3xl]}>
            Hey,<Text style={[t.fontBold, { color: '#FF564F'} ]}> {user?.name || "..."}</Text>
          </Text>
        </View>
      </View>
      <View style={[t.mB8, t.pR8, t.selfStart, t.wFull]}>
        <StyledButton onPress={() => props.navigation.navigate('Multiplayer')}>
          <StyledButtonText>Multiplayer</StyledButtonText>
        </StyledButton>
        <StyledButton onPress={() => props.navigation.navigate('Match')}>
          <StyledButtonText>Single Player</StyledButtonText>
        </StyledButton>
        <StyledButton onPress={() => props.navigation.navigate('Settings')}>
          <StyledButtonText>Settings</StyledButtonText>
        </StyledButton>
      </View>
    </View>
  )
}

export default Home

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