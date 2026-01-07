import { useCompleteMutation } from '@/gql/useCompleteMutation.graphql'
import useTimezone from '@/hooks/useTimezone'
import { useCallback } from 'react'
import {
  fetchQuery,
  graphql,
  useMutation,
  useRelayEnvironment,
} from 'react-relay'
import { HabitsQuery } from '../HabitsQuery'

export default function useComplete() {
  const [mutate] = useMutation<useCompleteMutation>(graphql`
    mutation useCompleteMutation($id: ID!, $timezone: String!) {
      completeHabit(id: $id, timezone: $timezone)
    }
  `)

  const environment = useRelayEnvironment()

  const timezone = useTimezone()

  const onComplete = useCallback(
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

  return onComplete
}
