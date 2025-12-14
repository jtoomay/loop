import Ionicons from '@react-native-vector-icons/ionicons'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { useMemo } from 'react'

export function useCreateScreenOptions() {
  return useMemo(() => {
    const options: BottomTabNavigationOptions = {
      title: 'Create',
      tabBarIcon: ({ color, size }) => <Ionicons name="create" color={color} size={size} />,
    }
    return options
  }, [])
}
