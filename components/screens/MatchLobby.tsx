import React, { useState, useEffect, FunctionComponent } from 'react'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { StyleSheet, Text, TextInput, View, Alert, Button, TouchableOpacity } from 'react-native'
import { MATCH_STATES } from '../constants'
import { RootStackParamList } from '../../App'
import { styled } from "nativewind"
import { supabase } from '../../supabase/init'
import { useMatchData } from '../../supabase/MatchUtils'
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
  route: RouteProp<RootStackParamList, 'MatchLobby'>
  user: User
}

// TODO: Store this in an environment variable
const MIN_PLAYERS = process.env.EXPO_PUBLIC_MIN_PLAYERS || 3

/* MATCH LOBBY: 
 * Requires a room_code (passed in via route params)
 * If a room_code is not provided, the user is bounced back to the home screen 
 * On component mount, use the room_code to fetch the match data
 * If a match is found, subscribes to realtime match updates and activates the "back" confirmation
 * Subscription pings triggers the app to fetch the match data again
 * Because the subscription payloads aren't the full updated Match object ><
*/

const MatchLobby: FunctionComponent<Props> = (props) => {
  const { user } = props
  const room_code = props?.route?.params?.room_code
  const { matchData, startMatch, leaveMatch } = useMatchData(room_code, user)

  const {
    players,
    host,
    room_code: code
  } = matchData || {}

  const readyToStart = players?.length ? players.length >= MIN_PLAYERS : false
  const isHost = host?.id === user?.id

  useEffect(() => {
    if (!matchData) {
      return
    }

    if (matchData?.status === MATCH_STATES.STARTED) {
      props.navigation.navigate('Match', { room_code: matchData?.room_code })
    }

    /* On component mount, setup "back" confirmation 
     * https://reactnavigation.org/docs/preventing-going-back/
     * Note: added match as a dependency key 
     *  because the match is undefined on the first render
    */
    const beforeRemove = (e: any) => {
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
              leaveMatch(matchData.id, user.id)
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
  }, [matchData])

  const addWagyu = async () => {
    const { data: playerData, error: playerError } = await supabase
      .from('players')
      .insert([
        {
          match_id: matchData.id,
          user_id: '29b79a30-a33e-4a5a-b7a6-89c5e2225370',
        }
      ])
  }
  const addJJLaptop = async () => {

    const { data: playerData, error: playerError } = await supabase
      .from('players')
      .insert([
        {
          match_id: matchData.id,
          user_id: '42ce3231-3e65-44cd-851a-758b0cf9ec6f',
        }
      ])
  }
  const addJJPhone = async () => {
    const { data: playerData, error: playerError } = await supabase
      .from('players')
      .insert([
        {
          match_id: matchData.id,
          user_id: 'b2c35cea-4000-46c9-b619-eeadccf6efff',
        }
      ])
  }

  return matchData ? (
    <View className="bg-white flex-1 pb-8">
      <View className="flex-1">
        <AnnouncementHeader>
          <Text className="pb-1">Invite your friends with the code</Text>
          <Text className="font-lucky text-5xl text-bmBlue uppercase">{code}</Text>
        </AnnouncementHeader>

        <View className="flex-row-reverse flex-wrap justify-between">
          {players && players.map((player: any, i: number) => {
            return (
              <PlayerIcon key={i} name={player.username} index={i} isHost={player.id === host?.id} />
            )
          })}
        </View>
      </View>

      {/* TESTING ONLY  */}
      <TouchableOpacity onPress={addWagyu}>
        <Text>Add Wagyu</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={addJJLaptop}>
        <Text>Add JJ Laptop</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={addJJPhone}>
        <Text>Add JJ Phone</Text>
      </TouchableOpacity>

      {/* If I'm the host, I should be able to start the match if all of the players are present */}
      {
        matchData?.status !== MATCH_STATES.STARTED && (
          <StyledButton
            onPress={startMatch}
            disabled={!isHost || matchData?.players?.length < 3}
          >
            <StyledButtonText>
              {
                readyToStart ?
                  isHost ?
                    "Start Match"
                    : "Waiting for Host..."
                  : "Waiting for Players..."
              }
            </StyledButtonText>
          </StyledButton>
        )
      }

      {/* 
        If the match is started and I somehow managed to get here 
        AND the useEffect didn't already re-route me
      */}
      {
        matchData?.status === MATCH_STATES.STARTED && (
          <Button
            onPress={() => props.navigation.navigate('Match', { room_code: matchData?.room_code })}
            title="Enter Match"
          />
        )
      }

    </View >
  ) : (
    <View style={styles.container}>
      {/* Match not found */}
      <Text>LOADING MATCH</Text>
    </View>
  )
}

export default MatchLobby

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
const StyledButton = styled(
  TouchableOpacity,
  'bg-bmBlue disabled:bg-gray-400 items-center mx-4 p-4 pb-2 rounded-[20px] text-4xl '
)
const StyledButtonText = styled(Text, 'font-lucky text-3xl text-white')

