import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import Ionicons from '@react-native-vector-icons/ionicons'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { DrawerToggleButton } from '@react-navigation/drawer'
import { useMemo } from 'react'

export function useHomeTabsStackScreenOptions() {
  const theme = useThemeContext()
  return useMemo(() => {
    const options: BottomTabNavigationOptions = {
      headerShown: false,
      tabBarStyle: { backgroundColor: theme.bgAlt, borderColor: theme.border, paddingTop: 10 },
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: theme.fgMuted,
      tabBarShowLabel: false,
      sceneStyle: { backgroundColor: theme.bg },
      headerLeft: ({ tintColor }) => <DrawerToggleButton tintColor={tintColor} />,
      tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
    }
    return options
  }, [theme])
}
