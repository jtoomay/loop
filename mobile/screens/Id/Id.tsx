import { Screen } from '@/design/layout'
import { Headline } from '@/design/text'
import { useLocalSearchParams } from 'expo-router'
import { memo } from 'react'

const IdScreen = memo(function IdScreen() {
  const { id } = useLocalSearchParams()

  return (
    <Screen paddingY={3} paddingX={2}>
      <Headline textAlign="center">{id}</Headline>
    </Screen>
  )
})

export default IdScreen
