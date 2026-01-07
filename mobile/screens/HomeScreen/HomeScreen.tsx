import { Screen } from '@/design/layout'
import { HabitsQuery as HabitsQueryType } from '@/gql/HabitsQuery.graphql'
import useTimezone from '@/hooks/useTimezone'
import { memo } from 'react'
import { FlatList } from 'react-native'
import { useLazyLoadQuery } from 'react-relay'
import SwipeableHabitCard from './components/SwipeableCard'
import { HabitsQuery } from './HabitsQuery'
import useComplete from './hooks/useComplete'
import useSkip from './hooks/useSkip'

const HomeScreen = memo(function HomeScreen() {
  const timezone = useTimezone()

  const { habits } = useLazyLoadQuery<HabitsQueryType>(HabitsQuery, {
    timezone,
  })

  const onCompleted = useComplete()
  const onSkip = useSkip()

  return (
    <Screen paddingY={3} paddingX={2} gap={3}>
      <FlatList
        data={habits}
        renderItem={({ item, index }) => (
          <SwipeableHabitCard
            habit={item}
            onDispose={(habit, direction) => {
              if (direction === 'right') {
                onCompleted(habit)
              } else {
                onSkip(habit)
              }
            }}
          />
        )}
        keyExtractor={({ id }) => id}
      />
    </Screen>
  )
})

export default HomeScreen
