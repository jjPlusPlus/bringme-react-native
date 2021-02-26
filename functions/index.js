const functions = require("firebase-functions");

// exports.scheduledFunction = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
//   console.log('This will be run every 5 minutes!');
//   return null;
// });

/* END ROUND
 * Ends a round after 60s
 * We want to ONLY act when a round in a match 
 * has it's 'status' change from [anything but 'started'] to 'started'
 * This function will run ANY TIME a match is updated
 * When the 'round' changes, when a 'winner' is set, when the 'rounds' are created...
 * And we want to ignore all of those, and ONLY run when the match.rounds.[round].status changes > "started" 
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
        change.after.ref.set({
          rounds: {
            ...after.rounds,
            [after.round + 1]: {
              ...after.rounds[after.round + 1],
              status: 'timeout'
            }
          }
        }, { merge: true })
      }, 60000)
    }
  })