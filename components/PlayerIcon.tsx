import React, { FunctionComponent } from 'react'
import { Image, Text, View } from 'react-native'

import player1 from '../assets/player-1.png'
import player2 from '../assets/player-2.png'
import player3 from '../assets/player-3.png'
import player4 from '../assets/player-4.png'


interface Props {
  name: String;
  index: any;
}

export const PLAYER_IMAGES = [
  { uri: require('../assets/player-1.png') },
  { uri: require('../assets/player-2.png') },
  { uri: require('../assets/player-3.png') },
  { uri: require('../assets/player-4.png') }
]

const PlayerIcon: FunctionComponent<Props> = (props) => {
  const { name, index } = props;
  let imgSource = PLAYER_IMAGES[index].uri;

  return (
    <View className="h-48 relative w-full">
      <Image source={imgSource}></Image>
      <Text>{name}</Text>
    </View>
  )
}

export default PlayerIcon