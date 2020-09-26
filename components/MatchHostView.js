import React from 'react'

import { StyleSheet, Text, View } from 'react-native'

/* To Do: 
 * list of Players: name, score 
 *   maybe show this as a grid, expecting us to someday have pictures streamed
 * list of Rounds: round #, word, winner, winning image 
 * Based on game state:
 *   If the previous round is over:  
 *     round setup: word-selection input 
 *     "start round" button
 * In the slideout drawer:
 *   "End Match Early" Action
*/

/* This view will receive from props:
 * a reference to the firestore match (for easy updating)
 * Rounds 
 * Players 
 * 
 * setRoundWord [ round (uid), word (string) ]
 * startNextRound
 * endMatchEarly 
*/

export default function MatchHostView({ match, setRoundWord, startRound }) {

  return (
    <View style={styles.container}>
      <Text>Rounds</Text>

      <Text>Round 1</Text>
      <Text>Word: Dog</Text>
      <Text>Winner: Maddox</Text>

      <Text>Round 2</Text>
      <Text>Word: Cat</Text>
      <Text>Winner: ... in progress</Text>

      <Text>Round 3</Text>
      <Text>Choose a word:</Text>
      <Text>Start Round</Text>

      <Text>Round 4</Text>
      <Text>Round 5</Text>
      <Text>Round 6</Text>

      <Text>Scoreboard</Text>
      <Text>Maddox: 250</Text>
      <Text>JJPlusPlus: 25</Text>
      <Text>Deanomite: 0</Text>
      <Text>Knox: disconnected</Text>
      
      <Text>Actions</Text>
      <Text>End Match Early (only active if 1 or less players?)</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#efefef',
    alignItems: 'center',
  }
})