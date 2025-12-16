import { Button } from '@/design/buttons'
import { Screen } from '@/design/layout'
import { memo } from 'react'
import { useLogout } from '../Settings/hooks/useLogout'

const AccountSettingsScreen = memo(function AccountSettingsScreen() {
  const { onLogout, isInFlight } = useLogout()

  return (
    <Screen paddingTop={4} paddingX={2}>
      <Button variant='secondary' onPress={onLogout} disabled={isInFlight}>
        Logout
      </Button>
    </Screen>
  )
})

export default AccountSettingsScreen
