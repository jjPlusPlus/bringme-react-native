import React, { FunctionComponent, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { RouteProp } from '@react-navigation/native'

import firestore from '@react-native-firebase/firestore'

import MatchHostView from '../MatchHostView'
import MatchPlayerView from '../MatchPlayerView'
import { RootStackParamList } from '../../App'

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

interface Props {
  user: User
  route: RouteProp<RootStackParamList, 'Match'>
}

const Match: FunctionComponent<Props> = (props) => {
  const { user } = props
  const matchId = props.route.params?.matchId

  if (!matchId) {
    throw new Error('No match ID passed as route param! Singleplayer not handled yet')
  }

  const [match, setMatch] = useState<Match>()

  // get match by ID passed in with props
  useEffect(() => {
    firestore()
      .collection('matches')
      .doc(matchId)
      .onSnapshot(documentSnapshot => {
        if (!documentSnapshot) {
          return
        }
        const data = documentSnapshot.data() as FirestoreMatch
        const withId = {
          ...data,
          id: documentSnapshot.id
        }
        setMatch(withId)
      })
  }, [])

  const setRoundWord = (round:number, word:string) => {
    if (!match) {
      throw new Error('No match set. Cannot set round')
    }
    let updated = match.rounds
    updated[round].word = word

    firestore()
      .collection('matches')
      .doc(matchId)
      .update('rounds', updated)
      .then(() => {
        console.log('Match Round Word updated!');
      });  

  }

  const startRound = () => {

  }
  
  const submitWord = () => {

  }

  if (!match) {
    return <View><Text>Loading</Text></View>
  }

  return user.id === match?.host?.uid ? (
    <MatchHostView match={match} setRoundWord={setRoundWord} startRound={startRound}/>
  ) : (
    <MatchPlayerView match={match} submitWord={submitWord} />
  )
}

export default Match
