import useSessionContext from '@/context/Session/useSessionContext'
import { Redirect, Stack } from 'expo-router'
import { memo, useMemo } from 'react'

import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'

function useScreenOptions() {
  const theme = useThemeContext()

  return useMemo(() => {
    const options: NativeStackNavigationOptions = {
      headerShown: false,
      headerTintColor: theme.fg,
      headerStyle: { backgroundColor: theme.bgAlt },
      headerBackButtonDisplayMode: 'minimal',
      contentStyle: { backgroundColor: theme.bg },
    }
    return options
  }, [theme])
}

function useExploreScreenOptions() {
  return useMemo(() => {
    const options: NativeStackNavigationOptions = {
      headerShown: true,
    }
    return options
  }, [])
}

const AppStack = memo(function AppStack() {
  const { hasSession } = useSessionContext()

  const screenOptions = useScreenOptions()
  const exploreScreenOptions = useExploreScreenOptions()

  if (!hasSession) return <Redirect href='/join' />
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name='(drawer)' />
      <Stack.Screen name='explore' options={exploreScreenOptions} />
    </Stack>
  )
})

export default AppStack
