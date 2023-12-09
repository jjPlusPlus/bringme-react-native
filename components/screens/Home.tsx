import React, { useState, useEffect, FunctionComponent } from 'react'
import { supabase } from '../../supabase/init'
import { Button, Image, TouchableOpacity, StyleSheet, Text, View, } from 'react-native'
import { styled } from 'nativewind'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../App'

interface User {
  id: string
  username: string
  email: string
  auth_uuid: string
  created_at: string
  updated_at: string
}
interface Props {
  navigation: StackNavigationProp<RootStackParamList>
  user: User
}

const Home: FunctionComponent<Props> = (props) => {
  const { user } = props

  const createMatch = async () => {
    // send request to server to create a new Match
    // TODO: show a loading state here
    const { data, error } = await supabase.functions.invoke('create-match', {
      body: { user: user },
    })
    console.log('in createMatch: ', data, error)
    // if match creation fails, show an error message
    if (error?.message) {
      alert(error.message)
      return
    }
    // if match successfully created, navigate to MatchLobby
    props.navigation.navigate('MatchLobby', { room_code: data.room_code })
  }

  return (
    <View className="bg-white flex-1 items-center">
      <View className="mt-4 pl-8 pr-4 w-full">
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: '80%' }}
          className="self-end"
          resizeMode="contain"
        />
      </View>
      <View className="flex-1 w-full">
        <Image source={require('../../assets/list.png')}
          className="h-[350] w-full"
          resizeMode="contain"
        />
        <View className="p-4">
          <Text className="text-3xl">
            Hey,<Text className="font-bold text-bmOrange"> {user?.username || "..."}</Text>!
          </Text>
        </View>
      </View>
      <View className="mb-8 pr-8 self-start w-full">
        <StyledButton onPress={() => createMatch()}>
          <StyledButtonText>Create a Match</StyledButtonText>
        </StyledButton>
        <StyledButton onPress={() => props.navigation.navigate('JoinMatch')}>
          <StyledButtonText>Join a Match</StyledButtonText>
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

const StyledButton = styled(TouchableOpacity, 'bg-bmPeach h-20  justify-center p-4 my-2 rounded-r-[20px] rounded-l-0 w-full');
const StyledButtonText = styled(Text, 'font-bold font-lucky pt-2 text-bmBlue text-3xl uppercase');