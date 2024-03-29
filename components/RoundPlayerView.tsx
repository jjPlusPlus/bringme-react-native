import React, { FunctionComponent, useState, useEffect, useRef } from 'react'
import { Text, View, Image, SafeAreaView } from 'react-native'
import { Camera, CameraCapturedPicture, CameraType } from 'expo-camera'
import * as FileSystem from 'expo-file-system'
import { decode } from 'base64-arraybuffer'
import useTimeRemaining from '../utils/useTimeRemaining'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import { supabase } from '../supabase/init'
import { styled } from 'nativewind'
import { ROUND_STATES } from './constants'

import AnnouncementHeader from './AnnouncementHeader'
import BottomBar from './BottomBar'

const handWaiting = require('../assets/hand-waiting.png')
const divider = require('../assets/divider.png')

import { User, Round } from './types'
import { content } from '../tailwind.config'

interface Props {
  round: Round
  leader: User
  user: User
}

const RoundPlayerView: FunctionComponent<Props> = (props) => {
  const { round, leader, user } = props

  switch (round.status) {
    case ROUND_STATES.STARTING:
      return <RoundStarting round={round} />
    case ROUND_STATES.IN_PROGRESS:
      return <RoundInProgress round={round} user={user} />
    case ROUND_STATES.ACTIVE:
      return <RoundActive leader={leader} user={user} />
    default:
      return <RoundOutsideState status={round.status} />
  }
}

interface RoundStartingProps {
  round: Round
}
const RoundStarting: FunctionComponent<RoundStartingProps> = (props) => {
  const { round } = props
  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex-1">
        <AnnouncementHeader>
          <View>
            <Text className="font-lucky text-3xl text-bmBlue uppercase">
              Match Starting In:
            </Text>
          </View>
        </AnnouncementHeader>
        <View>
          <RoundTimer round={round} />
        </View>
      </View>
    </SafeAreaView>
  )
}

