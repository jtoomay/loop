import { Button } from '@/design/buttons'
import { Screen } from '@/design/layout'
import { router } from 'expo-router'
import { memo } from 'react'

const SettingsScreen = memo(function SettingsScreen() {
  return (
    <Screen paddingTop={4} paddingX={2}>
      <Button
        variant='secondary'
        onPress={() => router.push('/(app)/(drawer)/(settings)/account')}
      >
        Account
      </Button>
    </Screen>
  )
})

export default SettingsScreen
