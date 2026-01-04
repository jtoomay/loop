import { Input } from '@/design/inputs'
import { Screen, VStack } from '@/design/layout'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { memo, useEffect, useState } from 'react'

const CreateScreen = memo(function CreateScreen() {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState(new Date())

  //TODO: Remove later once we make the function to send to db
  useEffect(() => {
    console.log(
      'Time: ',
      time.toLocaleTimeString(undefined, {
        hour12: false,
      }),
    )
  }, [time])

  const onChange = (_: DateTimePickerEvent, selectedTime?: Date) => {
    const currentTime = selectedTime || time
    setTime(currentTime)
  }
  return (
    <Screen padding={4}>
      <VStack gap={4}>
        <Input value={title} onChangeText={setTitle} placeholder='Title...' />
        <DateTimePicker
          mode='time'
          display='default'
          value={time}
          onChange={onChange}
        />
      </VStack>
    </Screen>
  )
})

export default CreateScreen
