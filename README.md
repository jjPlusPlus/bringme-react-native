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
- Maintenance
  - [] Replace the "LuckiestGuy" font
  - [] Choose/Integrate animation library
- Login Page
  - [] Re-style the "Sign In With Google" button
- Registration Page
  - [] A user should be able to set their username when Registering
  - [] Re-style the page using brand style guide
- Settings page
  - [] A user should be able to update username
  - [] Show player stats (Win/Loss, total games played)
- Multiplayer Lobby & Matchmaking
  - [] A user should be able to create a new Match Lobby as a "Host"
  - [] A user should be able to join a Match Lobby using a 4-character code
  - [] The Host should be able to start a Match once there is at least one other player
    - [] When the Host starts the Match, the host and players should see the Match (/match/:matchId) View
      - [] If I'm a Player in a Match Lobby, and the Match['status'] goes from 'lobby' to 'starting', then I should navigate to /match/:matchId
  - [] A player should only be able to join or host one match at a time
  - [] Players must confirm they want to back out of a Match Lobby 
  - [] Players should be removed from the Match if they leave a Match Lobby
