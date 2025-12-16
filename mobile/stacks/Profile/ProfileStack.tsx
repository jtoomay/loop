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

function useProfileScreenOptions(): NativeStackNavigationOptions {
  return useMemo(
    () => ({
      title: 'Profile',
      headerLeft: ({ tintColor }) => (
        <DrawerToggleButton tintColor={tintColor} />
      ),
    }),
    [],
  )
}

function useProfileTrayScreenOptions(): NativeStackNavigationOptions {
  return useMemo(
    () => ({
      headerShown: false,
      presentation: 'formSheet',
      sheetAllowedDetents: [0.6],
      sheetCornerRadius: 20,
      sheetGrabberVisible: true,
    }),
    [],
  )
}

function useProfileModalScreenOptions(): NativeStackNavigationOptions {
  return useMemo(
    () => ({
      headerShown: false,
      presentation: 'fullScreenModal',
    }),
    [],
  )
}

const ProfileStack = memo(function ProfileStack() {
  return (
    <Stack screenOptions={useScreenOptions()}>
      <Stack.Screen name='index' options={useProfileScreenOptions()} />
      <Stack.Screen name='tray' options={useProfileTrayScreenOptions()} />
      <Stack.Screen name='modal' options={useProfileModalScreenOptions()} />
    </Stack>
  )
})

export default ProfileStack
