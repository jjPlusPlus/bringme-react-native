# Bring Me (Native Build)
Runs the "Bring Me" game in IOS & Android using React Native. 

## Implementation Details
BringMe for native uses React Native with Expo for managing native development and builds. The noSQL database and other back-end services are implemented through Firebase. 

The main Image Recognition module for the main game mechanic is implemented using Google MLKit. 

## Building the App 
To start working locally, you will need a Firebase project with ios/android enabled. You will also need to have ExpoCLI installed globally.  

Clone this repo, run `npm install`, and then `pod install` inside the /ios directory. You will then need a copy of the `GoogleService-Info.plist` file from your Firebase project to link in Xcode before running the project.

### Dependencies worth mentioning 
[ExpoKit (Bare Workflow)](https://docs.expo.io/expokit/eject/)
[react-native-firebase](https://rnfirebase.io/)  
[react-native-camera](https://react-native-community.github.io/react-native-camera/docs/rncamera)  

### Todo:
- Settings page
  - [X] Ability to update username
  - [] Player stats (Win/Loss, total games played)
- Multiplayer Lobby & Matchmaking
  - [x] The host should be able to Start a match once Players is filled
    - [x] When the host starts the match, the host and players should be moved to the /match/:matchId screen
      - [x] If I'm a Player in a Match Lobby, and the Match['status'] goes from 'matchmaking' to 'starting', then I should navigate to /match/:matchId
  - [] A player should only be able to join one match at a time
  - [] Players must confirm they want to back out of a Match Lobby 
  - [] Players should be removed if they leave a Match Lobby
  - [] [#notSureIf]: A Host should enter the Match [words] before starting the match
  - [] Set up tailwind, and style all initial views
  - [] Generate and implement a WIP logo for development

Single player mode
  - need to test out the camera
  - need to build the game UI over the camera (or around it)
  - need to incorporate logic from the web version (sagas and whatnot)

### Using Firestore for state management and Realtime Updates
The web version of the game runs using a custom Node websocket server, with react sagas handling state management and updates on the client side. For the Native version, we started looking into implementing all of the real-time game mechanics using Firebase Firestore. How great would it be if we could leverage our database to handle the serverside game-logic, and forego the need to build and maintain a robust socket server?

__Transactions to settle conflicts__
Consider a situation where two users find a match simultaneously, and their devices both send an update to their __Match__ saying that they are the winner. The _second_ user to write to the record would be the one to get the points. Both users would technically update the __Match__ record. 

We make use of Firestore _Transactions_ to handle complex logic within updates like these to disallow multiple writes to the same field on a document.
