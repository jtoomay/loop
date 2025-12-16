import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { DrawerToggleButton } from '@react-navigation/drawer'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { useMemo } from 'react'

export function useHomeScreenOptions() {
  const theme = useThemeContext()

  return useMemo(() => {
    const options: NativeStackNavigationOptions = {
      title: 'Home',
      headerTintColor: theme.fg,
      headerStyle: { backgroundColor: theme.bgAlt },
      headerLeft: ({ tintColor }) => <DrawerToggleButton tintColor={tintColor} />,
    }
    return options
  }, [theme])
}
