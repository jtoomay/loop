import useSessionContext from '@/context/Session/useSessionContext'
import { useSignUpMutation } from '@/gql/useSignUpMutation.graphql'
import { authService } from '@/lib/auth'
import { router } from 'expo-router'
import { useCallback, useMemo } from 'react'
import { graphql, useMutation } from 'react-relay'

type UseSignUpProps = {
  onError?: (error: Error) => void
}

export function useSignUp({ onError }: UseSignUpProps) {
  const { setHasSession } = useSessionContext()

  const [commitSignup, isInFlight] = useMutation<useSignUpMutation>(graphql`
    mutation useSignUpMutation($email: String!, $password: String!) {
      signup(email: $email, password: $password) {
        accessToken
        refreshToken
      }
    }
  `)

  const handleSignup = useCallback(
    (email: string, password: string, confirmPassword: string) => {
      if (password !== confirmPassword) return console.error('Passwords do not match')

      commitSignup({
        variables: {
          email,
          password,
        },
        onCompleted(response, error) {
          if (error) return

          const onCompletedAsync = async () => {
            await authService.setSession(response.signup)
            setHasSession(true)
            router.replace('/(app)/(tabs)')
          }

          onCompletedAsync()
        },
        onError(error) {
          onError?.(error)
        },
      })
    },
    [commitSignup, onError, setHasSession]
  )

  return useMemo(
    () => ({
      handleSignup,
      isInFlight,
    }),
    [handleSignup, isInFlight]
  )
}
