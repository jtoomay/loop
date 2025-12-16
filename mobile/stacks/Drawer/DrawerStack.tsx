import { useSettingsScreenOptions } from '@/screens/Settings/hooks/useSettingsScreenOptions/useSettingsScreenOptions'
import { Drawer } from 'expo-router/drawer'
import { memo } from 'react'
import { useTabsDrawerStackScreenOptions } from '../Tabs/hooks/useTabsDrawerStackScreenOptions/useTabsDrawerStackScreenOptions'
import { useDrawerStackScreenOptions } from './hooks/useDrawerStackScreenOptions/useDrawerStackScreenOptions'

const DrawerStack = memo(function DrawerStack() {
  const screenOptions = useDrawerStackScreenOptions()
  const tabsScreenOptions = useTabsDrawerStackScreenOptions()
  const settingsScreenOptions = useSettingsScreenOptions()

  return (
    <Drawer screenOptions={screenOptions}>
      <Drawer.Screen name="(tabs)" options={tabsScreenOptions} />
      <Drawer.Screen name="settings" options={settingsScreenOptions} />
    </Drawer>
  )
})

export default DrawerStack
