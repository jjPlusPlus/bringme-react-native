
import { useState, useEffect } from 'react'

const useTimeRemaining = ( start: string, seconds: number): number => {
  const [remaining, setRemaining] = useState('')

  useEffect(() => {
    if (!start || !seconds) { return }

    const timer: NodeJS.Timeout = setInterval(() => {
      // start time is an ISO string, convert to unix seconds
      const start_in_seconds = Math.round( new Date(start).getTime() / 1000 )
      const now = Math.round( Date.now() / 1000 )
      const remainder = seconds - (now - start_in_seconds)

      // we want remainder to be a countdown if it's over the round length in seconds
      if (remainder > seconds) {
        return setRemaining((remainder - seconds).toString() || '')
      }

      setRemaining(remainder.toString() || '')

      // redundant (because a remainder of zero is also !remainder) but explicit
      if (!remainder || remainder == 0) {
        return clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [start])

  return parseInt(remaining)
}

export default useTimeRemaining