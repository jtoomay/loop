import useSessionContext from '@/context/Session/useSessionContext'
import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { Redirect, Stack } from 'expo-router'
import { memo, useMemo } from 'react'

function useScreenOptions(): NativeStackNavigationOptions {
  const theme = useThemeContext()
  return useMemo(() => ({ headerShown: false, contentStyle: { backgroundColor: theme.bg } }), [theme])
}

const JoinStack = memo(function JoinStack() {
  const { hasSession } = useSessionContext()

  const screenOptions = useScreenOptions()

  if (hasSession) return <Redirect href="/(app)/(tabs)" />
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" />
    </Stack>
  )
})

export default JoinStack
