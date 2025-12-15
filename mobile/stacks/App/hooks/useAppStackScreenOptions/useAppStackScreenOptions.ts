import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { useMemo } from 'react'

export function useAppScreenOptions() {
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
