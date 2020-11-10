import React, { FunctionComponent, useState } from 'react'

import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { t } from 'react-native-tailwindcss'

/* This view will receive from props:
 * a reference to the firestore match (for easy updating)
 * setRoundWord [ round (int, key 1-6), word (string) ]
 * startNextRound
 * endMatchEarly 
*/

interface Props {
  match: Match
  setRoundWord: (word: string) => void
}
interface ScoreboardProps {
  players: FirestoreMatch["players"]
}

const MatchHostView: FunctionComponent<Props> = ({ match, setRoundWord }) => {

  const { rounds, players } = match
  const round = rounds[match.round + 1]
  const [word, setWord] = useState("")

  const needsWord = !round?.word

  return (
    <View style={[t.bgWhite, t.flex1, t.itemsCenter, t.justifyCenter, t.mT10, t.p4 ]}>
      <Text style={[t.text2xl, { fontFamily: 'LuckiestGuy-Regular', color: '#2568EF' }]}>Round {match.round + 1}</Text>

      {needsWord ? (
        <>
          <TextInput
            style={[t.bgGray200, t.m3, t.p4, t.roundedLg, t.wFull]}
            placeholder="The next word will be..."
            onChangeText={text => {
              setWord(text)
            }}
            defaultValue={word}
          />
          <TouchableOpacity style={[t.p2, t.roundedLg, t.m3, t.w1_2, { backgroundColor: '#FFE8E7'}]} onPress={() => setRoundWord(word)}>
            <Text style={[t.fontBold,t.pT2, t.textCenter, t.textXl, { color: '#2568EF', fontFamily: 'LuckiestGuy-Regular'}]}>Set</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View>
          <Text>Word: { round.word || "..." }</Text>
          <Scoreboard players={match.players}/>

          {/* Show the winner if there is one */}
          { round?.winner && (
            <Text>Winner: {round?.winner.name}</Text>
          )}
        </View>
      )}
    </View>
  )
}

const Scoreboard: FunctionComponent<ScoreboardProps> = ( { players } ) => {
  return (
    <View>
      <Text>Scoreboard</Text>
      { players?.map(player => (
        <View style={[t.flexRow]}>
          <Text>{player.name}</Text>
          <Text>{player.score ? player.score : "0"}</Text>
        </View>
      ))}
    </View>
  )
}

export default MatchHostView