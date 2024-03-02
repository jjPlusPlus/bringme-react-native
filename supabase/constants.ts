/* Match states: 
 * enum, can only be one of these, can't be none of these
 * 'matchmaking': the host creates the match
 * 'started': the host hits the 'start match' button from the lobby screen
 * 'in-progress': the host has kicked off the first round
 * 'incomplete': the host ends the match early, OR all players abandon a match
 * 'complete': the match ends in the traditional sense
 * 'archived': the match is either complete/incomplete and soft-deleted
*/

export const MATCH_STATES = {
  MATCHMAKING: 'MATCHMAKING',
  STARTED: 'STARTED',
  INCOMPLETE: 'INCOMPLETE',
  COMPLETE: 'COMPLETE',
  ARCHIVED: 'ARCHIVED'
}

export const ROUND_STATES = {
  CREATED: 'CREATED',
  STARTED: 'STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  TIMED_OUT: 'TIMEOUT',
  COMPLETE: 'COMPLETE'
}

