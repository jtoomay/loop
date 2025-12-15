import { Button } from '@/design/buttons'
import { Screen } from '@/design/layout'
import { Headline } from '@/design/text'
import { HomeScreenQuery } from '@/gql/HomeScreenQuery.graphql'
import { router } from 'expo-router'
import { memo, useCallback } from 'react'
import { graphql, useLazyLoadQuery } from 'react-relay'

const HomeScreen = memo(function HomeScreen() {
  const { me } = useLazyLoadQuery<HomeScreenQuery>(
    graphql`
      query HomeScreenQuery {
        me {
          id
          email
        }
      }
    `,
    {}
  )

  const onExplorePress = useCallback(() => {
    router.push('/(app)/explore')
  }, [])

  return (
    <Screen paddingY={3} paddingX={2} gap={3}>
      <Headline textAlign="center">{me?.email}</Headline>
      <Button compact onPress={onExplorePress}>
        Explore
      </Button>
    </Screen>
  )
})

export default HomeScreen
