import useSessionContext from '@/context/Session/useSessionContext'
import { useLoginMutation } from '@/gql/useLoginMutation.graphql'
import { authService } from '@/lib/auth'
import { router } from 'expo-router'
import { useCallback, useMemo } from 'react'
import { graphql, useMutation } from 'react-relay'

type UseLoginProps = {
  onError?: (error: Error) => void
}

export function useLogin({ onError }: UseLoginProps) {
  const { setHasSession } = useSessionContext()

  const [commitLogin, isInFlight] = useMutation<useLoginMutation>(graphql`
    mutation useLoginMutation($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        accessToken
        refreshToken
      }
    }
  `)

  const handleLogin = useCallback(
    (email: string, password: string) => {
      commitLogin({
        variables: {
          email,
          password,
        },
        onCompleted(response, error) {
          if (error) return

          const onCompletedAsync = async () => {
            await authService.setSession(response.login)
            setHasSession(true)
            router.replace('/(app)/(tabs)')
          }

          onCompletedAsync()
        },
        onError(error) {
          onError?.(error)
          return console.error(error)
        },
      })
    },
    [commitLogin, onError, setHasSession]
  )

  return useMemo(
    () => ({
      handleLogin,
      isInFlight,
    }),
    [handleLogin, isInFlight]
  )
}
