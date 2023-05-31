
import React, { FunctionComponent, useState, useEffect } from 'react'

import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { t } from 'react-native-tailwindcss'

interface ScoreboardProps {
  round: Round
}

const RoundTimer: FunctionComponent<RoundTimerProps> = ({ round } ) => {
  const [time, setTime] = useState("...")

  useEffect(() => {
    const start = round.started_at
    if (!start || round.status !== 'started') { return }

    let updated
    const timer = setInterval(() => {
      updated = Math.round( (Date.now() - start)/1000 )
      setTime(60 - updated)
      if (60 - updated === 0) {
        clearInterval(timer)
      }
    }, 1000)
  }, [round.started_at])

  return (
    <View style={[t.p1]}>
      <Text>{time}</Text>
    </View>
  )
}

export default RoundTimer