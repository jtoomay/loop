import useSessionContext from '@/context/Session/useSessionContext'
import { useLogoutMutation } from '@/gql/useLogoutMutation.graphql'
import { authService } from '@/lib/auth'
import { router } from 'expo-router'
import { useCallback, useMemo } from 'react'
import { graphql, useMutation } from 'react-relay'

export function useLogout() {
  const { setHasSession } = useSessionContext()
  const [commitLogout, isInFlight] = useMutation<useLogoutMutation>(graphql`
    mutation useLogoutMutation {
      logout
    }
  `)
  const onLogout = useCallback(() => {
    commitLogout({
      variables: {},
      onCompleted: (response, err) => {
        if (err) return

        const logoutFn = async () => {
          await authService.clearSession()
          setHasSession(false)
          router.replace('/join')
        }

        if (response.logout) {
          logoutFn()
        } else {
          console.error('unsuccessful logout from Backend')
        }
      },
    })
  }, [commitLogout, setHasSession])

  return useMemo(
    () => ({
      onLogout,
      isInFlight,
    }),
    [onLogout, isInFlight]
  )
}
