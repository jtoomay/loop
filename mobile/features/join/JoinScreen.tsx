import { VStack } from '@/design/layout'
import Login from '@/features/join/components/Login'
import { Dispatch, memo, SetStateAction, useState } from 'react'
import SignUp from './components/SignUp'

export type SignInCardProps = {
  setSignUp: Dispatch<SetStateAction<boolean>>
}

const JoinScreen = memo(function JoinScreen() {
  const [signUp, setSignUp] = useState(false)
  return (
    <VStack bg="bg" flexGrow={1}>
      {signUp ? <SignUp setSignUp={setSignUp} /> : <Login setSignUp={setSignUp} />}
    </VStack>
  )
})

export default JoinScreen
