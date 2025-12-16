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
        <Ionicons name='home' color={color} size={size} />
      ),
    }),
    [],
  )
}

function useCreateScreenOptions(): BottomTabNavigationOptions {
  return useMemo(
    () => ({
      tabBarIcon: ({ color, size }) => (
        <Ionicons name='create' color={color} size={size} />
      ),
    }),
    [],
  )
}

function useProfileScreenOptions(): BottomTabNavigationOptions {
  return useMemo(
    () => ({
      tabBarIcon: ({ color, size }) => (
        <Ionicons name='person' color={color} size={size} />
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
