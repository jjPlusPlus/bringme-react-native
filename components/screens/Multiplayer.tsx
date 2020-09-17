import React, { useState, useEffect } from 'react'

import { ActivityIndicator, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import firestore from '@react-native-firebase/firestore'
import { t } from 'react-native-tailwindcss';
import styled from 'styled-components/native';

interface User {
  uid?: string,
  email?: string,
  name?: string,
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

export default function Multiplayer(props: any) {
  const [user, setUser] = useState<User | null>(null)
  const [matches, setMatches] = useState([])
  const [committed, setCommitted] = useState(true)

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
  }, [props.user])


  /* 
    Get a manicured list of collections
    Sorted by newest-first, limit of 100
    Only games that are in matchmaking or in progress
  */
  useEffect(() => {
    firestore()
      .collection('matches')
      // .where('status', 'in', ['matchmaking', 'in-progress'])
      .orderBy('created_at', 'desc')
      .limit(100)
      .onSnapshot(querySnapshot => {
        const matchCollection: Match[] = [];
        querySnapshot?.forEach((documentSnapshot: any) => {
          // console.log(documentSnapshot)
          const data: Match = documentSnapshot.data()
          matchCollection.push({
            ...data,
            id: documentSnapshot.id
          });
        });

        // band-aid for a bug...
        if (!matchCollection.length) { return }

        setMatches(matchCollection)
      })
  }, [])

  /* Check matches to see if user is a host or player already */
  useEffect(() => {
    const playing = matches?.find(m => {
      return m.players?.find(p => {
        return p.id === user?.id
      })
    })

    const hosting = matches?.find(m => m.host.uid === user?.id)

    if (playing || hosting) {
      setCommitted(true)
    } else {
      setCommitted(false)
    }
  }, [matches])

  const createNewLobby = () => {
    firestore()
      .collection('matches')
      .add({
        host: { uid: user?.id, username: user?.name },
        name: '',
        players: [],
        created_at: firestore.FieldValue.serverTimestamp(),
        started_at: null,
        ended_at: null,
        winner: null,
        status: 'matchmaking' 
      })
      .then((result) => {
        props.navigation.navigate('Matchmaking', {
          matchId: result.id
        })
      });
  }

  const joinMatch = (match: any) => {
    // add the user to the match.players array
    firestore()
      .collection('matches')
      .doc(match.id)
      .update({
        players: [...match.players, user]
      })
      .then(() => {
        console.log('Match updated!');
        props.navigation.navigate('Matchmaking', {
          matchId: match.id
        })
      });  
  }

  return (
    <SafeAreaView style={styles.container}>
      {!committed &&
        <View style={[t.mX4]}>
          <SCard>
              <HostButton onPress={() => createNewLobby()}>
                <Image source={require('../../assets/host.png')} style={[ t.hFull, t.objectContain, t.w1_2]}/>
                <Text style={[t.w1_2, t.text3xl, { fontFamily: 'LuckiestGuy-Regular', color: '#2568EF' }]}>
                  Host a Match
                </Text>
              </HostButton>
            </SCard>
        </View>
      }
      <ScrollView style={[t.p4, t.wFull]}>
        <Text style={[ t.text4xl, {fontFamily: 'LuckiestGuy-Regular'}]}>Matches</Text>
        <FlatList
          data={matches}
          numColumns={2}
          keyExtractor={(m) => m.id}
          renderItem={({item}) => {
            return (
              <MatchCard>
                <View style={[t.p4, t.pB2]}>
                  <Text style={[t.fontBold, t.textLg]}>{item.host?.username}'s game</Text>
                  <View style={[t.flexRow, t.mT1 ]}>
                    <Text style={[ t.flex1, t.italic ]}>{item.status === 'in-progress' ? item.status : "waiting for players..."}</Text>
                    {
                      item.status === 'matchmaking' && <ActivityIndicator />
                    }
                  </View>
                  <NumberPlayers>{item.players.length}/4</NumberPlayers>
                </View>
                
                { /* I can join the match if: */
                  item.host.uid !== user?.id && /* I'm not the host */
                  item.players.length < 4 && /* There is an empty space in [players] */
                  (item.players && !item.players.find(p => p.id === user?.id)) && /* I haven't already joined */
                  (
                    <JoinButton title="Join" onPress={() => joinMatch(item)}>
                      <JoinButtonText>Join</JoinButtonText>
                    </JoinButton>
                  )
                }

                { /* I can enter the Match Lobby directly if */
                  item.host.uid === user?.id || /* if I'm the host */
                  (item.players && item.players.find(p => p.id === user?.id)) ? /* I've already joined */
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
      </ScrollView>
    </SafeAreaView>
  )
}

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

const HostButton = styled(TouchableOpacity)`
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

