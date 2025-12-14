import { useCreateScreenOptions } from '@/screens/Create/hooks/useCreateScreenOptions/hooks/useCreateScreenOptions'
import { useHomeScreenOptions } from '@/screens/Home/hooks/useHomeScreenOptions/useHomeScreenOptions'
import { useProfileScreenOptions } from '@/screens/Profile/hooks/useProfileScreenOptions/useProfileScreenOptions'
import { Tabs } from 'expo-router'
import { memo } from 'react'
import { useTabsStackScreenOptions } from './hooks/useTabsStackScreenOptions/useTabsStackScreenOptions'

const TabsStack = memo(function TabsStack() {
  const screenOptions = useTabsStackScreenOptions()
  const homeScreenOptions = useHomeScreenOptions()
  const createScreenOptions = useCreateScreenOptions()
  const profileScreenOptions = useProfileScreenOptions()

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="index" options={homeScreenOptions} />
      <Tabs.Screen name="create" options={createScreenOptions} />
      <Tabs.Screen name="profile" options={profileScreenOptions} />
    </Tabs>
  )
})

export default TabsStack
