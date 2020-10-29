import React, { FunctionComponent, useState } from 'react'

import { StyleSheet, Text, TextInput, Button, View } from 'react-native'

/* To Do: 
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
 * setRoundWord [ round (int, key 1-6), word (string) ]
 * startNextRound
 * endMatchEarly 
*/

interface Props {
  match: Match
  setRoundWord: (word: string) => void
  startRound: () => void
}

const MatchHostView: FunctionComponent<Props> = ({ match, setRoundWord, startRound }) => {

  const { rounds, players } = match
  const round = rounds[match.round + 1]
  const [word, setWord] = useState("")

  const needsWord = !round?.word

  return (
    <View style={styles.container}>
      <Text>Round {match.round + 1}</Text>

      {needsWord ? (
        <>
        <TextInput
          style={{ height: 40 }}
          placeholder="The next word will be..."
          onChangeText={text => {
            setWord(text)
          }}
          defaultValue={word}
        />
        <Button onPress={() => setRoundWord(word)} title="Set"/>
        </>
      ) : (
        <Text>Word: { round.word || "..." }</Text>
      )}

      {/* Show Start round button if the word has been selected and the round hasn't started */}
      { !needsWord && (
        <Button onPress={startRound} title="Start Round" />
      )}

      {/* Show the winner if there is one */}
      {round?.winner && (
        <Text>Winner: {round?.winner}</Text>
      )}

      <Text>Scoreboard</Text>
      {players?.map(player => (
        <View>
          <Text>{player.name}</Text>
          <Text>{player.score ? player.score : "0"}</Text>
        </View>
      ))}
    </View>
  )
}

export default MatchHostView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#efefef',
    alignItems: 'center',
  }
})