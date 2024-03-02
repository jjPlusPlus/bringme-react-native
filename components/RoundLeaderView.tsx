import React, { FunctionComponent, useState } from 'react'
import { Text, View, TextInput } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import useTimeRemaining from '../utils/useTimeRemaining'

import { User, Round } from './types'

interface Props {
  user: User
  round: Round
  players: User[]
  startRound: (round: Round, word: string) => void
  endRound: (round: Round, player: User) => void
}

const RoundLeaderView: FunctionComponent<Props> = (props) => {
  const { user, round, players, startRound, endRound } = props
  const remaining_time = useTimeRemaining(round.started_at, round.time)

  const [ roundWord, setRoundWord ] = useState<string>('')
  return (
    <View className="flex h-full">
      <Text>You're the Leader of this Round!</Text>
      {round.status === 'IN_PROGRESS' ? (
        <>
          <MaterialIcons name="timer" size={24} color="black" />
          <Text>Time Remaining: {remaining_time}</Text>
          <Text>The players will bring you: {round.word}</Text>
          {/* Show each of the other player's */}
          {players.map((player: User) => {
            if (player.id === user.id) { return }
            return (
              <View key={player.id}>
                <Text>{player.username}</Text>
                <TouchableOpacity
                  onPress={() => {
                    // set the round winner
                    endRound(round, player)
                  }}
                >
                  <Text>Accept</Text>
                </TouchableOpacity>
              </View>
            )
          })}
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

export default RoundLeaderView