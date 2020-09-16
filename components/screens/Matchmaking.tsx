import React, { useState, useEffect } from 'react'

import { StyleSheet, Text, View } from 'react-native'

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

export default function Matchmaking(props: any) {
  const matchId = props.route.params.matchId
  const [match, setMatch] = useState(null)



  useEffect(() => {
    firestore()
      .collection('matches')
      .doc(matchId)
      .get()
      .then(documentSnapshot => {
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