import { Screen, VStack } from '@/design/layout'
import { Dispatch, memo, SetStateAction, useState } from 'react'
import Login from './components/Login'
import SignUp from './components/SignUp'

export type SignInCardProps = {
  setSignUp: Dispatch<SetStateAction<boolean>>
}

const JoinScreen = memo(function JoinScreen() {
  const [signUp, setSignUp] = useState(false)
  return (
    <Screen safeArea>
      <VStack flexGrow={1}>{signUp ? <SignUp setSignUp={setSignUp} /> : <Login setSignUp={setSignUp} />}</VStack>
    </Screen>
  )
})

export default JoinScreen
