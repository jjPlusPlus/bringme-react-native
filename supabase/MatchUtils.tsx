import React, { useState, useEffect } from 'react'
import { supabase } from './init'
import { MATCH_STATES } from './constants'
import { User, Match, Round } from '../components/types'

export function useMatchData(room_code:string | undefined) {

  const getMatchData = async () => {
    if (!room_code) {
      return {}
    }
    let { data, error: matchError } = await supabase
      .from('matches')
      .select(`
        id,
        room_code,
        status,
        round_index,
        rounds ( id, round_index, status, time, started_at, finished_at, time_remaining, points, word, winner, leader ),
        players:users!players ( id, username ),
        host:users!matches_host_fkey ( id, username )
      `)
      .eq('room_code', room_code)
      .single()
    if (matchError || !data) {
      // TODO: handle the error
      // Possibly re-route to Home and show an error message
      console.log('getMatchData match error: ', matchError)
      return {}
    } else {
      setMatchData({
        ...(data as Match),
        status: data?.status || MATCH_STATES.MATCHMAKING,
        host: data?.host || { id: '', username: null }
      })
    }
  }

  const subscribeToMatchUpdates = async (matchId:string) => {
    console.log(`subscribing to match updates`)
    if (matchId) {
      supabase
        .channel(`matches:${matchId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'matches',
            filter: `id=eq.${matchId}` 
          }, getMatchData
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'players',
            filter: `match_id=eq.${matchId}` 
          }, getMatchData
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'rounds',
            filter: `match_id=eq.${matchId}`
          }, getMatchData
        )
        .subscribe((status, err) => {
          if (status) {
          } else if (err) {
            console.log('error subscribing to match updates: ', err.message)
          }
        })
    }
  }

  const leaveMatch = async (match_id: string, user_id: string) => {
    if (!match_id || !user_id) {
      return
    }
    const { error } = await supabase.functions.invoke('leave-match', {
      body: { 
        user: user_id, 
        match: match_id
      },
    })
    // if USER fails to leave the match, show an error message
    if (error?.message) {
      alert(error.message)
      return
    }
    // removing the room code should successfully boot the user back to the lobby
    supabase.removeAllChannels()
  }

  const startMatch = async () => {
    console.log('starting match')
    const { data, error } = await supabase.functions.invoke('start-match', {
      body: { 
        match_id: matchData?.id
      },
    })
    if (error) {
      return console.log('error starting match: ', error)
    }
  }

  const startRound = async (round: Round, roundWord: string) => {
    if (!roundWord || roundWord.length < 1) {
      return
    }
    console.log('starting round')
    const { data, error } = await supabase.functions.invoke('start-round', {
      body: { 
        round: round,
        roundWord: roundWord
      },
    })
    if (error) {
      return console.log('error starting round: ', error)
    }
    
  }

  const getNextLeader = () => {
    const { players, rounds } = matchData
    const currentRound = rounds.find((r:Round) => r.round_index === matchData.round_index) || rounds[0]
    const currentLeader = players.find((p:User) => p.id === currentRound.leader)
    const currentLeaderIndex = players.indexOf(currentLeader)
    const nextLeaderIndex = currentLeaderIndex + 1
    const nextLeader = players[nextLeaderIndex].id
    return nextLeader
  }

  const acceptSubmission = async (round: Round, player: User) => {
    const time_remaining = round.time - (Math.round( Date.now() / 1000 ) - Math.round( new Date(round.started_at).getTime() / 1000 ))
    const final_score = 100 + time_remaining
    // update the current round
    const { data: roundUpdateData, error: roundUpdateError } = await supabase
      .from('rounds')
      .update({ 
        status: 'COMPLETE',
        finished_at: new Date().toISOString(),
        time_remaining: time_remaining,
        winner: player.id,
        points: final_score
      })
      .eq('id', round.id)

    // get the next round
    const { data: next_round, error: next_round_error } = await supabase
      .from('rounds')
      .select('*')
      .eq('match_id', matchData.id)
      .eq('round_index', round.round_index + 1)
      .single()

      // prepare the next round
    const { data: nextRoundData, error: nextRoundError } = await supabase
      .from('rounds')
      .update({
        status: 'STARTED',
        leader: getNextLeader()
      })
      .eq('id', next_round.id)

    // update the match
    const { data: matchUpdateDate, error: matchUpdateError } = await supabase
      .from('matches')
      .update({ 
        round_index: matchData.round_index + 1
      })
      .eq('id', matchData.id)
  }

  const [matchData, setMatchData] = useState<any>()

  useEffect(() => {
    getMatchData()
  }, [])

  useEffect(() => {
    if (matchData) {
      subscribeToMatchUpdates(matchData.id)
    }
  }, [matchData])

  return {
    matchData,
    startMatch,
    leaveMatch,
    startRound,
    acceptSubmission
  }
}