import React, { FunctionComponent, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { RouteProp } from '@react-navigation/native'

import firestore from '@react-native-firebase/firestore'

import MatchHostView from '../MatchHostView'
import MatchPlayerView from '../MatchPlayerView'
import { RootStackParamList } from '../../App'

/* To Do: 
 * [ ] Wire up the countdown timer for the Round
 * [ ] Style the Match Host View and Match Player View 
 * [ ] Show a notification when a player has won a round 
 * [ ] Show the confidence score for the Winner
 * [ ] Winner score should be based on 100 points + confidence + time remaining
 * [ ] Confidence threshold to win a round 
 * [ ] Show a notification when the game ends, with a 'go back' button 
 * [ ] Slide-out drawer with 'leave match' button and scoreboard 
 * [ ] Hints for selecting a word or submitting a capture
 * [ ] Presence indicator for users (high LOE, requires firebase rtdb ugh)
 * - We can do time last because it's not essential 
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
    <MatchHostView match={match} setRoundWord={setRoundWord} host={host}/>
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
