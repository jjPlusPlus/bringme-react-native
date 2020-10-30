import React, { FunctionComponent, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { RouteProp } from '@react-navigation/native'

import firestore from '@react-native-firebase/firestore'

import MatchHostView from '../MatchHostView'
import MatchPlayerView from '../MatchPlayerView'
import { RootStackParamList } from '../../App'

/* To Do: 
 * [x] On load, Check if the user is the creator or a player, and kick the user back to the Multiplayer screen if they are neither
 * [x] If the player is the current 'host', show the MatchHostView
 * [x] Otherwise, show the MatchPlayerView
 * [ ] Write logic to discern who is the current 'host'
 * [ ] Show the actual round word
 * [ ] Use the actual player's score 
 * [ ] Set up a countdown timer for the Round
 * [ ] 
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
  const [host, setHost] = useState<any>(null)

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


  useEffect(() => {
    return setHost(match?.players[match?.round % match?.players?.length])
  }, [match?.round])

  const setRoundWord = (word:string) => {
    if (!match) {
      throw new Error('No match set. Cannot set round')
    }
    let updated = match.rounds
    updated[match.round + 1].word = word
    updated[match.round + 1].status = 'started'
    updated[match.round + 1].started_at = Date.now().toString()

    firestore()
      .collection('matches')
      .doc(matchId)
      .update('rounds', updated)
      .then(() => {
        console.log('Match Round Word updated!');
      })
  }  

  const submitWord = () => {

  }


  if (!match) {
    return <View><Text>Loading</Text></View>
  }

  return host?.id === user.id ? (
    <MatchHostView match={match} setRoundWord={setRoundWord} />
  ) : (
    <MatchPlayerView match={match} user={user} host={host} submitWord={submitWord} />
  )
}

export default Match

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})
