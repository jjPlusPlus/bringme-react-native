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
  setRoundWord: (round: number, word: string) => void
  startRound: (round: number) => void
}

const MatchHostView: FunctionComponent<Props> = ({ match, setRoundWord, startRound }) => {

  const { rounds, players } = match
  const [word, setWord] = useState("")

  return (
    <View style={styles.container}>
      <Text>Rounds</Text>
      {rounds && Object.keys(rounds).map(roundKey => {
        const round = parseInt(roundKey, 10);

        const noWordYet = !rounds[round].word
        const isNextRound = round == (match.round + 1)
        const needsWord = noWordYet && isNextRound

        return <View>
          <Text>Round {round}</Text>
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
            <Button onPress={() => setRoundWord(round, word)} title="Set"/>
            </>
          ) : (
            <Text>Word: { rounds[round].word || "..." }</Text>
          )}
          { !noWordYet && isNextRound && (
            <Button onPress={() => startRound(round)} title="Start Round" />
          )}
          {rounds[round].winner && (
            <Text>Winner: {rounds[round].winner}</Text>
          )}
          
        </View>
      })}

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