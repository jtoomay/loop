import { Screen } from '@/design/layout'
import { P } from '@/design/text'
import { memo } from 'react'

const CreateScreen = memo(function CreateScreen() {
  return (
    <Screen>
      <P color='primary'>Create</P>
    </Screen>
  )
})

export default CreateScreen
