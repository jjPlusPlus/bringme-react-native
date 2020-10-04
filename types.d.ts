interface User {
  name: string,
  uid: string,
  email: string
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
