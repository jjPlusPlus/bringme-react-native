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
