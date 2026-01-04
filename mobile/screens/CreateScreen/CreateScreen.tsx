import SelectTabs, { TabsValue } from '@/components/UI/SelectTabs'
import { Button } from '@/design/buttons'
import { Input } from '@/design/inputs'
import { HStack, Screen, VStack } from '@/design/layout'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'

const WEEKDAYS = [
  { label: 'Su', value: 0 },
  {
    label: 'M',
    value: 1,
  },
  { label: 'T', value: 2 },
  { label: 'W', value: 3 },
  { label: 'Th', value: 4 },
  { label: 'F', value: 5 },
  { label: 'Sa', value: 6 },
]

const PRIORITIES = [
  { label: 'High', value: 1 },
  { label: 'Mid', value: 2 },
  { label: 'Low', value: 3 },
]

const CreateScreen = memo(function CreateScreen() {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState(new Date())

  const [days, setDays] = useState<TabsValue[]>([])

  const [priority, setPriority] = useState<TabsValue>(PRIORITIES[0])
  const isDisabled = useMemo(() => {
    if (!title || !time || days.length === 0 || !priority) return true
    return false
  }, [days.length, priority, time, title])
  console.log('🚀 ~ CreateScreen ~ isDisabled:', isDisabled)
  const onSubmit = useCallback(() => {}, [])

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Screen padding={4}>
        <VStack gap={4}>
          <Input value={title} onChangeText={setTitle} placeholder='Title...' />
          <HStack alignItems='center' gap={2}>
            <SelectTabs
              data={PRIORITIES}
              value={priority}
              onSelect={item => setPriority(item)}
            />

            <DateTimePicker
              mode='time'
              display='default'
              value={time}
              onChange={onChange}
            />
          </HStack>
          <SelectTabs
            data={WEEKDAYS}
            value={days}
            multiple
            onSelect={(item, isAdded) => {
              if (isAdded) {
                setDays(d => [...d, item])
              } else {
                setDays(days =>
                  days.filter(d => {
                    const value = item.value ?? item.label

                    const thisValue = d.value ?? d.label

                    return value !== thisValue
                  }),
                )
              }
            }}
          />
          <Button onPress={onSubmit} disabled={isDisabled}>
            Create
          </Button>
        </VStack>
      </Screen>
    </TouchableWithoutFeedback>
  )
})

export default CreateScreen
