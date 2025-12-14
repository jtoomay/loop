import { memo } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { VStack } from '../VStack/VStack'

type ScreenProps = {
  safeArea?: boolean
  children: React.ReactNode
}

export const Screen = memo(function Screen({ safeArea, children }: ScreenProps) {
  if (safeArea) {
    return (
      <VStack bg="bg" flexGrow={1}>
        <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
      </VStack>
    )
  }

  return (
    <VStack bg="bg" flexGrow={1}>
      {children}
    </VStack>
  )
})

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
  },
})
