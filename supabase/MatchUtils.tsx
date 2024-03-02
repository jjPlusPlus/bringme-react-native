import React, { useState, useEffect } from 'react'
import { supabase } from './init'
import { MATCH_STATES } from './constants'

interface User {
  id: string
  username: string | null
}
interface Match {
  id: string
  room_code: string
  round_index: number
  status: string
  players: User[]
  host: User
}
interface Round {
  id: string
  created_at: string
  match_id: string
  leader: string
  winner: User
  word: string
  points: number
  time: number
  time_remaining: number
  started_at: string
  finished_at: string
  status: string
  round_index: number
}

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

  const [matchData, setMatchData] = useState<any>()

  useEffect(() => {
    getMatchData()
  }, [])

  useEffect(() => {
    if (matchData) {
      subscribeToMatchUpdates(matchData.id)
    }
  }, [matchData])

  return [
    matchData,
    startMatch,
    leaveMatch
  ]
}