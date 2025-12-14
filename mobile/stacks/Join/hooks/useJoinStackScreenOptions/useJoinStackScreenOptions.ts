import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { useMemo } from 'react'

export function useJoinStackScreenOptions() {
  return useMemo(() => {
    const options: NativeStackNavigationOptions = { headerShown: false }
    return options
  }, [])
}
