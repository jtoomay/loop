import { VStack } from '@/design/layout'
import Login from '@/features/join/components/Login'
import SignUp from '@/features/join/components/SignUp'
import { Dispatch, SetStateAction, useState } from 'react'

export default function Index() {
  const [signUp, setSignUp] = useState(false)
  return (
    <VStack bg="bg" flexGrow={1}>
      {signUp ? <SignUp setSignUp={setSignUp} /> : <Login setSignUp={setSignUp} />}
    </VStack>
  )
}

export type SignInCardProps = {
  setSignUp: Dispatch<SetStateAction<boolean>>
}
