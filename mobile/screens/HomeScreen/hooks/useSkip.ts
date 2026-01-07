import { useSkipMutation } from '@/gql/useSkipMutation.graphql'
import useTimezone from '@/hooks/useTimezone'
import { useCallback } from 'react'
import {
  fetchQuery,
  graphql,
  useMutation,
  useRelayEnvironment,
} from 'react-relay'
import { HabitsQuery } from '../HabitsQuery'

export default function useSkip() {
  const [mutate] = useMutation<useSkipMutation>(graphql`
    mutation useSkipMutation($id: ID!, $timezone: String!) {
      skipHabit(id: $id, timezone: $timezone)
    }
  `)

  const environment = useRelayEnvironment()

  const timezone = useTimezone()

  const onSkip = useCallback(
    (id: string) => {
      mutate({
        variables: { id, timezone },
        onCompleted: () => {
          fetchQuery(environment, HabitsQuery, { timezone }).toPromise()
        },
      })
    },
    [environment, mutate, timezone],
  )

  return onSkip
}
