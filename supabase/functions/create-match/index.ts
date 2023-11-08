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
    const { user } = await req.json() // throws an error
    if (!user) throw new Error("Missing 'user' in request body")

    const room_code = await generateRandomRoomCode()

    const { data: matchData, error: matchError } = await supabase_client
      .from('matches')
      .insert([
        { 
          room_code: room_code,
          host: user.id
        },
      ])
      .select('*')

    const { data: playersData, error: playersError } = await supabase_client
      .from('players')
      .upsert([
        {
          match_id: matchData[0].id,
          user_id: "6708297e-50cf-49a0-b1ab-2d699bb31542",
        },
        {
          match_id: matchData[0].id,
          user_id: "e7207f5d-b272-4f4b-b692-f588387a9fd7"
        }
      ])

    return new Response(
      JSON.stringify(matchData[0]),
      { 
        headers: { "Content-Type": "application/json" },
        status: 200 
      },
    )
  } catch (error: any) {
    console.log(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

// Need to keep checking that the room_code we generate is unique
const generateRandomRoomCode = async () => {
  let roomCode
  let isUnique = false
  while (!isUnique) {
    roomCode = buildRoomCode()
    const { data, error } = await supabase_client
      .from('matches')
      .select()
      .eq('room_code', roomCode)
    if (!error && !data.length) {
      isUnique = true
    }
  }
  return roomCode
}

// Generate a random alphanumeric 4 character string
const buildRoomCode = () => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    code += charset[randomIndex]
  }
  return code
}



