import { SignInCardProps } from '@/app/join'
import useSessionContext from '@/context/Session/useSessionContext'
import { Box, VStack } from '@/design/layout'
import { ButtonText, Headline, Label, P } from '@/design/text'
import { SignUpMutation } from '@/gql/SignUpMutation.graphql'
import { authService } from '@/lib/auth'
import { router } from 'expo-router'
import { useCallback, useState } from 'react'
import { Keyboard, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { graphql, useMutation } from 'react-relay'

export default function SignUp({ setSignUp }: SignInCardProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { setHasSession } = useSessionContext()

  const [commitSignup] = useMutation<SignUpMutation>(graphql`
    mutation SignUpMutation($email: String!, $password: String!) {
      signup(email: $email, password: $password) {
        accessToken
        refreshToken
      }
    }
  `)

  const onSignup = useCallback(() => {
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
          router.replace('/(app)')
        }

        onCompletedAsync()
      },
      onError(error) {
        setError(error.message)
        return console.error(error)
      },
    })
  }, [commitSignup, confirmPassword, email, password, setHasSession])
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <VStack alignItems="center" flexGrow={1}>
        <VStack gap={4} padding={10} marginTop={10} alignItems="center">
          <Headline>Sign Up</Headline>
          <P>Join thousands of professionals already getting more done with less effort. Create your account in seconds and start today.</P>
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
          <VStack gap={1} width="100%">
            <Label>Confirm Password</Label>
            <TextInput
              style={{
                width: '100%',
                backgroundColor: '#e0f2fe',
                height: 45,
                borderRadius: 10,
                padding: 10,
                color: 'black',
              }}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password..."
              placeholderTextColor="black"
              secureTextEntry
            />
          </VStack>
        </VStack>
        <VStack gap={3} justifyContent="center" alignItems="center" padding={10} style={{ marginTop: 'auto' }}>
          <TouchableOpacity onPress={onSignup} style={{ width: '100%' }}>
            <Box bg="primary" padding={4} alignItems="center" width="100%" borderRadius={10}>
              <ButtonText color="fg" medium>
                Continue
              </ButtonText>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSignUp(false)}>
            <P color="fg" medium>
              Already have an account? Log In
            </P>
          </TouchableOpacity>
        </VStack>
      </VStack>
    </TouchableWithoutFeedback>
  )
}
