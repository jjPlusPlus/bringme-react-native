import React, { useState, FunctionComponent } from 'react'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { StyleSheet, Text, TextInput, View, Alert, Button } from 'react-native'
import { RootStackParamList } from '../../App'
import { styled } from "nativewind"
import { supabase } from '../../supabase/init'

interface User {
  id: string
  username: string | null
}
interface Match {
  id: string
  room_code: string
  status: string
  players: User[]
  host: User
}
interface Props {
  navigation: StackNavigationProp<RootStackParamList>
  route: RouteProp<RootStackParamList, 'MatchLobby'>
  user: User
}

const JoinMatch: FunctionComponent<Props> = (props) => {
  const { user } = props
  const [roomCodeInput, setRoomCodeInput] = useState<string>('')

  /* ACTION HANDLERS */
  const joinMatch = async () => {
    const { data, error } = await supabase.functions.invoke('join-match', {
      body: { 
        user: user, 
        room_code: roomCodeInput
      },
    })
    // if match creation fails, show an error message
    if (error?.message) {
      console.log(error)
      alert(error.message)
      return
    }
    // if match successfully joined, navigate to MatchLobby
    props.navigation.navigate('MatchLobby', { room_code: data.room_code })
  }

  return (
    <View style={styles.container}>
      {/* Match not found. Give the user the opportunity to JOIN a match */}
      <Text>Enter your Room Code to join</Text>
      <StyledInput
        onChangeText={text => {
          setRoomCodeInput(text)
        }}
      />
      <Button 
        onPress={() => joinMatch()} 
        title="Join" 
      />
    </View>
  )
}

export default JoinMatch

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
const StyledInput = styled(TextInput, 'border-bmBlue border-4 my-2 p-4 rounded-[20px] text-black w-full')

