import { Button } from '@/design/buttons'
import { Input } from '@/design/inputs'
import { VStack } from '@/design/layout'
import { Headline, Label, P, SubHeadline } from '@/design/text'
import { useCallback, useState } from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import { SignInCardProps } from '../JoinScreen'
import { useSignUp } from '../hooks/useSignUp'

export default function SignUp({ setSignUp }: SignInCardProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { handleSignup, isInFlight } = useSignUp({
    onError: (error) => {
      setError(error.message)
    },
  })

  const onSignup = useCallback(() => {
    handleSignup(email, password, confirmPassword)
  }, [email, password, confirmPassword, handleSignup])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <VStack alignItems="center" flexGrow={1}>
        <VStack gap={4} paddingX={5} marginTop={20} alignItems="center">
          <Headline>Sign Up</Headline>
          <SubHeadline textAlign="center" color="fgMuted" light>
            Join thousands of professionals already getting more done with less effort. Create your account in seconds and start today.
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
          <VStack gap={1}>
            <Label>Confirm Password</Label>
            <Input value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm your password..." secureTextEntry />
          </VStack>
        </VStack>
        <VStack gap={3} justifyContent="center" alignItems="center" paddingX={5} paddingBottom={5} marginTop="auto">
          <Button onPress={onSignup} disabled={isInFlight}>
            Continue
          </Button>
          <Button variant="ghost" inline onPress={() => setSignUp(false)}>
            <P color="fg" medium>
              Already have an account? Log In
            </P>
          </Button>
        </VStack>
      </VStack>
    </TouchableWithoutFeedback>
  )
}
