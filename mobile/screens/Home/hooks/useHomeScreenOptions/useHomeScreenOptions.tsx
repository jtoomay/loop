import Ionicons from '@react-native-vector-icons/ionicons'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { useMemo } from 'react'

export function useHomeScreenOptions() {
  return useMemo(() => {
    const options: BottomTabNavigationOptions = {
      title: 'Home',
      tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
    }
    return options
  }, [])
}
