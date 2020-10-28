import React, { useRef, useState } from 'react'
import { RNCamera } from 'react-native-camera'
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { t } from 'react-native-tailwindcss'

export default function Match() {
  let camera = useRef<RNCamera | null>(null)
  const [ labels, setLabels ] = useState([])
  const [ camType, setCamType ] = useState(RNCamera.Constants.Type.back)
  
  const switchCamera = () => {
    if (camType === RNCamera.Constants.Type.back) {
      setCamType(RNCamera.Constants.Type.front);
    } else {
      setCamType(RNCamera.Constants.Type.back);
    }
  }
  return (
    <View style={[t.flex1, t.flexCol]}>
      <View style={[t.p4, t.flexRow,t.itemsCenter, { backgroundColor: '#FFE8E7', height: 80 }]}>
        <Text style={[t.flex1, t.fontBold, t.textXl]}>Current Word</Text>
        <View style={[t.flexRow, t.itemsCenter]}>
          <MaterialIcons name="timer" size={24} color="black" /> 
          <Text style={[t.pL1, t.textXl]}>{ new Date().getSeconds() }s</Text>
        </View>
      </View>
      <View style={[t.flex1, t.relative]}>
        <RNCamera
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
        />
        <View style={[t.absolute, t.m4]}>
          {
            labels?.sort((a, b) => b.confidence - a.confidence).map( label => (
              <Text style={[t.p2, t.textWhite, { backgroundColor: 'rgba(0,0,0,0.5)'}]}>{ label.text }: {label.confidence }</Text>
            ))
          }

        </View>
      </View>
      <View style={[t.bgBlack, t.pB6, t.pT3, t.pX4, t.flexRow,t.itemsCenter, t.justifyEnd]}>
        <View style={[t.flex1]}></View>
        <TouchableOpacity style={[t.flex1, t.itemsCenter]}>
          <Ionicons name="ios-radio-button-on" size={50} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[t.flex1, t.itemsEnd]} onPress={ () => switchCamera() }>
          <Ionicons name="ios-reverse-camera" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//   },
//   preview: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
// })
