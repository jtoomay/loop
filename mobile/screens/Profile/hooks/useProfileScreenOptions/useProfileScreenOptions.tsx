import { HeaderButton } from '@/design/buttons/HeaderButton/HeaderButton'
import Ionicons from '@react-native-vector-icons/ionicons'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { router } from 'expo-router'
import { useCallback, useMemo } from 'react'

export function useProfileScreenOptions() {
  const onSettingsPress = useCallback(() => {
    router.push('/(app)/settings')
  }, [])

  return useMemo(() => {
    const options: BottomTabNavigationOptions = {
      title: 'Profile',
      tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
      headerRight: ({ tintColor }) => <HeaderButton icon="menu" onPress={onSettingsPress} side="right" color={tintColor} />,
    }
    return options
  }, [onSettingsPress])
}
