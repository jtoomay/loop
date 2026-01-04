import { Screen } from '@/design/layout'
import { P } from '@/design/text'
import {
  HomeScreenQuery,
  HomeScreenQuery$data,
} from '@/gql/HomeScreenQuery.graphql'
import useTimezone from '@/hooks/useTimezone'
import { memo } from 'react'
import { FlatList } from 'react-native'
import { graphql, useLazyLoadQuery } from 'react-relay'

const HomeScreen = memo(function HomeScreen() {
  const timezone = useTimezone()

  const { habits } = useLazyLoadQuery<HomeScreenQuery>(
    graphql`
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
    `,
    { timezone },
  )

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

function HabitHomeCell({ id, title }: HabitHomeCellProps) {
  return <P>{title}</P>
}

type HabitHomeCellProps = HomeScreenQuery$data['habits'][0]

export default HomeScreen
