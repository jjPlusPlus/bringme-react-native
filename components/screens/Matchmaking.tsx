import React, { useState, useEffect, FunctionComponent } from 'react'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { StyleSheet, Text, View, Alert, Button } from 'react-native'
// import firestore from '@react-native-firebase/firestore'

import { MATCH_STATES } from './constants'
import { RootStackParamList } from '../../App'

interface Props {
  navigation: StackNavigationProp<RootStackParamList>
  route: RouteProp<RootStackParamList, 'Matchmaking'>
  user: User;
}

const Matchmaking: FunctionComponent<Props> = (props) => {
  const { user } = props
  const matchId = props.route.params.matchId

  const [match, setMatch] = useState<Match>()

  // on mount, get the full Match object
  useEffect(() => {
    // firestore()
    //   .collection('matches')
    //   .doc(matchId)
    //   .onSnapshot(documentSnapshot => {
    //     if (!documentSnapshot) {
    //       return
    //     }
    //     const data = documentSnapshot.data() as FirestoreMatch
    //     const withId = {
    //       ...data,
    //       id: documentSnapshot.id
    //     }
    //     setMatch(withId)
    //   })

    // Remove players from the match if they back out of the lobby
    props.navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      Alert.alert(
        'Leave the Lobby?',
        'Going back will remove you from this match',
        [
          { text: "Don't leave", style: 'cancel', onPress: () => { } },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => {

              const players = match?.players?.filter(p => p.id !== user.id)
              // firestore()
              //   .collection('matches')
              //   .doc(matchId)
              //   .update({
              //     players: players || []
              //   } as Partial<FirestoreMatch>)
              //   .then(() => {
              //     console.log('Player removed');
              //     props.navigation.dispatch(e.data.action)
              //   });  
              
            },
          },
        ]
      );
    })
  }, [])

  // Forward the user to the Match if the game has started
  useEffect(() => {
    if (match?.status === MATCH_STATES.STARTED) {
      props.navigation.navigate('Match', {
        matchId: match.id
      })
    }
  }, [match])

  if (!match) {
    return <View style={styles.container}><Text>Match Not Found</Text></View>
  }

  const startMatch = () => {
    // firestore()
    //   .collection('matches')
    //   .doc(match.id)
    //   .update('status', MATCH_STATES.STARTED)
    //   .then(() => {
    //     console.log('Match updated!');
    //     props.navigation.navigate('Match', {
    //       matchId: match.id
    //     })
    //   });  
  }

  return (
    <View style={styles.container}>
      <Text>Match Info</Text>
      <Text>Match Id: {match?.id}</Text>

      <Text>Created By: {match?.createdBy.username}</Text>

      <Text>Players</Text>
      <Text>1. {match?.players[0] ? match.players[0].name : "Waiting for player"} </Text>
      <Text>2. {match?.players[1] ? match.players[1].name : "Waiting for player"}</Text>
      <Text>3. {match?.players[2] ? match.players[2].name : "Waiting for player"}</Text>
      <Text>4. {match?.players[3] ? match.players[3].name : "Waiting for player"}</Text>

      {/* If I'm the host, I should be able to start the match if all of the players are present */}
      {match?.createdBy.uid === user?.id && match?.status !== MATCH_STATES.STARTED && (
        <Button onPress={startMatch} disabled={match?.players?.length !== 4} title="Start Match" />
      )}

      {/* If the match is started and I somehow managed to get here AND the useEffect didn't already re-route me*/}
      {match?.status === MATCH_STATES.STARTED && (
        <Button 
          onPress={() => props.navigation.navigate('Match', { matchId: match?.id })} 
          title="Enter Match" 
        />
      )}
      
    </View>
  )
}

export default Matchmaking

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
