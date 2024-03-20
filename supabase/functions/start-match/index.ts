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
    const { match_id } = await req.json() // throws an error
    if (!match_id) throw new Error("Missing 'match_id' in request body")

    // Update the match status to 'started'
    const { data, error } = await supabase_client
      .from('matches')
        .update({ status: 'STARTED' })
        .eq('id', match_id)
        .select()

    // Get the first player in the match
    const { data: players, error: playersError } = await supabase_client
      .from('players')
        .select('*')
        .eq('match_id', match_id)
        
    // Update the first round to 'starting' and set the round leader
    const { error: leaderError } = await supabase_client
      .from('rounds')
        .update({ 
          status: 'ACTIVE',
          leader: players[0].user_id
        })
        .eq('match_id', match_id)
        .eq('round_index', 0)

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

