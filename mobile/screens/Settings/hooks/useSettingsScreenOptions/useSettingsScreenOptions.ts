import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { useMemo } from 'react'

export function useSettingsScreenOptions() {
  return useMemo(() => {
    const options: NativeStackNavigationOptions = {
      presentation: 'modal',
    }
    return options
  }, [])
}
