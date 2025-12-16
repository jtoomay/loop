import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { DrawerNavigationOptions } from '@react-navigation/drawer'
import { Drawer } from 'expo-router/drawer'
import { memo, useMemo } from 'react'

function useScreenOptions() {
  const theme = useThemeContext()

  return useMemo(
    () => ({
      headerShown: false,
      sceneStyle: { backgroundColor: theme.bg },
      drawerStyle: { backgroundColor: theme.bg },
      drawerActiveTintColor: theme.primary,
      drawerInactiveTintColor: theme.fg,
      drawerActiveBackgroundColor: theme.bgAlt,
    }),
    [theme],
  )
}

function useTabsScreenOptions(): DrawerNavigationOptions {
  return useMemo(
    () => ({
      title: 'Home',
    }),
    [],
  )
}

function useSettingsScreenOptions(): DrawerNavigationOptions {
  return useMemo(
    () => ({
      title: 'Settings',
    }),
    [],
  )
}

const DrawerStack = memo(function DrawerStack() {
  return (
    <Drawer screenOptions={useScreenOptions()}>
      <Drawer.Screen name='(tabs)' options={useTabsScreenOptions()} />
      <Drawer.Screen name='(settings)' options={useSettingsScreenOptions()} />
    </Drawer>
  )
})

export default DrawerStack
