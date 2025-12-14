import useSessionContext from '@/context/Session/useSessionContext'
import { Redirect, Stack } from 'expo-router'

export default function Layout() {
  const { hasSession } = useSessionContext()

  if (hasSession) return <Redirect href="/(app)/(tabs)" />
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  )
}
