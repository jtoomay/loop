import { Button } from '@/design/buttons'
import { Input } from '@/design/inputs'
import { VStack } from '@/design/layout'
import { Headline, Label, P, SubHeadline } from '@/design/text'
import { useCallback, useState } from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated'
import { SignInCardProps } from '../JoinScreen'
import { useLogin } from '../hooks/useLogin'

export default function Login({ setSignUp }: SignInCardProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { handleLogin, isInFlight } = useLogin({
    onError: (error) => {
      setError(error.message)
    },
  })

  const onLogin = useCallback(() => {
    handleLogin(email, password)
  }, [email, handleLogin, password])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <VStack alignItems="center" flexGrow={1}>
        <VStack animated entering={FadeIn.duration(400)} exiting={FadeOut.duration(400)}>
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
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password..."
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={onLogin}
              />
            </VStack>
          </VStack>
        </VStack>
        <VStack
          gap={3}
          justifyContent="center"
          alignItems="center"
          paddingX={5}
          marginTop="auto"
          animated
          entering={SlideInDown.duration(400)}
          exiting={SlideOutDown.duration(400)}
        >
          <Button onPress={onLogin} disabled={isInFlight}>
            Login
          </Button>
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
