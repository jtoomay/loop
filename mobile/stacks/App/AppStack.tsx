import useSessionContext from '@/context/Session/useSessionContext'
import { useExploreScreenOptions } from '@/screens/Explore/hooks/useExploreScreenOptions'
import { Redirect, Stack } from 'expo-router'
import { memo } from 'react'
import { useAppScreenOptions } from './hooks/useAppStackScreenOptions'

const AppStack = memo(function AppStack() {
  const { hasSession } = useSessionContext()

  const screenOptions = useAppScreenOptions()
  const exploreScreenOptions = useExploreScreenOptions()

  if (!hasSession) return <Redirect href="/join" />
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="explore" options={exploreScreenOptions} />
    </Stack>
  )
})

export default AppStack
