import Ionicons from '@react-native-vector-icons/ionicons'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { useMemo } from 'react'

export function useProfileScreenOptions() {
  return useMemo(() => {
    const options: BottomTabNavigationOptions = {
      title: 'Profile',
      tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
    }
    return options
  }, [])
}
