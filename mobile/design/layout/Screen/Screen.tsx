import { memo } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { VStack, VStackProps } from '../VStack/VStack'

type ScreenProps = Omit<VStackProps, 'children'> & {
  safeArea?: boolean
  children: React.ReactNode
}

export const Screen = memo(function Screen({ safeArea, children, ...props }: ScreenProps) {
  if (safeArea) {
    return (
      <VStack flexGrow={1} {...(props as VStackProps)}>
        <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
      </VStack>
    )
  }

  return (
    <VStack flexGrow={1} {...(props as VStackProps)}>
      {children}
    </VStack>
  )
})

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
  },
})
