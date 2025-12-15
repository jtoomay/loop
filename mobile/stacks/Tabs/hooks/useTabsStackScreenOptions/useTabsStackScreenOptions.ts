import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { useMemo } from 'react'

export function useTabsStackScreenOptions() {
  const theme = useThemeContext()

  return useMemo(() => {
    const options: BottomTabNavigationOptions = {
      headerTintColor: theme.fg,
      headerStyle: { backgroundColor: theme.bgAlt },
      tabBarStyle: { backgroundColor: theme.bgAlt, borderColor: theme.border, paddingTop: 10 },
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: theme.fgMuted,
      tabBarShowLabel: false,
      sceneStyle: { backgroundColor: theme.bg },
    }
    return options
  }, [theme])
}
