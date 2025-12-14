import useSessionContext from '@/context/Session/useSessionContext'
import { Button } from '@/design/buttons'
import { Input } from '@/design/inputs'
import { VStack } from '@/design/layout'
import { Headline, Label, P, SubHeadline } from '@/design/text'
import { LoginMutation } from '@/gql/LoginMutation.graphql'
import { authService } from '@/lib/auth'
import { router } from 'expo-router'
import { useCallback, useState } from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import { graphql, useMutation } from 'react-relay'
import { SignInCardProps } from '../JoinScreen'

export default function Login({ setSignUp }: SignInCardProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { setHasSession } = useSessionContext()

  const [commitLogin] = useMutation<LoginMutation>(graphql`
    mutation LoginMutation($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        accessToken
        refreshToken
      }
    }
  `)

  const onLogin = useCallback(() => {
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
          router.replace('/(app)')
        }

        onCompletedAsync()
      },
      onError(error) {
        setError(error.message)
        return console.error(error)
      },
    })
  }, [commitLogin, email, password, setHasSession])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <VStack alignItems="center" flexGrow={1}>
        <VStack gap={4} paddingX={5} marginTop={20} alignItems="center">
          <Headline>Sign In</Headline>
          <SubHeadline textAlign="center" color="fgMuted" light>
            Welcome back! Sign in to continue your journey and pick up where you left off.
          </SubHeadline>
          {error && <P color="error">{error}</P>}
        </VStack>
        <VStack gap={4} paddingX={6} paddingY={10}>
          <VStack gap={1}>
            <Label>Email</Label>
            <Input value={email} onChangeText={setEmail} placeholder="Enter your email..." />
          </VStack>
          <VStack gap={1}>
            <Label>Password</Label>
            <Input value={password} onChangeText={setPassword} placeholder="Enter your password..." secureTextEntry />
          </VStack>
        </VStack>
        <VStack gap={3} justifyContent="center" alignItems="center" paddingX={5} paddingBottom={5} marginTop="auto">
          <Button onPress={onLogin}>Continue</Button>
          <Button variant="ghost" inline onPress={() => setSignUp(true)}>
            <P color="fg" medium>
              Don&apos;t have an account? Sign up
            </P>
          </Button>
        </VStack>
      </VStack>
    </TouchableWithoutFeedback>
  )
}
