import React, { useState, useEffect } from 'react'

import { StyleSheet, Text, View, Alert, Button } from 'react-native'
import firestore from '@react-native-firebase/firestore'

interface User {
  name: string,
  uid: string,
  email: string
}
interface Match {
  id: string,
  host: string,
  name?: string,
  players: string,
  created_at: string,
  started_at?: string,
  ended_at?: string,
  winner?: string,
  status: string
}

import { MATCH_STATES } from './constants.js'

export default function Matchmaking(props: any) {
  const matchId = props.route.params.matchId

  const [user, setUser] = useState<User | null>(null)
  const [match, setMatch] = useState(null)

  useEffect(() => {
    // get the full current user document
    firestore()
      .collection('users')
      .where('user', '==', props.user.uid)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot) {
          return console.error('users query failed')
        }
        const data = querySnapshot.docs[0].data()
        const withId = {
          ...data,
          id: querySnapshot.docs[0].id
        }
        return setUser(withId)
      })

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

    props.navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      Alert.alert(
        'Leave the Match?',
        'Going back will remove you from this match',
        [
          { text: "Don't leave", style: 'cancel', onPress: () => { } },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => {
              // remove the player from the match
              const players = match?.players?.filter(p => p.id !== user.id)
              firestore()
                .collection('matches')
                .doc(matchId)
                .update({
                  players: players || []
                })
                .then(() => {
                  console.log('Player removed');
                  props.navigation.dispatch(e.data.action)
                });  
              
            },
          },
        ]
      );
    })
  }, [])

  useEffect(() => {
    if (match?.status === MATCH_STATES.STARTED) {
      props.navigation.navigate('Match', {
        matchId: match.id
      })
    }
  }, [match])

  const startMatch = () => {
    firestore()
      .collection('matches')
      .doc(match.id)
      .update('status', MATCH_STATES.STARTED)
      .then(() => {
        console.log('Match updated!');
        props.navigation.navigate('Match', {
          matchId: match.id
        })
      });  
  }

  if (!match) {
    return <View style={styles.container}><Text>Match Not Found</Text></View>
  }

  return (
    <View style={styles.container}>
      <Text>Match Info</Text>
      <Text>Match Id: {match?.id}</Text>
      <Text>Host: {match?.host?.username}</Text>

      <Text>Players</Text>
      <Text>1. {match?.players[0] ? match.players[0].name : "Waiting for player"} </Text>
      <Text>2. {match?.players[1] ? match.players[1].name : "Waiting for player"}</Text>
      <Text>3. {match?.players[2] ? match.players[2].name : "Waiting for player"}</Text>
      <Text>4. {match?.players[3] ? match.players[3].name : "Waiting for player"}</Text>

      {/* If I'm the host, I should be able to start the match if all of the players are present */}
      {match?.host?.uid === user?.id && match?.status !== MATCH_STATES.STARTED && (
        <Button onPress={startMatch} disabled={match?.players?.length !== 4} title="Start Match" />
      )}

      {/* If the match is started and I somehow managed to get here */}
      {match?.status === MATCH_STATES.STARTED && (
        <Button 
          onPress={() => props.navigation.navigate('Match', { matchId: match?.id })} 
          title="Enter Match" 
        />
      )}
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
