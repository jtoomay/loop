import { Boundary } from '@/components/Boundary'
import { globalErrorComponent } from '@/components/Boundary/GlobalError'
import SessionProvider from '@/context/Session/SessionProvider'
import useSessionContext from '@/context/Session/useSessionContext'
import { ThemeProvider } from '@/design/context'
import { environment } from '@/lib/environment'
import { Slot, SplashScreen } from 'expo-router'
import { memo } from 'react'
import { RelayEnvironmentProvider } from 'react-relay'

SplashScreen.preventAutoHideAsync()

const Root = memo(function Root() {
  const { isLoading } = useSessionContext()

  if (isLoading) {
    return null
  }

  return <Slot initialRouteName="(app)" />
})

const EntryPoint = memo(function EntryPoint() {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <SessionProvider>
        <ThemeProvider>
          <Boundary errorComponent={globalErrorComponent}>
            <Root />
          </Boundary>
        </ThemeProvider>
      </SessionProvider>
    </RelayEnvironmentProvider>
  )
})

export default EntryPoint
