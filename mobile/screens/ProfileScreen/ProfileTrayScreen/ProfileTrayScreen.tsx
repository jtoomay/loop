import { Screen } from '@/design/layout'
import { P } from '@/design/text'
import { memo } from 'react'

const ProfileTrayScreen = memo(function ProfileTrayScreen() {
  return (
    <Screen padding={4}>
      <P color='primary'>Profile</P>
    </Screen>
  )
})

export default ProfileTrayScreen
