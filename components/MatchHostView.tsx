import React, { FunctionComponent, useState } from 'react'

import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { t } from 'react-native-tailwindcss'

/* This view will receive from props:
 * a reference to the firestore match (for easy updating)
 * setRoundWord [ round (int, key 1-6), word (string) ]
 * startNextRound
 * endMatchEarly 
*/

interface Props {
  match: Match
  host: User
  setRoundWord: (word: string) => void
}
interface ScoreboardProps {
  players: FirestoreMatch["players"]
  host: User
}

const MatchHostView: FunctionComponent<Props> = ({ match, setRoundWord, host }) => {

  const { rounds, players } = match
  const round = rounds[match.round + 1]
  const [word, setWord] = useState("")

  const needsWord = !round?.word

  return (
    <View style={[t.bgWhite, t.flex1, t.itemsCenter, t.mT10, t.p4 ]}>
      <Text style={[t.text4xl, { fontFamily: 'LuckiestGuy-Regular', color: '#2568EF' }]}>Round {match.round + 1}</Text>

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
          <View style={[t.border4, t.itemsCenter, t.p2, t.roundedLg, { borderColor: '#2568EF', borderRadius: 20} ]}>
            <Text style={[t.text2xl]}> { round.word || "..." }</Text>
          </View>
          <Scoreboard players={match.players} host={host}/>

          {/* Show the winner if there is one */}
          { round?.winner && (
            <Text>Winner: {round?.winner.name}</Text>
          )}
        </View>
      )}
    </View>
  )
}

const Scoreboard: FunctionComponent<ScoreboardProps> = ({ host, players } ) => {
  return (
    <View style={[t.pY4]}>
      <Text style={[t.textGray800, t.textXl, { fontFamily: 'LuckiestGuy-Regular'}]}>Players</Text>
      <View style={[t.flexRow, t.flexWrap]}>
        { players?.map(player => {
          return (
            <View style={[t.p1, t.w1_2, t.flexGrow]}>
              <View style={[t.bgRed100, t.p4, t.roundedLg, { minHeight: 250 }]}>
                <Text style={[t.fontBold, t.textLg]}>{player.name}</Text>
                <Text>{player.score ? player.score : "0"}</Text>
                {player.submission ? (
                  <Image 
                    style={[t.h40, t.mY2, t.w32, t.rounded, {
                      resizeMode: 'cover'
                    }]}
                    source={{ 
                      uri: 
                        `data:image/jpg;base64,${player.submission}` 
                    }}
                  />
                ) : (
                  <View>
                    {
                      player.name === host.name ? (
                        <View style={[t.bgRed200, t.h24, t.mY4, t.roundedFull, t.selfCenter, t.w24]}>
                          <Image 
                            source={require('../assets/current-host.png')} 
                            style={[t.objectContain, t.h24, t.w24]} 
                          />
                          <Text style={[t.fontBold, t.pY4, t.uppercase]}>ROUND HOST</Text>
                        </View>
                      ) : (
                        <Image 
                          style={[t.h40, t.mY2, t.w32, t.rounded, {
                            resizeMode: 'contain'
                          }]}
                          source={require('../assets/loading.png')} 
                        />
                      )
                    }
                  </View>
                )}
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default MatchHostView