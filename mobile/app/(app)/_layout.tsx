import useSessionContext from '@/context/Session/useSessionContext'
import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { Redirect, Stack } from 'expo-router'

export default function Layout() {
  const { hasSession } = useSessionContext()

  const theme = useThemeContext()

  if (!hasSession) return <Redirect href="/join" />

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTintColor: theme.fg,
        headerStyle: { backgroundColor: theme.bgAlt },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="explore" options={{ headerShown: true }} />
      <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
    </Stack>
  )
}
