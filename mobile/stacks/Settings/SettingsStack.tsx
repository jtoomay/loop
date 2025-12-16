import { Stack } from 'expo-router'
import { memo, useMemo } from 'react'

import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { DrawerToggleButton } from '@react-navigation/drawer'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'

function useScreenOptions(): NativeStackNavigationOptions {
  const theme = useThemeContext()
  return useMemo(
    () => ({
      headerTintColor: theme.fg,
      headerStyle: { backgroundColor: theme.bgAlt },
      contentStyle: { backgroundColor: theme.bg },
      headerBackButtonDisplayMode: 'minimal',
    }),
    [theme],
  )
}

function useSettingsScreenOptions(): NativeStackNavigationOptions {
  return useMemo(
    () => ({
      title: 'Settings',
      headerLeft: ({ tintColor }) => (
        <DrawerToggleButton tintColor={tintColor} />
      ),
    }),
    [],
  )
}

function useAccountScreenOptions(): NativeStackNavigationOptions {
  return useMemo(
    () => ({
      title: 'Account',
    }),
    [],
  )
}

const SettingsStack = memo(function SettingsStack() {
  return (
    <Stack screenOptions={useScreenOptions()}>
      <Stack.Screen name='index' options={useSettingsScreenOptions()} />
      <Stack.Screen name='account' options={useAccountScreenOptions()} />
    </Stack>
  )
})

export default SettingsStack
