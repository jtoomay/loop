import SelectTabs, { TabsValue } from '@/components/UI/SelectTabs'
import { Button } from '@/design/buttons'
import { Input, TextArea } from '@/design/inputs'
import { HStack, Screen, VStack } from '@/design/layout'
import { CreateScreenMutation } from '@/gql/CreateScreenMutation.graphql'
import useTimezone from '@/hooks/useTimezone'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { router } from 'expo-router'
import { memo, useCallback, useMemo, useState } from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import { useMutation, useRelayEnvironment } from 'react-relay'
import { fetchQuery, graphql } from 'relay-runtime'
import { HabitsQuery } from '../HomeScreen/HomeScreen'

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

  const [description, setDescription] = useState('')

  const isDisabled = useMemo(() => {
    if (!title || !time || days.length === 0 || !priority) return true
    return false
  }, [days.length, priority, time, title])

  const [create, isSubmitting] = useMutation<CreateScreenMutation>(graphql`
    mutation CreateScreenMutation($input: CreateHabitInput!) {
      createHabit(input: $input) {
        id
        title
        description
        time
        priority
        streak
      }
    }
  `)

  const environment = useRelayEnvironment()

  const timezone = useTimezone()

  const onSubmit = useCallback(() => {
    if (isDisabled || isSubmitting) return

    create({
      variables: {
        input: {
          days: days.map(day => day.value as number),
          priority: priority.value as number,
          time: time.toLocaleTimeString(undefined, {
            hour12: false,
          }),
          title,
          description,
        },
      },
      onCompleted: () => {
        fetchQuery(environment, HabitsQuery, { timezone }).toPromise()
        router.navigate('/(app)/(drawer)/(tabs)/(home)')
      },
    })
  }, [
    create,
    days,
    description,
    environment,
    isDisabled,
    isSubmitting,
    priority.value,
    time,
    timezone,
    title,
  ])

  const onChange = (_: DateTimePickerEvent, selectedTime?: Date) => {
    const currentTime = selectedTime || time
    setTime(currentTime)
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Screen padding={4}>
        <VStack gap={4} flex={1}>
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
          <TextArea
            flex={1}
            placeholder='Description (optional)'
            value={description}
            onChangeText={setDescription}
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
