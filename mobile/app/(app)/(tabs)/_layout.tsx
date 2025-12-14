import { HeaderButton } from '@/design/buttons/HeaderButton/HeaderButton'
import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { router, Tabs } from 'expo-router'
import { useCallback } from 'react'

export default function Layout() {
  const theme = useThemeContext()

  const onSettingsPress = useCallback(() => {
    router.push('/(app)/settings')
  }, [])

  return (
    <Tabs
      screenOptions={{
        headerTintColor: theme.fg,
        headerStyle: { backgroundColor: theme.bgAlt },
        tabBarStyle: { backgroundColor: theme.bgAlt, borderColor: theme.border, paddingTop: 10 },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.fgMuted,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => <Ionicons name="create" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
          headerRight: ({ tintColor }) => <HeaderButton icon="menu" onPress={onSettingsPress} side="right" color={tintColor} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  )
}
