import React, { FunctionComponent } from 'react'
import { Image, Text, View } from 'react-native'

import hostImage from '../assets/host-says.png'

interface Props {
  children: any;
}

const AnnouncementHeader: FunctionComponent<Props> = (props) => {
  const { children } = props;
  return (
    <View className="h-48 relative w-full">
      <Image
        source={hostImage}
        className="absolute flex-start h-full left-0 top-0 w-full"
        resizeMode="contain"
        resizeMethod="resize"
      />
      <View
        className="h-1/2 items-center justify-center"
        style={{ transform: [{ translateY: 50 }, { translateX: 30 }, { rotateZ: '-12deg' }] }}
      >
        {children}
      </View>
    </View>
  )
}

export default AnnouncementHeader