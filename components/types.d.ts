
interface User {
  id: string
  username?: string | null
  email: string
  auth_uuid: string
  created_at: string
  updated_at?: string
}

export interface Match {
  id: string
  room_code: string
  status: string
  players: User[]
  host: User
}
export interface Round {
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