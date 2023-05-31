const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

exports.playerScored = functions.https.onCall((data, context) => {
  console.log('a player scored')
  let { match, confidence, player, submission } = data
  // match = JSON.parse(match)
  
  // duplicate of rounds
  const rounds = JSON.parse(JSON.stringify(match.rounds))
  const startedAt = rounds[match.round + 1].started_at
  const timeRemaining = 60 - Math.round( (Date.now() - startedAt) / 1000 )
  const score = 100 + timeRemaining + Math.floor(confidence)

  rounds[match.round + 1].winner = {
    player: player.id, 
    name: player.name,
    score: score,
    submission: submission
  }
  rounds[match.round + 1].status = "complete"

  // set the player submission and increase score by 100
  const players = match.players.map(p => {
    if (p.id === player.id) {
      p.score = (p.score || 0) + score
    }
    // reset the current submission for all players
    p.submission = null
    return p
  })

  return admin.firestore()
    .collection('matches')
    .doc(match.id)
    .update({
      rounds: rounds,
      players: players,
      round: match.round + 1
    })
    .then(() => {
      console.log('Match updated!')
    })
});

/* END ROUND
 * Ends a round after 60s
 * We want to ONLY act when a round in a match 
 * has it's 'status' change from [anything but 'started'] to 'started'
 * This function will run ANY TIME a match is updated
 * When the 'round' changes, when a 'winner' is set, when the 'rounds' are created...
 * And we want to ignore all of those, and ONLY run when the match.rounds.[round].status changes > "started" 
*/

/* can we schedule a job to trigger 60s later? 
 * "cloud task"
*/
exports.startRoundTimer = functions.firestore
  .document('matches/{matchId}')
  .onUpdate((change, context) => {
    const params = context.params

    const after = change.after.data()
    const before = change.before.data()
    const isStartedNow = after.rounds[before.round + 1].status === 'started'
    const wasntStartedBefore = before.rounds[before.round + 1].status !== 'started'

    if (isStartedNow && wasntStartedBefore) {
      // we can assume that the round status JUST changed to 'started'
      setTimeout(() => {

        admin.firestore().collection('matches').doc(before.id).get().then((doc) => {
          if (doc.exists) {
            const matchDoc = doc.data()
            const rounds = JSON.parse(JSON.stringify(matchDoc.rounds))
            const roundObject = rounds[before.round]
            
            if (roundObject.status !== 'complete') {
              change.after.ref.set({
                rounds: {
                  ...after.rounds,
                  [after.round + 1]: {
                    ...after.rounds[after.round + 1],
                    status: 'timeout'
                  }
                }
              }, { merge: true })
            } else {
              console.log('The match has a winner and is "complete"- don\'t overwrite status')
            }
          } else {
            console.log('couldn\'t find match document after startRoundTimer clock ran out')
          }
        })


      }, 60000)




    }
  })