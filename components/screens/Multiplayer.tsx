import React, { useState, useEffect, FunctionComponent } from 'react'
import { ActivityIndicator, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import firestore from '@react-native-firebase/firestore'

import { MATCH_STATES, ROUND_STATES } from './constants'

import { t } from 'react-native-tailwindcss'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../App'

interface Props {
  navigation: StackNavigationProp<RootStackParamList>
  user: User
}

const Multiplayer: FunctionComponent<Props> = props => {
  const { user } = props
  const [matches, setMatches] = useState<Match[]>([])
  const [committed, setCommitted] = useState(true)

  /* 
    Get a manicured list of collections
    Sorted by newest-first, limit of 100

    TODO: Sort by matches where I'm a player first
    TODO: (blocked by firestore bug): Only games that are in matchmaking or in progress
  */
  useEffect(() => {
    // firestore()
    //   .collection('matches')
    //   // .where('status', 'in', ['matchmaking', 'in-progress'])
    //   .orderBy('created_at', 'desc')
    //   .limit(100)
    //   .onSnapshot(querySnapshot => {
    //     const matchCollection = querySnapshot.docs.map<Match>(
    //       documentSnapshot => ({
    //         ...(documentSnapshot.data() as FirestoreMatch),
    //         id: documentSnapshot.id,
    //       })
    //     )

        // band-aid for a bug...
        // if (!matchCollection.length) { return }

        // setMatches(matchCollection)
      // })
  }, [])

  /* Check matches to see if user is a host or player already */
  useEffect(() => {
    const playing = matches?.find(m => {
      return m.players?.find(p => {
        return p.id === user?.id
      })
    })

    const hosting = matches?.find(m => m.createdBy.uid === user?.id)

    if (playing || hosting) {
      setCommitted(true)
    } else {
      setCommitted(false)
    }
  }, [matches])

  const createNewLobby = () => {
    // firestore()
    //   .collection('matches')
    //   .add({
    //     name: '',
    //     players: [{
    //       id: user?.id,
    //       name: user?.name,
    //       email: user?.email,
    //       score: 0,
    //     }],
    //     rounds: {
    //       1: { status: ROUND_STATES.CREATED, word: null, winner: null, started_at: null, timeRemaining: null, score: 0 },
    //       2: { status: ROUND_STATES.CREATED, word: null, winner: null, started_at: null, timeRemaining: null, score: 0 },
    //       3: { status: ROUND_STATES.CREATED, word: null, winner: null, started_at: null, timeRemaining: null, score: 0 },
    //       4: { status: ROUND_STATES.CREATED, word: null, winner: null, started_at: null, timeRemaining: null, score: 0 },
    //       5: { status: ROUND_STATES.CREATED, word: null, winner: null, started_at: null, timeRemaining: null, score: 0 },
    //       6: { status: ROUND_STATES.CREATED, word: null, winner: null, started_at: null, timeRemaining: null, score: 0 },
    //     },
    //     created_at: firestore.FieldValue.serverTimestamp(),
    //     started_at: null,
    //     ended_at: null,
    //     winner: null,
    //     round: 0,
    //     status: MATCH_STATES.MATCHMAKING,
    //     createdBy: {
    //       uid: user?.id,
    //       username: user?.name
    //     },
    //   } as FirestoreMatch)
        
    //   .then((result) => {
    //     props.navigation.navigate('Matchmaking', {
    //       matchId: result.id
    //     })
    //   });
  }

  const joinMatch = (match: Match) => {
    // add the user to the match.players array
    // firestore()
    //   .collection('matches')
    //   .doc(match.id)
    //   .update({
    //     players: [...match.players, user]
    //   } as Partial<FirestoreMatch>)
    //   .then(() => {
    //     console.log('Match updated!');
    //     props.navigation.navigate('Matchmaking', {
    //       matchId: match.id
    //     })
    //   });  
  }

  const EmptyMatches = () => {
    return (
      <View style={[ t.flexGrow, t.hFull, t.justifyCenter]}>
        <Image source={require('../../assets/empty-matches.png')} style={[ t.h64, t.objectContain, t.wFull]}/>
        <View>
          <Text style={[ t.fontBold, t.textCenter, t.textXl ]}>Aw, no one's playing.</Text>
          <Text style={[ t.fontBold, t.textCenter, t.textXl ]}>Go start a match!</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[t.mX4]}>
        <SCard style={ committed && [t.bgGray400] }>
            <TouchableOpacity onPress={() => createNewLobby()} disabled={committed}>
              { !committed ?
                <HostButton>
                  <Image source={require('../../assets/host.png')} style={[ t.hFull, t.objectContain, t.w1_2]}/>
                  <Text style={[t.w1_2, t.text3xl, { fontFamily: 'LuckiestGuy-Regular', color: '#2568EF' }]}>
                    Host a Match
                  </Text>
                </HostButton>
                :
                <HostButton>
                  <Image source={require('../../assets/no-host.png')} style={[ t.hFull, t.objectContain, t.w1_2]}/>
                  <Text style={[t.w1_2, t.text3xl, t.textGray600, { fontFamily: 'LuckiestGuy-Regular' }]}>
                    Already in a match!
                  </Text>
                </HostButton>
              }
            </TouchableOpacity>
          </SCard>
      </View>
      <View style={[t.hFull, t.p4, t.wFull]}>
        <Text style={[ t.text4xl, {fontFamily: 'LuckiestGuy-Regular'}]}>Matches</Text>
        <FlatList
          contentContainerStyle={ matches.length === 0 && [t.flexGrow, t.justifyCenter, { maxHeight: 500}] }
          data={matches}
          numColumns={2}
          ListEmptyComponent={EmptyMatches()}
          keyExtractor={(m) => m.id}
          renderItem={({item}) => {
            return (
              <MatchCard>
                <View style={[t.p4, t.pB2]}>
                  <Text style={[t.fontBold, t.textLg]}>{item.createdBy?.username}'s game</Text>
                  <View style={[t.flexRow, t.mT1 ]}>
                    <Text style={[ t.flex1, t.italic ]}>{item.status === MATCH_STATES.STARTED ? item.status : "waiting for players..."}</Text>
                    {
                      item.status === 'matchmaking' && <ActivityIndicator />
                    }
                  </View>
                  <NumberPlayers>{item.players.length}/4</NumberPlayers>
                </View>
                
                { /* I can join the match if: */
                  item.players.length < 4 && /* There is an empty space in [players] */
                  (item.players && !item.players.find(p => p.id === user?.id)) && /* I haven't already joined */
                  (
                    <JoinButton onPress={() => joinMatch(item)}>
                      <JoinButtonText>Join</JoinButtonText>
                    </JoinButton>
                  )
                }

                { /* I can enter the Match Lobby directly if I've already joined (I'm in 'players') */
                  (item.players && item.players.find(p => p.id === user?.id)) ? 
                  (
                    <JoinButton onPress={() => props.navigation.navigate('Matchmaking', { matchId: item.id })} >
                      <JoinButtonText>Enter</JoinButtonText>
                    </JoinButton>
                  ) : null
                }
              </MatchCard>
            )
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default Multiplayer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  match: {
    borderColor: '#000',
    borderWidth: 1,
    marginVertical: 2
  }
})

const SCard = styled(View)`
  ${[ t.h32, t.p4, t.m4, t.roundedLg, t.selfCenter, t.shadow, t.wFull, { backgroundColor: '#FFE8E7'} ]}
`;

const HostButton = styled(View)`
  ${[ t.flexRow, t.hFull, t.itemsCenter, t.wFull ]}
`;

const MatchCard = styled(View)`
  ${[ t.bgGray200, t.mR2, t.mY1, t.roundedLg, t.w1_2 ]}
`;

const NumberPlayers = styled(Text)`
  ${[ t.opacity25, t.pT4, t.selfCenter, t.text5xl, t.textGray900, { fontFamily: 'LuckiestGuy-Regular' } ]}
`;

const JoinButton = styled(TouchableOpacity)`
  ${[ t.p2, t.roundedBLg, { background: '#2568EF'} ]}
`;

const JoinButtonText = styled(Text)`
  ${[ t.fontBold, t.textCenter, t.textLg, t.textWhite, t.uppercase, { fontFamily: 'LuckiestGuy-Regular' } ]}
`;

