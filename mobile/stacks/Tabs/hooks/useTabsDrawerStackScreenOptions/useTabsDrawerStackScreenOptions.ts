import { DrawerNavigationOptions } from '@react-navigation/drawer'
import { useMemo } from 'react'

export function useTabsDrawerStackScreenOptions() {
  return useMemo(() => {
    const options: DrawerNavigationOptions = {
      title: 'Home',
    }
    return options
  }, [])
}
