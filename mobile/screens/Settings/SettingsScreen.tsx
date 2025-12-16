import { ListButton } from '@/design/buttons'
import { Screen } from '@/design/layout'
import { Icon } from '@/design/media/Icon/Icon'
import { router } from 'expo-router'
import { memo } from 'react'
import { ScrollView } from 'react-native'

const SettingsScreen = memo(function SettingsScreen() {
  return (
    <Screen>
      <ScrollView style={{ padding: 2 }} contentContainerStyle={{ flex: 1 }}>
        <ListButton
          start={<Icon name='person' size={24} />}
          title='Account'
          description='Manage your account settings'
          detail={<Icon name='chevron-forward' />}
          onPress={() => router.push('/(app)/(drawer)/settings/account')}
        />
      </ScrollView>
    </Screen>
  )
})

export default SettingsScreen
