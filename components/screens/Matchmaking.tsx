import React, { useState, useEffect, FunctionComponent } from 'react'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { StyleSheet, Text, TextInput, View, Alert, Button } from 'react-native'
import { MATCH_STATES } from './constants'
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
  route: RouteProp<RootStackParamList, 'Matchmaking'>
  user: User
}

const Matchmaking: FunctionComponent<Props> = (props) => {
  const { user } = props
  const [room_code, setRoomCode] = useState<string | undefined>(() => props?.route?.params?.room_code || undefined)
  const [match, setMatch] = useState<Match>()
  const [roomCodeInput, setRoomCodeInput] = useState<string>('')

  // On component mount, Remove players from the match if they back out of the lobby
  useEffect(() => {
    props.navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()
      Alert.alert(
        'Leave the Lobby?',
        'Going back will remove you from this match',
        [
          { text: "Don't leave", style: 'cancel', onPress: () => { } },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => {
              props.navigation.dispatch(e.data.action)    
            },
          },
        ]
      )
    })
  }, [])

  // If the room code changed, get the match data
  useEffect(() => {
    if (room_code) {
      getMatchData()
    }
  }, [room_code])

  // If the match changed, subscribe to updates
  useEffect(() => {
    if (match) {
      subscribeToMatchUpdates()
    }
  }, [match])

  const getMatchData = async () => {
    if (!room_code) {
      return
    }
    let { data: matchData, error: matchError } = await supabase
      .from('matches')
      .select(`
        id,
        room_code,
        status,
        players:users!players ( id, username )
      `)
      .eq('room_code', room_code)
      .single()

    let { data: hostData, error: hostError } = await supabase
      .from('matches')
      .select(`
        host:users!matches_host_fkey ( id, username )
      `)
      .eq('room_code', room_code)
      .single()
    
    if (matchError || !matchData || hostError || !hostData?.host) {
      // TODO: Actually handle the error
      // Possibly re-route to Home and show an error message?
      console.log('getMatchData match error: ', matchError)
      console.log('getMatchData host error: ', hostError)
    } else {      
      // Overwrite the matchData with the host query response
      setMatch({
        ...matchData,
        status: matchData?.status || MATCH_STATES.MATCHMAKING,
        host: hostData?.host
      })
    }
  }

  const subscribeToMatchUpdates = async () => {
    console.log('subscribing to match updates')
    if (match) {
      supabase
        .channel(`matches:${match.id}`)
        .on(
          'postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'matches',
            filter: `id=eq.${match.id}` 
          }, handleMatchUpdates
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'players',
            filter: `match_id=eq.${match.id}` 
          }, handleMatchUpdates
        )
        .subscribe((status, err) => {
          if (status) {
            console.log('match status: ', status)
          } else {
            console.log(err)
          }
        })
    }
  }

  const handleMatchUpdates = (payload: any) => {
    getMatchData()
  }

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
      alert(error.message)
      return
    }
    // if match successfully joined, navigate to MatchLobby
    setRoomCode(data.room_code)
  }

  const startMatch = () => {

  }

  const MIN_PLAYERS = 2
  const { players, host, room_code:code } = match || {}
  const isHost = host?.id === user?.id
  const readyToStart = players?.length ? players.length >= MIN_PLAYERS : false

  return match ? (
    <View style={styles.container}>
      <Text>Room Code: {code}</Text>
      <Text>Hosted By: {host?.username}</Text>
      <Text>Status: {match?.status || "Created"}</Text>

      <Text>Players</Text>
      {players && players.map((player:any, i) => {
        return (
          <Text key={i}>{i + 1}. {player.username}</Text>
        )
      })}

      {/* If I'm the host, I should be able to start the match if all of the players are present */}
      {match?.status !== MATCH_STATES.STARTED && (
        <Button 
          onPress={startMatch} 
          disabled={!isHost || match?.players?.length !== 2} 
          title={
            readyToStart ? 
              isHost ? 
                "Start Match" 
                : "Waiting for Host" 
              : "Waiting for Players"
          } 
        />
      )}

      {/* If the match is started and I somehow managed to get here AND the useEffect didn't already re-route me*/}
      {match?.status === MATCH_STATES.STARTED && (
        <Button 
          onPress={() => props.navigation.navigate('Match', { matchId: match?.id })} 
          title="Enter Match" 
        />
      )}
      
    </View>
  ) : (
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

export default Matchmaking

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
const StyledInput = styled(TextInput, 'border-bmBlue border-4 my-2 p-4 rounded-[20px] text-black w-full');

