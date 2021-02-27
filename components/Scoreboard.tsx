
import React, { FunctionComponent, useState } from 'react'

import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { t } from 'react-native-tailwindcss'

interface ScoreboardProps {
  players: FirestoreMatch["players"]
  host: User
}

const Scoreboard: FunctionComponent<ScoreboardProps> = ({ host, players } ) => {
  return (
    <View style={[t.pY4]}>
      <Text style={[t.textGray800, t.textXl, { fontFamily: 'LuckiestGuy-Regular'}]}>Players</Text>
      <View style={[t.flexRow, t.flexWrap]}>
        { players?.map(player => {
          return (
            <View style={[t.p1, t.w1_2, t.flexGrow]} key={player.id}>
              <View style={[t.bgRed100, t.p4, t.roundedLg, { minHeight: 250 }]}>
                <Text style={[t.fontBold, t.textXs]}>{player.name}</Text>
                <Text style={[t.textXs]}>{player.score ? player.score : "0"} Points</Text>
                {player.submission ? (
                  <Image 
                    style={[t.h40, t.mY2, t.wFull, t.rounded, {
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
                          style={[t.h40, t.mY2, t.wFull, t.rounded, {
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

export default Scoreboard