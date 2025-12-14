import useSessionContext from '@/context/Session/useSessionContext'
import { Redirect, Stack } from 'expo-router'
import { memo } from 'react'
import { useJoinStackScreenOptions } from './hooks/useJoinStackScreenOptions/useJoinStackScreenOptions'

const JoinStack = memo(function JoinStack() {
  const { hasSession } = useSessionContext()

  const screenOptions = useJoinStackScreenOptions()

  if (hasSession) return <Redirect href="/(app)/(tabs)" />
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" />
    </Stack>
  )
})

export default JoinStack
