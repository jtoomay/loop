import useSessionContext from '@/context/Session/useSessionContext'
import { useExploreScreenOptions } from '@/screens/Explore/hooks/useExploreScreenOptions/useExploreScreenOptions'
import { useSettingsScreenOptions } from '@/screens/Settings/hooks/useSettingsScreenOptions/useSettingsScreenOptions'
import { Redirect, Stack } from 'expo-router'
import { memo } from 'react'
import { useAppScreenOptions } from './hooks/useAppStackScreenOptions/useAppStackScreenOptions'

const AppStack = memo(function AppStack() {
  const { hasSession } = useSessionContext()

  const screenOptions = useAppScreenOptions()
  const exploreScreenOptions = useExploreScreenOptions()
  const settingsScreenOptions = useSettingsScreenOptions()

  if (!hasSession) return <Redirect href="/join" />
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="explore" options={exploreScreenOptions} />
      <Stack.Screen name="settings" options={settingsScreenOptions} />
    </Stack>
  )
})

export default AppStack
