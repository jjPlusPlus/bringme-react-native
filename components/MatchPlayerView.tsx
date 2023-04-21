import React, { FunctionComponent, useState, useRef } from 'react'
// import { RNCamera } from 'react-native-camera'
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
// import firestore from '@react-native-firebase/firestore'
// import functions from '@react-native-firebase/functions';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { t } from 'react-native-tailwindcss'
import { ROUND_STATES } from './screens/constants';

import RoundTimer from './RoundTimer'

interface Props {
  match: Match
  user: User
  host: User
  submitWord: (word: string) => void
}

interface Label {
  text: string,
  confidence: number
}

const MatchPlayerView: FunctionComponent<Props> = ({match, user, host, submitWord}) => {
  // let camera = useRef<RNCamera | null>(null)
  const [labels, setLabels] = useState([])
  // const [camType, setCamType] = useState(RNCamera.Constants.Type.back)
  const [camType, setCamType] = useState(null)


  const { rounds, players } = match
  const round = rounds[match.round + 1]
  const player = players.find(p => p.id === user.id)

  const switchCamera = () => {
    // if (camType === RNCamera.Constants.Type.back) {
    //   setCamType(RNCamera.Constants.Type.front);
    // } else {
    //   setCamType(RNCamera.Constants.Type.back);
    // }
  }
  const attemptMatch = async () => {
    // check if round word equals one of the current labels 
    const submissionHasMatch = labels.find((l:Label) => l.text === round.word)
    // take a picture and convert it to base64 
    // const submission = await camera.takePictureAsync({ quality: 0.25, width: '200', base64: true })
    let submission;
    let roundsCopy, playersCopy
    if (submissionHasMatch) {
      // var playerScored = functions().httpsCallable('playerScored')
      
      // playerScored({ 
      //   match: match,
      //   confidence: parseInt(submissionHasMatch.confidence * 10),
      //   player: { name: player.name, id: player.id },
      //   submission: submission.base64,
      // })
    } else {
      
      // only set the player's current submission
      playersCopy = players.map(p => {
        if (p.id === player.id) {
          p.submission = submission?.base64
        }
        return p
      })

      // firestore()
      //   .collection('matches')
      //   .doc(match.id)
      //   .update({
      //     players: playersCopy,
      //   } as Partial<FirestoreMatch>)
      //   .then(() => {
      //     console.log('Match updated!')
      //   })  
    }
  }

  return (
    <View style={[t.flex1, t.flexCol]}>
      <View style={[t.p4, t.flexRow, t.itemsCenter, { backgroundColor: '#FFE8E7', height: 80 }]}>
        
        <Text style={[t.flex1, t.fontBold, t.textXl]}>
          {round.status === ROUND_STATES.CREATED && !round.word && `${host?.name} is picking a word`}
          {round.status === ROUND_STATES.STARTED && round.word && `Bring me a... ${round.word}`}
        </Text>

        <View style={[t.flexRow, t.itemsCenter]}>
          <MaterialIcons name="timer" size={24} color="black" />
          <Text style={[t.pL1, t.textXl]}>
            <RoundTimer round={round}/>
          </Text>
        </View>

      </View>
      <View style={[t.flex1, t.relative]}>
        {/* <RNCamera
          ref={ref => {
            camera = ref;
          }}
          style={[t.flex1, t.justifyEnd, t.itemsCenter, { flex: 1 }]}
          type={camType}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onLabelsDetected={({ labels = [] }) => setLabels(labels)}
        /> */}

        <View style={[t.absolute, t.m4]}>
          {
            labels?.sort((a, b) => b.confidence - a.confidence).map((label, labelIndex) => (
              <Text key={labelIndex} style={[t.p2, t.textWhite, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>{label.text}: {label.confidence}</Text>
            ))
          }
        </View>

      </View>

      <View style={[t.bgBlack, t.pB6, t.pT3, t.pX4, t.flexRow, t.itemsCenter, t.justifyEnd]}>

        <View style={[t.flex1]}></View>

        <TouchableOpacity style={[t.flex1, t.itemsCenter]} onPress={() => attemptMatch()}>
          <Ionicons name="ios-radio-button-on" size={50} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={[t.flex1, t.itemsEnd]} onPress={() => switchCamera()}>
          <Ionicons name="ios-reverse-camera" size={40} color="white" />
        </TouchableOpacity>

      </View>
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
