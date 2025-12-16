import { Button } from '@/design/buttons'
import { Screen } from '@/design/layout'
import { router } from 'expo-router'
import { memo } from 'react'

const ProfileScreen = memo(function ProfileScreen() {
  return (
    <Screen padding={4} gap={2}>
      <Button compact onPress={() => router.push('/profile/tray')}>
        Open Tray
      </Button>
      <Button compact onPress={() => router.push('/profile/modal')}>
        Open Modal
      </Button>
    </Screen>
  )
})

export default ProfileScreen
