import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { useMemo } from 'react'

export function useJoinStackScreenOptions() {
  const theme = useThemeContext()

  return useMemo(() => {
    const options: NativeStackNavigationOptions = { headerShown: false, contentStyle: { backgroundColor: theme.bg } }
    return options
  }, [theme])
}
