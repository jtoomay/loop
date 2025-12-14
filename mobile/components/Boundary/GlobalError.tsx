import { VStack } from '@/design/layout'
import { Headline, SubHeadline } from '@/design/text'
import { memo, ReactNode } from 'react'

type GlobalErrorScreenProps = {
  error?: Error
}

export const GlobalError = memo(function GlobalErrorScreen({ error }: GlobalErrorScreenProps) {
  const errorMessage = error?.message || 'An error occurred while loading the app. Please try again later.'

  return (
    <VStack alignItems="center" justifyContent="center" flexGrow={1} paddingX={10} gap={4}>
      <Headline>Error</Headline>
      <SubHeadline>{errorMessage}</SubHeadline>
    </VStack>
  )
})

export const globalErrorComponent = (error: Error): ReactNode => {
  return <GlobalError error={error} />
}
