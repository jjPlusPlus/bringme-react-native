import React, { useEffect, useState, createContext, useContext } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from './init'

export const UserContext = createContext<{ user: User | null; session: Session | null }>({
  user: null,
  session: null,
})

export const UserContextProvider = (props: any) => {
  const [session, setSession] = useState<any | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const getSession = async () => {
    const session = await supabase.auth.getSession()
    setSession(session)
    setUser(session?.data.session?.user ?? null)
  }

  useEffect(() => {
    getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => {
      authListener!.subscription.unsubscribe()
    }
  }, [])

  const value = {
    session,
    user,
  }
  return <UserContext.Provider value={value} {...props} />
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`)
  }
  return context
}