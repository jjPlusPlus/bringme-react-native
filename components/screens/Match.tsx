import React, { FunctionComponent, useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { styled } from "nativewind"
import { useMatchData } from '../../supabase/MatchUtils'
import MatchHostView from '../MatchHostView'
import MatchPlayerView from '../MatchPlayerView'
import Scoreboard from '../Scoreboard'
import { RootStackParamList } from '../../App'

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
  route: RouteProp<RootStackParamList, 'Match'>
  user: User
}

const Match: FunctionComponent<Props> = (props) => {
  const { user } = props
  const room_code = props?.route?.params?.room_code
  const [ matchData, startMatch, leaveMatch ] = useMatchData(room_code)

  const { 
    players, 
    host, 
    rounds,
    round_index,
    status,
    room_code:code 
  } = matchData || {}

  // On component mount
  useEffect(() => {
    if (!matchData) {
      return
    } 
    // TODO: handle back action
  }, [matchData])

  if (!matchData) {
    return (
      <View><Text>Loading</Text></View>
    )
  }

  const round = rounds[round_index]
  return round.leader?.id === user.id ? (
    <View>
      <Text>Host View</Text>
    </View>
  ) : (
    <View>
      <Text>Player View</Text>
    </View>
  )
}

export default Match

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})