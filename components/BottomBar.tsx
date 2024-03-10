import React, { FunctionComponent } from 'react'
import { Image, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'


interface Props {
  children: any;
}

const AnnouncementHeader: FunctionComponent<Props> = (props) => {
  const { children } = props;

  return (
    <View className="bg-bmPeach flex-row h-16 items-center justify-between px-4 relative w-full">
      <Feather name="menu" size={36} color="#2567EE" />
      {children}
    </View>
  )
}

export default AnnouncementHeader