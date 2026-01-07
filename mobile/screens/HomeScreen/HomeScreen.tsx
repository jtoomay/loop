import { Box, HStack, Screen, VStack } from '@/design/layout'
import { Label, P, SubHeadline } from '@/design/text'
import {
  HomeScreenQuery,
  HomeScreenQuery$data,
} from '@/gql/HomeScreenQuery.graphql'
import useTimezone from '@/hooks/useTimezone'
import formatTo12HourTime from '@/utils/formatTo12HourTime'
import { memo } from 'react'
import { FlatList } from 'react-native'
import { graphql, useLazyLoadQuery } from 'react-relay'

export const HabitsQuery = graphql`
  query HomeScreenQuery($timezone: String!) {
    habits(timezone: $timezone) {
      id
      title
      description
      time
      priority
      streak
    }
  }
`

const HomeScreen = memo(function HomeScreen() {
  const timezone = useTimezone()

  const { habits } = useLazyLoadQuery<HomeScreenQuery>(HabitsQuery, {
    timezone,
  })

  return (
    <Screen paddingY={3} paddingX={2} gap={3}>
      <FlatList
        data={habits}
        renderItem={({ item }) => <HabitHomeCell {...item} />}
        keyExtractor={({ id }) => id}
      />
    </Screen>
  )
})

function HabitHomeCell({
  id,
  title,
  description,
  priority,
  streak,
  time,
}: HabitHomeCellProps) {
  return (
    <HStack
      bg='bgAlt'
      borderRadius={6}
      padding={4}
      marginBottom={3}
      position='relative'
      alignItems='center'
    >
      {streak > 0 && (
        <P top={1} right={2} position='absolute'>
          {streak}
        </P>
      )}
      <HStack gap={6} alignItems='center' flex={1}>
        <Box
          width={24}
          height={24}
          borderRadius={99}
          bg={priority === 1 ? 'red60' : priority === 2 ? 'yellow60' : 'blue40'}
        />
        <VStack>
          <SubHeadline>{title}</SubHeadline>
          {description && <P color='fgMuted'>{description}</P>}
        </VStack>
      </HStack>
      <Label color='fgMuted'>{formatTo12HourTime(time)}</Label>
    </HStack>
  )
}

type HabitHomeCellProps = HomeScreenQuery$data['habits'][0]

export default HomeScreen
