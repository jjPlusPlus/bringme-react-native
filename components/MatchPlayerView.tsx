import React, { FunctionComponent, useState, useRef } from 'react'

import { StyleSheet, View } from 'react-native'
import { t } from 'react-native-tailwindcss'


const MatchPlayerView: FunctionComponent<> = () => {

  return (
    <View style={[t.flex1, t.flexCol]}>

    </View>
  )
}

export default MatchPlayerView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  }
})
