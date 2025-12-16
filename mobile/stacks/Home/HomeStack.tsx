import { useHomeScreenOptions } from '@/screens/Home/hooks/useHomeScreenOptions'
import { useIdScreenOptions } from '@/screens/Id/hooks/useIdScreenOptions'
import { Stack } from 'expo-router'
import { memo } from 'react'
import { useHomeStackScreenOptions } from './hooks/useHomeStackScreenOptions'

const HomeStack = memo(function HomeStack() {
  const screenOptions = useHomeStackScreenOptions()
  const homeScreenOptions = useHomeScreenOptions()
  const idScreenOptions = useIdScreenOptions()

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={homeScreenOptions} />
      <Stack.Screen name="[id]" options={idScreenOptions} />
    </Stack>
  )
})

export default HomeStack
