import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { DrawerNavigationOptions } from '@react-navigation/drawer'
import { useMemo } from 'react'

export function useDrawerStackScreenOptions() {
  const theme = useThemeContext()

  return useMemo(() => {
    const options: DrawerNavigationOptions = {
      headerShown: false,
      headerTintColor: theme.fg,
      headerStyle: { backgroundColor: theme.bg },
      sceneStyle: { backgroundColor: theme.bg },
      drawerStyle: { backgroundColor: theme.bg },
      drawerActiveTintColor: theme.primary,
      drawerInactiveTintColor: theme.fg,
      drawerActiveBackgroundColor: theme.bgAlt,
    }
    return options
  }, [theme])
}
