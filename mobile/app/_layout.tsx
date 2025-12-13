import SessionProvider from '@/context/Session/SessionProvider'
import useSessionContext from '@/context/Session/useSessionContext'
import { ThemeProvider } from '@/design/context'
import { environment } from '@/lib/environment'
import { Slot, SplashScreen } from 'expo-router'
import { ActivityIndicator } from 'react-native'
import { RelayEnvironmentProvider } from 'react-relay'

SplashScreen.preventAutoHideAsync()

export default function _layout() {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <SessionProvider>
        <ThemeProvider>
          <Root />
        </ThemeProvider>
      </SessionProvider>
    </RelayEnvironmentProvider>
  )
}

function Root() {
  const { isLoading } = useSessionContext()

  if (isLoading) {
    return <ActivityIndicator />
  }

  return <Slot initialRouteName="(app)" />
}
