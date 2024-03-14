import React, { FunctionComponent, useState, useEffect } from 'react'
import { Text, View, Image, TextInput } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import useTimeRemaining from '../utils/useTimeRemaining'
import { supabase } from '../supabase/init'
import { useMatchData } from '../supabase/MatchUtils'

import AnnouncementHeader from './AnnouncementHeader'

import divider from '../assets/divider.png'
import loading from '../assets/loading.png'

import { User, Round } from './types'
import { styled } from 'nativewind'

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
  const [roundWord, setRoundWord] = useState<string>('')

  return (
    <View className="bg-white flex h-full p-4">
      <AnnouncementHeader>
        <View>
          <Text className="font-lucky text-3xl text-bmBlue uppercase">
            {round.status === 'IN_PROGRESS' ? `Bring me...` : `You're the king`}
          </Text>
        </View>
      </AnnouncementHeader>
      {round.status === 'IN_PROGRESS' ? (
        <>
          <View>
            <Image source={divider} />
            <Text className="font-lucky text-4xl mb-4 mt-5 text-center uppercase">{round.word}</Text>
            <Image className="" source={divider} />
          </View>
          <MaterialIcons name="timer" size={24} color="black" />
          <Players players={players} acceptSubmission={acceptSubmission} round={round} user={user} />
        </>
      ) : (
        <View className="my-4">
          <Text className="font-medium text-base">What do you want the others to bring to you?</Text>
          <StyledInput
            placeholder=""
            onChangeText={(text) => {
              // handle text input change
              setRoundWord(text)
            }}
            value={roundWord}
          />
          <StyledButton
            onPress={() => startRound(round, roundWord)}
          >
            <StyledButtonText>Start Round</StyledButtonText>
          </StyledButton>
        </View>
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
  console.log(players)
  return (
    <View className="flex-row flex-wrap">
      <Text>Players</Text>
      {/* Show each of the other player's */}
      {players.map((player: User) => {

        if (player.id === user.id) { return }

        const submission = submissions.find((s: any) => s.player.id === player.id)

        return (
          <View key={player.id} className="items-center gap-4 w-1/2">
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
              <View className="h-36 w-full">
                <View className="bg-bmPeach h-full p-4 relative rounded-[20px] w-full z-10">
                  <Image source={loading} className="h-full w-full" resizeMode="contain" />
                  <View className="absolute bg-bmBlue bottom-[-15px] px-4 py-2 rounded-md self-center">
                    <Text className="font-bold text-center text-sm text-white">{player.username}</Text>
                  </View>
                </View>
                <View className="absolute border border-bmYellow h-36 transform -translate-x-3 -translate-y-3 rounded-[20px] w-full -z-50" />
              </View>
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

const StyledInput = styled(TextInput, 'bg-gray-100 my-2 rounded-[15px] p-4');
const StyledButton = styled(TouchableOpacity, 'bg-bmBlue items-center justify-center mb-1 mt-4 p-3 rounded-[15px] w-full');
const StyledButtonText = styled(Text, 'font-bold font-lucky pt-2 justify-center text-center text-3xl text-white uppercase');

