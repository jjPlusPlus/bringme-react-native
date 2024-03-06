import React, { FunctionComponent, useState, useEffect, useRef } from 'react'
import { Text, View, Image, SafeAreaView } from 'react-native'
import { Camera, CameraCapturedPicture, CameraType } from 'expo-camera'
import * as FileSystem from 'expo-file-system'
import { decode } from 'base64-arraybuffer'
import useTimeRemaining from '../utils/useTimeRemaining'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { supabase } from '../supabase/init'


// WebRTC
// import { mediaDevices, RTCView } from 'react-native-webrtc'

import { User, Round } from './types'
import { content } from '../tailwind.config'

interface Props {
  round: Round
  leader: User
  user: User
}

const RoundPlayerView: FunctionComponent<Props> = (props) => {
  const { round, leader, user } = props
  const remaining_time = useTimeRemaining(round.started_at, round.time)
  const [hasCameraPermission, setHasCameraPermission] = useState(false)
 
  const [image, setImage] = useState<CameraCapturedPicture | null>(null)  // Todo: type should be CameraCapturedPicture but it's not in the expo-camera types
  const cameraRef = useRef<Camera>(null)

  // Save for WebRTC
  // const [stream, setStream] = useState(null)

  useEffect(() => {
    (async () => {
      if (!hasCameraPermission) {
        const cameraStatus = await Camera.requestCameraPermissionsAsync()
        setHasCameraPermission(cameraStatus.status === 'granted')
      }
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

  async function take_picture() {
    if (cameraRef) {
      try {
        const photo = await cameraRef.current?.takePictureAsync()
        if (photo) { setImage(photo) }
      } catch(e) {
        console.error('take_picture_error: ', e)
      }
    }
  }
  return (
    <SafeAreaView>
      {round.status === 'IN_PROGRESS' ? (
        <>
          {/* I Imagine this section will be some sort of top-bar */}
          <View>
            <Text>Time Remaining: {remaining_time} </Text> 
            <Text>{leader.username} wants you to bring them: {round.word}</Text>
          </View>
          { image ? (
            <>
              {/* Show a preview of the submission to the player
                * Along with a button to submit
                * And a button to retake the submission
              */}
              <View>
                <Text>Preview</Text>
                {/* <Image source={{ uri: image.uri }} width={image.width} height={image.height} /> */}
                <Image source={{ uri: image.uri }} width={200} height={200} />
                <TouchableOpacity onPress={() => {
                  setImage(null)
                }}>
                  <Text>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => {
                  /* NOTE: Commenting this out for now because we are storing the image in the database as base64
                    const base64 = await FileSystem.readAsStringAsync(image.uri, { encoding: 'base64' })
                    const { data: photo_upload, error: photo_upload_error } = await supabase.storage.from('submissions').upload(`${user.id}_${round.id}`, decode(base64), { 
                      contentType: 'image/jpeg',
                      upsert: true 
                    })
                    console.log('photo_upload: ', photo_upload, photo_upload_error)
                    if (photo_upload_error) {
                      // Handle error: we will probably notify the user and ask them to try again
                    } else {
                      // add a new submission record
                    }
                  */

                  // Add a new submission record
                  const base64 = await FileSystem.readAsStringAsync(image.uri, { encoding: 'base64' })
                  const { data: submission, error: submission_error } = await supabase
                    .from('submissions')
                    .insert({
                      round_id: round.id,
                      player_id: user.id,
                      base64_image: base64
                    })
                }}>
                  <Text>Submit</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View>
              {/* Show a camera view for the player */}
              <Camera type={CameraType.back} ref={cameraRef}>
                <View className="h-80">
                  <TouchableOpacity className="" onPress={ take_picture }>
                    <Ionicons name="ios-radio-button-on" size={50} color="white" />
                  </TouchableOpacity>
                </View>
              </Camera>
            </View>
          )}


          {/* <RTCView streamURL={stream.toURL()} /> */}

          
        </>
      ) : (
        <Text>{leader?.username} is choosing what to ask you for</Text>
      )}
    </SafeAreaView>
  )
}

export default RoundPlayerView