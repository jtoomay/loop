import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { useMemo } from 'react'

export function useExploreScreenOptions() {
  return useMemo(() => {
    const options: NativeStackNavigationOptions = {
      headerShown: true,
    }
    return options
  }, [])
}
