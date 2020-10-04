interface FirestoreUser {
  name: string,
  email: string
  user: string,
}

type User = FirestoreUser & { id: string }

interface FirestoreMatch {
  host: string,
  name?: string,
  players: string,
  created_at: string,
  started_at?: string,
  ended_at?: string,
  winner?: string,
  status: string
}

type Match = FirestoreMatch & { id: string }
