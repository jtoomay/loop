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

function useCreateScreenOptions(): NativeStackNavigationOptions {
  return useMemo(
    () => ({
      title: 'Create',
      headerLeft: ({ tintColor }) => (
        <DrawerToggleButton tintColor={tintColor} />
      ),
    }),
    [],
  )
}

const CreateStack = memo(function CreateStack() {
  return (
    <Stack screenOptions={useScreenOptions()}>
      <Stack.Screen name='index' options={useCreateScreenOptions()} />
    </Stack>
  )
})

export default CreateStack

