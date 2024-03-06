import React, { FunctionComponent, useState, useEffect } from 'react'
import { SafeAreaView, StyleSheet, Text, View, TextInput } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { Drawer } from 'react-native-drawer-layout'

import { useMatchData } from '../../supabase/MatchUtils'
import { RootStackParamList } from '../../App'

import RoundPlayerView from '../RoundPlayerView'
import RoundLeaderView from '../RoundLeaderView'

import { User, Round } from '../types'

interface Props {
  route: RouteProp<RootStackParamList, 'Match'>
  user: User
}

const Match: FunctionComponent<Props> = (props) => {
  const { user, route } = props
  const room_code = route?.params?.room_code
  const [ matchData, startMatch, leaveMatch, startRound, endRound ] = useMatchData(room_code)
  const [ round, setRound ] = useState<Round | null>(null)
  const [devToolsOpen, setDevToolsOpen] = useState(false)

  // might need to refactor this to better reflect the state of the data
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

  useEffect(() => {
    if (!rounds) { 
      return 
    }
    const currentRound = rounds.find((r:Round) => r.round_index === round_index) || rounds[0]
    setRound(currentRound)
  }, [round_index, rounds])

  if (!matchData) {
    return (
      <View><Text>Loading</Text></View>
    )
  }

  if (!round) {
    return ( <View><Text>Waiting to start game</Text></View> )
  }

  const leader = players.find((player: User) => player.id === round.leader)
  return (
    <>
      <Drawer
        open={devToolsOpen}
        onOpen={() => setDevToolsOpen(true)}
        onClose={() => setDevToolsOpen(false)}
        renderDrawerContent={() => {
          return (
            <SafeAreaView>
              <Text>Room Code: {room_code}</Text>
              <Text>Created by: {host.username}</Text>
              <Text>Match status: {status}</Text>
              <Text>Match started at: TODO</Text>
              <Text>Players: {players.map((player: User) => player.username).join(', ')}</Text>
              <Text>Round: {round.round_index + 1} | #{round.id}</Text>
              <Text>Round Status: {round.status}</Text>
              <Text>Round Word: {round.word}</Text>
              <Text>Started At: {round.started_at || "Not yet"}</Text>
            </SafeAreaView>
          )
        }}
      >
        <SafeAreaView>
          {round.leader === user.id ? (
            <RoundLeaderView 
              round={round} 
              user={user} 
              players={players} 
              startRound={startRound} 
              endRound={endRound}
            />
          ) : (
            <RoundPlayerView
              round={round}
              leader={leader}
              user={user}
            />
          )}
        </SafeAreaView>
      </Drawer>
    </>
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