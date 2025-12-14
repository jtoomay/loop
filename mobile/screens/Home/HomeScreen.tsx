import { Button } from '@/design/buttons'
import { Screen, VStack } from '@/design/layout'
import { Headline, SubHeadline } from '@/design/text'
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
    <Screen>
      <SubHeadline>{me?.id}</SubHeadline>
      <Headline>{me?.email}</Headline>
      <VStack paddingTop={10}>
        <Button onPress={onExplorePress}>Explore</Button>
      </VStack>
    </Screen>
  )
})

export default HomeScreen
