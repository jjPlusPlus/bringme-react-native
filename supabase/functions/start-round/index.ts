import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase_client = createClient(
  // Supabase API URL - env var exported by default when deployed.
  Deno.env.get('SUPABASE_URL') ?? '',
  // Supabase API SERVICE ROLE KEY - env var exported by default when deployed.
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
Deno.serve(async (req: any) => {
  try {
    const { round, roundWord } = await req.json() 
    if (!round) throw new Error("Missing 'round' in request body")

    const { data, error } = await supabase_client
      .from('rounds')
      .update({ 
        status: 'IN_PROGRESS',
        word: roundWord,
        started_at: new Date().toISOString(),
      })
      .eq('id', round.id)

    const getNextLeader = (match_snapshot: any) => {
      const { players, rounds } = match_snapshot
      const currentRound = rounds.find((r:any) => r.round_index === match_snapshot.round_index) || rounds[0]
      const currentLeader = players.find((p:any) => p.id === currentRound.leader)
      const currentLeaderIndex = players.indexOf(currentLeader)
      const nextLeaderIndex = currentLeaderIndex + 1
      const nextLeader = players[nextLeaderIndex].id
      return nextLeader
    }

    // using a javascript timeout feels gross to me... I would prefer to use a background worker or something
    // but I don't know how to do that in deno/supabase yet. 
    // This timeout could be unreliable if the server is under heavy load.
    setTimeout(async () => {
      const { data: round_snapshot, error: round_snapshot_error } = await supabase_client
        .from('rounds')
        .select('*')
        .eq('id', round.id)
        .single()

      if (round_snapshot?.status !== 'COMPLETE') {

        const { data: match_snapshot, error: match_snapshot_error } = await supabase_client
          .from('matches')
          .select(`
            id,
            room_code,
            status,
            round_index,
            rounds ( id, round_index, status, leader ),
            players:users!players ( id, username )
          `)
          .eq('id', round_snapshot.match_id)
          .single()
        
        // Time out the current round
        // Todo: this could potentially race against a current end-game call in a close game
        // we need to decide to keep everything on the server side or not
        await supabase_client
          .from('rounds')
          .update({ 
            status: 'TIMED_OUT',
            finished_at: new Date().toISOString(),
          })
          .eq('id', round.id)

        // prepare the next round
        const next_leader = getNextLeader(match_snapshot)
        console.log(next_leader || 'oh well?')
        await supabase_client
          .from('rounds')
          .update({
            status: 'ACTIVE',
            leader: next_leader
          })
          .eq('match_id', round_snapshot.match_id)
          .eq('round_index', round_snapshot.round_index + 1)
        
        // update the match
        await supabase_client
          .from('matches')
          .update({ 
            round_index: match_snapshot.round_index + 1
          })
          .eq('id', match_snapshot.id)
      }
    }, (Deno.env.get('EXPO_PUBLIC_ROUND_LENGTH') || 60) * 1000 )

    return new Response(
      JSON.stringify({ data, error }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 200 
      },
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

