import { ListButton } from '@/design/buttons'
import { Screen, ScrollableView } from '@/design/layout'
import { Icon } from '@/design/media'
import { router } from 'expo-router'
import { memo } from 'react'

const SettingsScreen = memo(function SettingsScreen() {
  return (
    <Screen>
      <ScrollableView gap={4} padding={2} fillSpace>
        <ListButton
          start={<Icon name='person' size={24} />}
          title='Account'
          description='Manage your account settings'
          detail={<Icon name='chevron-forward' />}
          onPress={() => router.push('/(app)/(drawer)/settings/account')}
        />
        <ListButton
          start={<Icon name='accessibility' size={24} />}
          title='Accessibility'
          description='Manage your accessibility settings'
          detail={<Icon name='chevron-forward' />}
          onPress={() => router.push('/(app)/(drawer)/settings/account')}
        />
      </ScrollableView>
    </Screen>
  )
})

export default SettingsScreen
