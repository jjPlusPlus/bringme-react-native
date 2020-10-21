type FieldValue = import('@react-native-firebase/firestore').FirebaseFirestoreTypes.FieldValue

interface FirestoreUser {
  name: string,
  email: string
  user: string,
}

type User = FirestoreUser & { id: string }

interface FirestoreMatch {
  createdBy: { uid: string; username: string }
  name?: string,
  players: Array<User & { score?: number }>
  rounds: {
    [k: string]: {
      word: string | null
      winner: string | null
      started_at: string | null
      timeRemaining: string | null
      score: number
    }
  }
  created_at: FieldValue
  started_at: string | null
  ended_at: string | null
  winner: string | null
  round: number
  status: string
}

type Match = FirestoreMatch & { id: string }
