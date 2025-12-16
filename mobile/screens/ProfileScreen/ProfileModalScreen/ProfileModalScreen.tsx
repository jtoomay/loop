import { IconButton } from '@/design/buttons'
import { HStack, Screen } from '@/design/layout'
import { P } from '@/design/text'
import { router } from 'expo-router'
import { memo } from 'react'

const ProfileModalScreen = memo(function ProfileModalScreen() {
  return (
    <Screen padding={4} safeArea>
      <HStack paddingBottom={4}>
        <IconButton name='close' onPress={() => router.back()} />
      </HStack>
      <P color='primary'>Profile</P>
    </Screen>
  )
})

export default ProfileModalScreen
