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
    const { user, match } = await req.json() // throws an error
    if (!user || !match) throw new Error("Missing 'user' in request body")

    const { error } = await supabase_client
      .from('players')
        .delete()
        .eq('match_id', match)
        .eq('user_id', user)
    return new Response(
      JSON.stringify({ error }),
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

