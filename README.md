# Bring Me (Native Build)
Runs the "Bring Me" game in IOS & Android using React Native. 

## Implementation Details
BringMe for native uses React Native with Expo for managing native development and builds. The ~noSQL~ Postgres database and other back-end services are implemented through ~Firebase~ Supabase. 

The main Image Recognition module for the main game mechanic is implemented using ~AWS Rekognition~ ~Google MLKit~ rn-native-camera. 

## Building the App 
To start working locally, you will need to connect a Supabase project. You will also need to have ExpoCLI installed globally.  

### Major Dependencies
[ExpoKit (Bare Workflow)](https://docs.expo.io/expokit/eject/)
~[react-native-firebase](https://rnfirebase.io/)~  
[Supabase](https://supabase.com)
~[react-native-camera](https://react-native-community.github.io/react-native-camera/docs/rncamera)~  

### Expo SDK's
- Expo Secure Store
- Expo Font

### Todo:
- Settings page
  - [] Ability to update username
  - [] Player stats (Win/Loss, total games played)
- Multiplayer Lobby & Matchmaking
  - [] The host should be able to Start a match once Players is filled
    - [] When the host starts the match, the host and players should be moved to the /match/:matchId screen
      - [] If I'm a Player in a Match Lobby, and the Match['status'] goes from 'matchmaking' to 'starting', then I should navigate to /match/:matchId
  - [] A player should only be able to join or host one match at a time
  - [] Players must confirm they want to back out of a Match Lobby 
  - [] Players should be removed if they leave a Match Lobby
  - [] [#notSureIf]: A Host should enter the Match [words] before starting the match
  - [] Sorting on MultiPlayer screen: 'my' match (whether as a host or player) should be first  
  - [] Filtering on MultiPlayer screen: debug broken realtime updates 
  - [] Investigate implementing a player status enum instead of manually checking if they're playing/hosting
  - [] Set up tailwind, and style all initial views
  - [] Generate and implement a WIP logo for development