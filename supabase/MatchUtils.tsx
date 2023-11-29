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
  status: string
  players: User[]
  host: User
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
        ...data,
        status: data?.status || MATCH_STATES.MATCHMAKING,
        host: data?.host || { id: '', username: null }
      })
    }
  }

  const [matchData, setMatchData] = useState<any>(() => {
    return getMatchData()
  })

  useEffect(() => {
    if (matchData) {
      subscribeToMatchUpdates(matchData.id)
    }
  }, [matchData])

  const subscribeToMatchUpdates = async (matchId:string) => {
    console.log('subscribing to match updates')
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
            console.log('match status: ', status)
          } else if (err) {
            console.log('error subscribing to match updates: ', err.message)
          }
        })
    }
  }

  const updateMatchData = () => {

  }

  const addPlayerToMatch = () => {

  }

  const removePlayerFromMatch = () => {

  }

  return [
    matchData,
    subscribeToMatchUpdates,
    getMatchData,
    updateMatchData,
    addPlayerToMatch,
    removePlayerFromMatch,
  ]
}