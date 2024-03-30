import React, { FunctionComponent, useState, useEffect } from 'react'
import { SafeAreaView, StyleSheet, Text, View, TextInput } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { Drawer } from 'react-native-drawer-layout'

import { supabase } from '../../supabase/init'
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
  const { presence, matchData, startRound, acceptSubmission} = useMatchData(room_code, user)
  const [ round, setRound ] = useState<Round | null>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [devToolsOpen, setDevToolsOpen] = useState(false)

  // might need to refactor this to better reflect the state of the data
  const {
    players,
    host,
    rounds,
    round_index,
    status,
    room_code: code
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
    const currentRound = rounds.find((r: Round) => r.round_index === round_index) || rounds[0]
    setRound(currentRound)
  }, [round_index, rounds])

  useEffect(() => {
    if (!round) {
      return
    }
    refetchSubmissions()
    supabase
      .channel(`submissions:${round.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter: `round_id=eq.${round.id}`
        }, refetchSubmissions
      )
      .subscribe((status, err) => {
        if (status) {
          console.log(status, ': subscribed to submission updates')
        } else if (err) {
          console.log('error subscribing to submission updates: ', err.message)
        }
      })
  }, [round])

  const refetchSubmissions = async () => {
    if (!round) {
      return
    }
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        id,
        path,
        base64_image,
        player:users ( id, username )
      `)
      .eq('round_id', round.id)
    if (error) {
      console.log('fetchSubmissions error: ', error)
    } else {
      setSubmissions(data || [])
    }
  }

  if (!matchData) {
    return (
      <View><Text>Loading</Text></View>
    )
  }

  if (!round) {
    return (<View><Text>Waiting to start game</Text></View>)
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
              <Text>Round: {round.round_index + 1} | #{round.id}</Text>
              <Text>Round Status: {round.status}</Text>
              <Text>Round Word: {round.word}</Text>
              <Text>Started At: {round.started_at || "Not yet"}</Text>

              <View>
                <Text>Players:</Text> 
                {players.map((player: User) => {
                  // Online status / connection indicator using Supabase Realtime Presence
                  const isPresent = presence && Object.keys(presence).find((p:string) => p === player.id)
                  // search the rounds array for object where the winner is the current player
                  const points = rounds.reduce((acc: any, round: Round) => {
                    if (round.winner === player.id) {
                      acc += round.points
                    }
                    return acc
                  }, 0)

                  return (
                    <Text key={player.id}>
                      {isPresent ? 'Y' : 'N'} {player.username} {points}
                    </Text>
                  )
                })}
              </View>
            </SafeAreaView>
          )
        }}
      >
        <SafeAreaView className="bg-white flex-1 h-full">
          {round.leader === user.id ? (
            <RoundLeaderView
              round={round}
              user={user}
              players={players}
              room_code={room_code}
              startRound={startRound}
              submissions={submissions}
              acceptSubmission={acceptSubmission}
            />
          ) : (
            <RoundPlayerView
              round={round}
              leader={leader}
              user={user}
              submissions={submissions}
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