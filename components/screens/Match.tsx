import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import firestore from '@react-native-firebase/firestore'

import MatchHostView from '../MatchHostView'
import MatchPlayerView from '../MatchPlayerView'

/* To Do: 
 * On load, Check if the user is a Host or Player, kick user if they are not either one
 * Then, show the user the MatchPlayerView or the MatchHostView
 * 
 * Either: 
 *  - declare all actions on the Match object here, or
 *  - pass down the Match ref() to the Views
 * 
 * Actions that can happen:
 *   setRoundWord
 *   startRound
 *   submitWord
 *   endMatchEarly
 *   leaveMatch (player quits match)
 *   (future) voteToSkip
*/ 

export default function Match(props) {
  const { user } = props
  const matchId = props.route.params.matchId

  const [match, setMatch] = useState(null)

  // get match by ID passed in with props
  useEffect(() => {
    firestore()
      .collection('matches')
      .doc(matchId)
      .onSnapshot(documentSnapshot => {
        if (!documentSnapshot) {
          return
        }
        const data = documentSnapshot.data()
        const withId = {
          ...data,
          id: documentSnapshot.id
        }
        setMatch(withId)
      })
  }, [])

  const setRoundWord = () => {

  }

  const startRound = () => {

  }
  
  const submitWord = () => {

  }

  if (!user) {
    return <View><Text>Loading</Text></View>
  }

  return user.id === match?.host?.uid ? (
    <MatchHostView match={match} setRoundWord={setRoundWord} startRound={startRound}/>
  ) : (
    <MatchPlayerView match={match} submitWord={submitWord} />
  )
}