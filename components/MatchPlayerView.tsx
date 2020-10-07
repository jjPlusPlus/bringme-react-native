import React, { FunctionComponent, useRef } from 'react'
// import { RNCamera } from 'react-native-camera'
import { StyleSheet, Text, View } from 'react-native'


/* To Do: 
 * Top Bar
 *   current word (from Round)
 *   current score (from Players)
 *   time remaining (based on Round.started_at)
 * Camera 
 *   action button "recognize!"
 *   recognition loading state, success notification
 *   realtime word matches overlay
 * Bottom Bar
 *   Contextual information depending on game state:
 *   If the round is over:
 *    '[host.name] is picking the next word'    
 *   If the round is in progress:
 *     show 4 top words that came back from a match
 * Slideout
 *   Players/scores
 *   "Pass" buttons
 *   Leave Match
*/

interface Props {
  match: Match
  submitWord: (word: string) => void
}

const MatchPlayerView: FunctionComponent<Props> = () => {
  // let camera = useRef<RNCamera | null>(null)

  return (
    <View style={styles.container}>
      <View>
        <Text>TopBar</Text>
        <Text>Score</Text>
        <Text>Word</Text>
        <Text>Timer</Text>
      </View>
      <View>
        <Text>Camera</Text>
        <Text>RNCamera, action button? Maybe this can go UNDER the top/bottom bars?</Text>
        {/* 
          <RNCamera
            ref={ref => {
              camera = ref;
            }}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
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
          /> 
        */}
      </View>
      <View>
        <Text>Bottom Bar</Text>
        <Text>contextual information (messages based on game state)</Text>
      </View>
      <View>
        <Text>Drawer/Slideout</Text>
        <Text>Players/scores</Text>
        <Text>Vote to Skip button</Text>
        <Text>Leave Match button</Text>
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