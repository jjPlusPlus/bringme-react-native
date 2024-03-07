import React, { FunctionComponent, useState, useEffect } from 'react'
import { Text, View, Image, TextInput } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import useTimeRemaining from '../utils/useTimeRemaining'
import { supabase } from '../supabase/init'
import { useMatchData } from '../supabase/MatchUtils'

import { User, Round } from './types'

interface Props {
  user: User
  round: Round
  players: User[]
  room_code?: string
  startRound: (round: Round, word: string) => void
  acceptSubmission: (round: Round, player: User) => void
}

const RoundLeaderView: FunctionComponent<Props> = (props) => {
  const { user, round, players, room_code, startRound, acceptSubmission } = props
  const [ roundWord, setRoundWord ] = useState<string>('')
  // const {
  //   startRound, 
  //   acceptSubmission
  // } = useMatchData(room_code)

  return (
    <View className="flex h-full">
      <Text>You're the Leader of this Round!</Text>
      {round.status === 'IN_PROGRESS' ? (
        <>
          <MaterialIcons name="timer" size={24} color="black" />
          <RoundTimer round={round}/>
          
          <Text>The players will bring you: {round.word}</Text>
          
          <Players players={players} acceptSubmission={acceptSubmission} round={round} user={user}/>
        </>
      ) : (
        <>
          <Text>What do you want the other players to bring you this round?</Text>
          <TextInput
            placeholder="........................."
            onChangeText={(text) => {
              // handle text input change
              setRoundWord(text)
            }}
            value={roundWord}
          />
          <TouchableOpacity
            onPress={() => startRound(round, roundWord)}
          >
            <Text>Start Round</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

const RoundTimer = (props: any) => {
  const { round } = props
  const remaining_time = useTimeRemaining(round.started_at, round.time)
  return (
    <View>
      <Text>Time Remaining: {remaining_time}</Text>
    </View>
  )
}

const Players = (props: any) => {
  const { user, players, acceptSubmission, round } = props
  const [submissions, setSubmissions] = useState<any[]>([])

  useEffect(() => {
    // get all submissions, and then subscribe to submissions
    refetchSubmissions()
    // subscribe to submissions
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
  }, [])

  const refetchSubmissions = async () => {
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

  /*
    // This is how we would get the image from the storage bucket
    const path = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/submissions/${submission.path}`
  */

  return (
    <View>
      <Text>Players</Text>
      {/* Show each of the other player's */}
      {players.map((player: User) => {

        if (player.id === user.id) { return }

        const submission = submissions.find((s:any) => s.player.id === player.id)

        return (
          <View key={player.id}>
            <Text>{player.username}</Text>
            {submission ? (
              <View>
                <Image 
                  source={{ 
                    uri: `data:image/jpeg;base64,${submission.base64_image}`
                  }} 
                  width={200} 
                  height={200} 
                />
              </View>
            ) : (
              <Text>Not Submitted</Text>
            )}
            <TouchableOpacity
              onPress={() => {
                // set the round winner
                acceptSubmission(round, player)
              }}
            >
              <Text>Accept</Text>
            </TouchableOpacity>
          </View>
        )
      })}
    </View>
  )
}


export default RoundLeaderView