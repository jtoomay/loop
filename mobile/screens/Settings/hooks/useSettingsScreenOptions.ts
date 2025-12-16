import { DrawerNavigationOptions } from '@react-navigation/drawer'
import { useMemo } from 'react'

export function useSettingsScreenOptions() {
  return useMemo(() => {
    const options: DrawerNavigationOptions = {
      headerShown: true,
      title: 'Settings',
    }
    return options
  }, [])
}
