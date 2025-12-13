import { SignInCardProps } from '@/app/join'
import useSessionContext from '@/context/Session/useSessionContext'
import { Box, VStack } from '@/design/layout'
import { ButtonText, Headline, Label, P } from '@/design/text'
import { LoginMutation } from '@/gql/LoginMutation.graphql'
import { authService } from '@/lib/auth'
import { router } from 'expo-router'
import { useCallback, useState } from 'react'
import { Keyboard, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { graphql, useMutation } from 'react-relay'

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
        <VStack gap={4} padding={10} marginTop={10} alignItems="center">
          <Headline>Sign In</Headline>
          <P>Welcome back! Sign in to continue your journey and pick up where you left off.</P>
          {error && <P color="error">{error}</P>}
        </VStack>
        <VStack gap={4} padding={10} width="100%">
          <VStack gap={1} width="100%">
            <Label>Email</Label>
            <TextInput
              style={{
                width: '100%',
                backgroundColor: '#e0f2fe',
                height: 45,
                borderRadius: 10,
                padding: 10,
                color: 'black',
              }}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email..."
              placeholderTextColor="black"
            />
          </VStack>
          <VStack gap={1} width="100%">
            <Label>Password</Label>
            <TextInput
              style={{
                width: '100%',
                backgroundColor: '#e0f2fe',
                height: 45,
                borderRadius: 10,
                padding: 10,
                color: 'black',
              }}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password..."
              placeholderTextColor="black"
              secureTextEntry
            />
          </VStack>
        </VStack>
        <VStack gap={3} justifyContent="center" alignItems="center" padding={10} style={{ marginTop: 'auto' }}>
          <TouchableOpacity onPress={onLogin} style={{ width: '100%' }}>
            <Box bg="primary" padding={4} alignItems="center" width="100%" borderRadius={10}>
              <ButtonText color="fg" medium>
                Continue
              </ButtonText>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSignUp(true)}>
            <P color="fg" medium>
              Don&apos;t have an account? Sign up
            </P>
          </TouchableOpacity>
        </VStack>
      </VStack>
    </TouchableWithoutFeedback>
  )
}
