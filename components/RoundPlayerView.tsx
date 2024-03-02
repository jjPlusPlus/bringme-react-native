import React, { FunctionComponent, useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import { Camera, CameraType } from 'expo-camera'
import useTimeRemaining from '../utils/useTimeRemaining'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'

// WebRTC
// import { mediaDevices, RTCView } from 'react-native-webrtc'

import { User, Round } from './types'

interface Props {
  round: Round
  leader: User
}

const RoundPlayerView: FunctionComponent<Props> = (props) => {
  const { round, leader } = props
  const remaining_time = useTimeRemaining(round.started_at, round.time)
  const [hasCameraPermission, setHasCameraPermission] = useState(false)
  const [stream, setStream] = useState(null)

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraStatus.status === 'granted')
    })()
  }, [])

  /* Save for WebRTC
  useEffect(() => {
    start()
  }, [])
  const start = async () => {
    if (!stream) {
      let s
      try {
        s = await mediaDevices.getUserMedia({ video: true, audio: true })
        setStream(s)
      } catch(e) {
        console.error(e)
      }
    }
  }
  if (!stream) {
    return ( <View><Text>Preparing stream</Text></View> )
  }
  */

  return (
    <View>
      {round.status === 'IN_PROGRESS' ? (
        <>
          <Text>Time Remaining: {remaining_time} </Text> 
          <Text>{leader.username} wants you to bring them: {round.word}</Text>
          {/* Show a camera view for the player */}
          <Camera type={CameraType.back}>
            <View className="h-full" >

            </View>
          </Camera>
          {/* <SafeAreaView>
            <RTCView streamURL={stream.toURL()} /> 
          </SafeAreaView> */}
          <TouchableOpacity className="flex-1 items-center">
            <Ionicons name="ios-radio-button-on" size={50} color="white" />
          </TouchableOpacity>
        </>
      ) : (
        <Text>{leader.username} is choosing what to ask you for</Text>
      )}
    </View>
  )
}

export default RoundPlayerView