import React, { FunctionComponent } from 'react'
import { Image, Text, View } from 'react-native'

import crown from '../assets/crown.png'

interface Props {
  name?: String;
  index: any;
}

export const PLAYER_IMAGES = [
  { uri: require('../assets/player-1.png'), color: 'bg-[#f19f3f]' },
  { uri: require('../assets/player-2.png'), color: 'bg-[#eebebb]' },
  { uri: require('../assets/player-3.png'), color: 'bg-[#fbe9e7]' },
  { uri: require('../assets/player-4.png'), color: 'bg-[#F7D2A2]' }
]

const PlayerIcon: FunctionComponent<Props> = (props) => {
  const { name, index } = props;
  let imgSource = PLAYER_IMAGES[index].uri;
  const even = index % 2 == 0;
  let gridPosition = even ? 'py-2' : 'mt-8 mb-4';
  let position = even ? 'translate-x-4' : '-translate-x-4';
  let roundedness = even ? 'rounded-l-2xl' : 'rounded-r-2xl';
  let translate = even ? 'translate-x-4' : '-translate-x-2';

  return (
    <View className={`${gridPosition} h-40 items-center justify-center relative w-1/2`}>
      {index === 0 &&
        <Image className="self-start transform -translate-x-6 translate-y-1" source={crown} />
      }
      <Image source={imgSource} resizeMode="contain" className="h-full w-full"></Image>
      <View className={`absolute ${PLAYER_IMAGES[index].color} self-center w-full h-3/4 ${roundedness} ${position} -z-10`} />
      <View className={`bg-blue-200 px-4 py-0 rounded absolute bottom-3 transform ${translate}`}>
        <Text className="font-bold lowercase text-bmBlue text-lg">{name}</Text>
      </View>
    </View>
  )
}

export default PlayerIcon