import React, { useState, useEffect, FunctionComponent } from 'react'

import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { supabase } from '../../supabase/init'
import { styled } from "nativewind"

import pen from '../../assets/register.png'

interface Props {
  user: User;
}

const Settings: FunctionComponent<Props> = (props) => {
  const { user } = props

  const [userName, setUsername] = useState('')
  const [error, setError] = useState<{ [field: string]: string | undefined }>({})

  useEffect(() => {
    validateUsername()
  }, [userName])

  const validateUsername = () => {
    if (userName.length < 3) {
      return setError({ userName: "Your username must be at least 3 characters" })
    }
    if (userName.match(/[^a-zA-Z0-9]/)) {
      return setError({ userName: "Usernames can only include letters and numbers" })
    }
    return setError({})
  }

  const saveUsername = () => {
    if (Object.keys(error).length) {
      return
    }
  }

  if (!user) {
    return <View style={styles.container}><Text>Error: User Not Found</Text></View>
  }

  return (
    <View className="bg-white flex-1 p-4">
      <Image source={pen} resizeMode="contain" className="h-40" />
      <View className="flex-1 py-8">
        <Text className="font-lucky text-bmBlue text-lg tracking-wide uppercase">Username</Text>
        <StyledInput
          onChangeText={text => {
            setUsername(text)
          }}
          defaultValue={user.name}
        />
        {error.userName && <Text className="text-gray-600">{error.userName}</Text>}
      </View>
      <View className="my-8">
        <StyledButton onPress={saveUsername}>
          <StyledButtonText>Save</StyledButtonText>
        </StyledButton>
        <TouchableOpacity className="mt-2 py-4" onPress={async () => { await supabase.auth.signOut() }}>
          <Text className="font-lucky text-3xl text-bmBlue text-center">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const StyledInput = styled(TextInput, 'border-bmBlue border-4 my-2 p-4 rounded-[20px] text-black w-full');
const StyledButton = styled(TouchableOpacity, 'bg-bmBlue items-center justify-center mt-4 p-4 pb-3 rounded-[20px]');
const StyledButtonText = styled(Text, 'text-white font-bold font-lucky text-center text-3xl uppercase');