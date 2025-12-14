import { Screen } from '@/design/layout'
import { P } from '@/design/text'
import { memo } from 'react'

const ProfileScreen = memo(function ProfileScreen() {
  return (
    <Screen>
      <P color="primary">Profile</P>
    </Screen>
  )
})

export default ProfileScreen
