import React, { useState, useEffect, FunctionComponent } from 'react'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { StyleSheet, Text, TextInput, View, Alert, Button, TouchableOpacity } from 'react-native'
import { MATCH_STATES } from './constants'
import { RootStackParamList } from '../../App'
import { styled } from "nativewind"
import { supabase } from '../../supabase/init'

import AnnouncementHeader from '../AnnouncementHeader'
import PlayerIcon from '../PlayerIcon'

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

  // On component mount, setup "back" confirmation https://reactnavigation.org/docs/preventing-going-back/
  useEffect(() => {
    const beforeRemove = (e:any) => {
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
              if (!match) {
                // TODO: show the user an error; maybe try to re-fetch the match?
                return
              }
              leaveMatch(match.id, user.id)
              props.navigation.dispatch(e.data.action)    
            },
          },
        ]
      )
    }
    props.navigation.addListener('beforeRemove', beforeRemove)
    return () => {
      props.navigation.removeListener('beforeRemove', beforeRemove)
    }
  }, [match])

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
        players:users!players ( id, username ),
        host:users!matches_host_fkey ( id, username )
      `)
      .eq('room_code', room_code)
      .single()

    if (matchError || !matchData) {
      // TODO: Actually handle the error
      // Possibly re-route to Home and show an error message?
      console.log('getMatchData match error: ', matchError)
    } else {
      // Overwrite the matchData with the host query response
      setMatch({
        ...matchData,
        status: matchData.status || MATCH_STATES.MATCHMAKING,
        host: matchData.host || { id: '', username: null }
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
          }, getMatchData
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'players',
            filter: `match_id=eq.${match.id}` 
          }, getMatchData
        )
        .subscribe((status, err) => {
          if (status) {
            console.log('match status: ', status)
          } else if (err) {
            console.log('error subscribing to match updates: ', err.message)
          }
        })
    }
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

  const leaveMatch = async (match_id: string, user_id: string) => {
    if (!match_id || !user_id) {
      return
    }
    const { error } = await supabase.functions.invoke('leave-match', {
      body: { 
        user: user_id, 
        match: match_id
      },
    })
    // if USER fails to leave the match, show an error message
    if (error?.message) {
      alert(error.message)
      return
    }
    // removing the room code should successfully boot the user back to the lobby
    setRoomCode(undefined)
    supabase.removeAllChannels()
    // WARNING: this could double-up on the onRemove listener
    props.navigation.navigate('Home')
  }

  const startMatch = () => {

  }

  const MIN_PLAYERS = 2
  const { players, host, room_code: code } = match || {}
  const readyToStart = players?.length ? players.length >= MIN_PLAYERS : false
  const isHost = host?.id === user?.id

  return match ? (
    <View className="bg-white flex-1 pb-8">
      <View className="flex-1">
        <AnnouncementHeader>
          <Text className="pb-1">Invite your friends with the code</Text>
          <Text className="font-lucky text-5xl text-bmBlue uppercase">{code}</Text>
        </AnnouncementHeader>

        <View className="flex-row-reverse flex-wrap justify-between">
          {players && players.map((player: any, i) => {
            return (
              <PlayerIcon key={i} name={player.username} index={i} isHost={player.id === host?.id} />
            )
          })}
        </View>
      </View>
      {/* If I'm the host, I should be able to start the match if all of the players are present */}
      {
        match?.status !== MATCH_STATES.STARTED && (
          <StyledButton
            onPress={startMatch}
            disabled={!isHost || match?.players?.length !== 2}
          >
            <StyledButtonText>
              {
                readyToStart ?
                  isHost ?
                    "Start Match"
                    : "Waiting for Host"
                  : "Waiting for Players"
              }
            </StyledButtonText>
          </StyledButton>
        )
      }

      {/* If the match is started and I somehow managed to get here AND the useEffect didn't already re-route me*/}
      {
        match?.status === MATCH_STATES.STARTED && (
          <Button
            onPress={() => props.navigation.navigate('Match', { matchId: match?.id })}
            title="Enter Match"
          />
        )
      }

    </View >
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
const StyledInput = styled(TextInput, 'border-bmBlue border-4 my-2 p-4 rounded-[20px] text-black w-full')
const StyledButton = styled(TouchableOpacity, 'bg-bmBlue items-center mx-4 p-4 pb-2 rounded-[20px] text-4xl')
const StyledButtonText = styled(Text, 'font-lucky text-3xl text-white')

