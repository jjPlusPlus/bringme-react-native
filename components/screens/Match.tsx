import React, { FunctionComponent, useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { RouteProp } from '@react-navigation/native'
// import { createDrawerNavigator } from '@react-navigation/drawer';


// import firestore from '@react-native-firebase/firestore'

import styled from 'styled-components/native'
import { t } from 'react-native-tailwindcss'

import MatchHostView from '../MatchHostView'
import MatchPlayerView from '../MatchPlayerView'
import Scoreboard from '../Scoreboard'
import { RootStackParamList } from '../../App'

import { Dimensions } from 'react-native'

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

// const Drawer = createDrawerNavigator();

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

    // firestore()
    //   .collection('matches')
    //   .doc(matchId)
    //   .update('rounds', updated)
    //   .then(() => {
    //     console.log('Match Round Word updated!');
    //   })
  }  

  const leaveMatch = () => {
    if (!match) {
      throw new Error('No match set. Cannot leave match')
    }
  }

  const submitWord = () => {

  }

  if (!match || !host) {
    return <View><Text>Loading</Text></View>
  }

  const { width, height } = Dimensions.get('screen');

  return host?.id === user.id ? (
    // <Drawer.Navigator drawerStyle={{width: '80%'}} drawerPosition="right" drawerContent={() => <DrawerContent match={match} leaveMatch={leaveMatch} host={host}/>}>
    //   <Drawer.Screen name="MatchHostView" >
    //     {() => <MatchHostView match={match} setRoundWord={setRoundWord} host={host} />}
    //   </Drawer.Screen>
    // </Drawer.Navigator>
    <View>

    </View>
  ) : (
    // <Drawer.Navigator drawerStyle={{width: '80%'}} drawerPosition="right" drawerContent={() => <DrawerContent match={match} leaveMatch={leaveMatch} host={host}/>}>
    //   <Drawer.Screen name="MatchPlayerView" component={() => <MatchPlayerView match={match} user={user} host={host} submitWord={submitWord} />} />
    // </Drawer.Navigator>
    <View>
      
    </View>
  )
}

function DrawerContent(match, host, leaveMatch) {
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <View style={[ t.pT10, t.p2, t.flexGrow ]}>
      <Text style={[ t.fontBold, t.textCenter, t.textXl, t.p2 ]}>Player Scores</Text>
      <Scoreboard players={match.match.players} host={host}/>
    </View>
    <View style={[ t.pB10 ]}>
      <QuitButton onPress={() => leaveMatch()}>
        <QuitButtonText>Quit Match</QuitButtonText>
      </QuitButton>
    </View>
  </View>
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

const QuitButton = styled(TouchableOpacity)`
  ${[ t.p2, t.m2, t.roundedLg, { background: '#ff0000'} ]}
`;

const QuitButtonText = styled(Text)`
  ${[ t.fontBold, t.textCenter, t.textLg, t.textWhite, t.uppercase, { fontFamily: 'LuckiestGuy-Regular' } ]}
`;