interface ImagePreviewProps {
  image: any,
  setImage: any,
  round: Round,
  user: User
}
const ImagePreview: FunctionComponent<ImagePreviewProps> = (props) => {
  const { image, setImage, round, user } = props
  return (
    <View className="h-2/3 py-4 relative">
      <Image
        source={{ uri: image.uri }}
        width={200}
        height={200}
        className="h-full rounded-[30px] w-full"
      />
      <View className="absolute mt-6 mx-2">
        <TouchableOpacity onPress={() => {
          setImage(null)
        }}>
          <Ionicons name="close" size={50} color="white" />
        </TouchableOpacity>
      </View>

      <Text className="font-lucky mt-8 text-bmTeal text-center text-3xl">
        Ready to send?
      </Text>
      <View className="px-4">
        <TouchableOpacity
          className="bg-bmBlue items-center justify-center mb-1 mt-4 p-3 rounded-[15px] w-full"
          onPress={async () => {
            const base64 = await FileSystem.readAsStringAsync(image.uri, { encoding: 'base64' })
            const { data: submission, error: submission_error } = await supabase
              .from('submissions')
              .insert({
                round_id: round.id,
                player_id: user.id,
                base64_image: base64
              })
          }}>
          <Text className="font-bold font-lucky pt-2 justify-center text-center text-3xl text-white uppercase">Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

interface CameraWrapperProps {
  type: any,
  cameraRef: any,
  take_picture: any,
  round: any
} 
const CameraWrapper: FunctionComponent<CameraWrapperProps> = (props) => {
  const { type, cameraRef, take_picture, round } = props
  return (
    <View>
      <View>
        <Image source={divider} />
        <Text className="font-lucky text-4xl mb-4 mt-5 text-center uppercase">{round.word}</Text>
        <Image className="" source={divider} />
      </View>
      <View className="h-2/3 py-4 rounded-[20px] overflow-hidden">
        {/* Show a camera view for the player */}
        <Camera type={type} ref={cameraRef}>
          <View className="h-full justify-end w-full">
            <TouchableOpacity className="self-center mb-4" onPress={take_picture}>
              <Ionicons name="ios-radio-button-on" size={50} color="white" />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    </View>
  )
}

interface RoundInProgressProps {
  round: Round,
  user: User
}
const RoundInProgress: FunctionComponent<RoundInProgressProps> = (props) => {
  const { round, user } = props
  const cameraRef = useRef<Camera>(null)
  const [type, setType] = useState(CameraType.back)
  const [image, setImage] = useState<CameraCapturedPicture | null>(null)  // Todo: type should be CameraCapturedPicture but it's not in the expo-camera types
  const [hasCameraPermission, setHasCameraPermission] = useState(false)

  useEffect(() => {
    (async () => {
      if (!hasCameraPermission) {
        const cameraStatus = await Camera.requestCameraPermissionsAsync()
        setHasCameraPermission(cameraStatus.status === 'granted')
      }
    })()
  }, [])

  async function take_picture() {
    if (cameraRef) {
      try {
        const photo = await cameraRef.current?.takePictureAsync()
        if (photo) { setImage(photo) }
      } catch (e) {
        // TODO: alert the user that there was an error taking the picture
        console.error('take_picture_error: ', e)
      }
    }
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex-1">
        <View>
          <RoundTimer round={round} />
        </View>
        {image ? (
          <ImagePreview image={image} setImage={setImage} round={round} user={user} />
        ) : (
          <CameraWrapper type={type} cameraRef={cameraRef} take_picture={take_picture} round={round}/>
        )}
      </View>
      <BottomBar>
        {!image ?
          <>
            <TouchableOpacity
              className="bg-bmBlue h-20 items-center justify-center -mt-10 rounded-full self-center w-20"
              onPress={take_picture}
            >
              <Feather name="camera" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-bmOrange h-12 items-center justify-center rounded-full self-center mb-4 -mt-8 mr-8 w-12"
              onPress={() =>
                setType(type === CameraType.front ? CameraType.back : CameraType.front)
              }
            >
              <Ionicons name="sync" size={30} color="white" />
            </TouchableOpacity>
          </>
          : null
        }
      </BottomBar>
    </SafeAreaView>
  )
}

interface RoundActiveProps {
  leader: User,
  user: User
}
const RoundActive:FunctionComponent<RoundActiveProps> = (props) => {
  const { leader, user } = props
  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex-1">
        <View className='bg-white h-full px-4 py-2'>
        <AnnouncementHeader headerImage={handWaiting}>
          <Text className="font-lucky ml-2 text-3xl text-bmBlue uppercase">
            Waiting...
          </Text>
          <View className="px-3 ml-12 -mt-1 w-2/3">
            <Text className="text-left">
              <Text className="font-bold">{leader?.username}</Text> is currently writing their decree.
            </Text>
          </View>
        </AnnouncementHeader>
        <View className="flex-1 gap-4">
          <View className="border-2 border-bmBlue h-[150px] relative rounded-[20px] w-1/2 z-10">
            <View className="absolute bg-bmPeach h-full rounded-[20px] translate-x-2 -translate-y-2 w-full -z-10" />
            <Text>{user.username} live cam goes here?</Text>
          </View>
        </View>
      </View>
      </View>
    </SafeAreaView>
  )
}


interface RoundOutsideStateProps {
  status: string
}

const RoundOutsideState: FunctionComponent<RoundOutsideStateProps> = (props) => {
  const { status } = props
  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex-1">
        <Text>what the shit? {status}</Text>
      </View>
    </SafeAreaView>
  )
}

const RoundTimer = (props: any) => {
  const { round } = props
  const remaining_time = useTimeRemaining(round.started_at, round.time)

  return (
    <View>
      <Text className="font-luck items-center text-5xl">{remaining_time}</Text>
    </View>
  )
}

export default RoundPlayerView