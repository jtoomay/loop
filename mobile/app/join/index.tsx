import { Boundary } from '@/components/Boundary'
import { GlobalErrorComponent } from '@/components/Boundary/GlobalError'
import { VStack } from '@/design/layout'
import Login from '@/features/join/components/Login'
import SignUp from '@/features/join/components/SignUp'
import { Dispatch, memo, SetStateAction, useState } from 'react'

export type SignInCardProps = {
  setSignUp: Dispatch<SetStateAction<boolean>>
}

const JoinScreenContent = memo(function JoinScreenContent() {
  const [signUp, setSignUp] = useState(false)
  return (
    <VStack bg="bg" flexGrow={1}>
      {signUp ? <SignUp setSignUp={setSignUp} /> : <Login setSignUp={setSignUp} />}
    </VStack>
  )
})

const JoinScreen = memo(function JoinScreen() {
  return (
    <Boundary errorComponent={GlobalErrorComponent}>
      <JoinScreenContent />
    </Boundary>
  )
})

export default JoinScreen
