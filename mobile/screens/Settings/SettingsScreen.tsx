import { Button } from '@/design/buttons'
import { Screen } from '@/design/layout'
import { memo } from 'react'
import { useLogout } from './hooks/useLogout'

const SettingsScreen = memo(function SettingsScreen() {
  const { onLogout, isInFlight } = useLogout()

  return (
    <Screen>
      <Button onPress={onLogout} disabled={isInFlight}>
        Logout
      </Button>
    </Screen>
  )
})

export default SettingsScreen
