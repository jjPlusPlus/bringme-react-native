import React, { useState, useEffect, FunctionComponent } from 'react'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { StyleSheet, Text, View, Alert, Button } from 'react-native'
import { MATCH_STATES } from './constants'
import { RootStackParamList } from '../../App'
import { supabase } from '../../supabase/init'

interface Props {
  navigation: StackNavigationProp<RootStackParamList>
  route: RouteProp<RootStackParamList, 'Matchmaking'>
  user: User
}

const Matchmaking: FunctionComponent<Props> = (props) => {
  const { user } = props
  const room_code = props?.route?.params?.room_code
  const [match, setMatch] = useState<Match>()

  // on mount get the full Match object
  useEffect(() => {
    getMatchData()

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
              props.navigation.navigate('Home')            
            },
          },
        ]
      );
    })
  }, [])

  const getMatchData = async () => {
    let { data: matchData, error: matchError } = await supabase
      .from('matches')
      .select(`
        id,
        room_code,
        players:users!players ( id, username )
      `)
      .eq('room_code', room_code)
      .single()

    let { data: hostData, error: hostError } = await supabase
      .from('matches')
      .select(`
        host:users!matches_host_fkey ( id, username )
      `)
      .eq('room_code', room_code)
      .single()
    
    if (matchError || !matchData || hostError || !hostData) {
      console.log('getMatchData match error: ', matchError)
      console.log('getMatchData host error: ', hostError)
    } else {
      setMatch({ ...matchData, ...hostData })
    }
  }


  // Forward the user to the Match screen if the game has started

  if (!match) {
    return <View style={styles.container}><Text>Match Not Found</Text></View>
  }

  const { players, host, room_code:code } = match

  const startMatch = () => {

  }

  return (
    <View style={styles.container}>
      <Text>Match Info</Text>
      <Text>Match Id: {match?.id}</Text>
      <Text>Room Code: {code}</Text>
      <Text>Hosted By: {host?.username}</Text>

      <Text>Players</Text>
      {players && players.map((player:any, i) => {
        return (
          <Text key={i}>{i + 1}. {player.username}</Text>
        )
      })}
        
      {/* <Text>1. {match?.players[0] ? match.players[0].name : "Waiting for player"} </Text>
      <Text>2. {match?.players[1] ? match.players[1].name : "Waiting for player"}</Text>
      <Text>3. {match?.players[2] ? match.players[2].name : "Waiting for player"}</Text>
      <Text>4. {match?.players[3] ? match.players[3].name : "Waiting for player"}</Text> */}

      {/* If I'm the host, I should be able to start the match if all of the players are present */}
      {match?.createdBy?.uid === user?.id && match?.status !== MATCH_STATES.STARTED && (
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
