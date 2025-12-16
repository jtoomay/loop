import { useCreateScreenOptions } from '@/screens/Create/hooks/useCreateScreenOptions'
import { useProfileScreenOptions } from '@/screens/Profile/hooks/useProfileScreenOptions'
import { Tabs } from 'expo-router'
import { memo } from 'react'
import { useHomeTabsStackScreenOptions } from '../Home/hooks/useHomeTabsStackScreenOptions'
import { useTabsStackScreenOptions } from './hooks/useTabsStackScreenOptions'

const TabsStack = memo(function TabsStack() {
  const screenOptions = useTabsStackScreenOptions()
  const homeScreenOptions = useHomeTabsStackScreenOptions()
  const createScreenOptions = useCreateScreenOptions()
  const profileScreenOptions = useProfileScreenOptions()

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="(home)" options={homeScreenOptions} />
      <Tabs.Screen name="create" options={createScreenOptions} />
      <Tabs.Screen name="profile" options={profileScreenOptions} />
    </Tabs>
  )
})

export default TabsStack
