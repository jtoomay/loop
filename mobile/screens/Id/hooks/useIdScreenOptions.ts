import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { useMemo } from 'react'

export function useIdScreenOptions() {
  const theme = useThemeContext()
  return useMemo(() => {
    const options: NativeStackNavigationOptions = {
      headerShown: true,
      title: 'Post',
      headerBackButtonDisplayMode: 'minimal',
      contentStyle: { backgroundColor: theme.bg },
    }
    return options
  }, [theme])
}
