import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import Ionicons from '@react-native-vector-icons/ionicons'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { Tabs } from 'expo-router'
import { memo, useMemo } from 'react'

function useScreenOptions(): BottomTabNavigationOptions {
  const theme = useThemeContext()
  return useMemo(
    () => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: theme.bgAlt,
        borderColor: theme.border,
        paddingTop: 10,
      },
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: theme.fgMuted,
      tabBarShowLabel: false,
      sceneStyle: { backgroundColor: theme.bg },
    }),
    [theme],
  )
}

function useHomeScreenOptions(): BottomTabNavigationOptions {
  return useMemo(
    () => ({
      tabBarIcon: ({ color, size }) => (
        <Ionicons name='list' color={color} size={size + 5} />
      ),
    }),
    [],
  )
}

function useCreateScreenOptions(): BottomTabNavigationOptions {
  return useMemo(
    () => ({
      tabBarIcon: ({ color, size }) => (
        <Ionicons name='add' color={color} size={size + 5} />
      ),
    }),
    [],
  )
}

function useProfileScreenOptions(): BottomTabNavigationOptions {
  return useMemo(
    () => ({
      tabBarIcon: ({ color, size }) => (
        <Ionicons name='bar-chart' color={color} size={size - 5} />
      ),
    }),
    [],
  )
}

const TabsStack = memo(function TabsStack() {
  return (
    <Tabs screenOptions={useScreenOptions()}>
      <Tabs.Screen name='(home)' options={useHomeScreenOptions()} />
      <Tabs.Screen name='create' options={useCreateScreenOptions()} />
      <Tabs.Screen name='profile' options={useProfileScreenOptions()} />
    </Tabs>
  )
})

export default TabsStack
