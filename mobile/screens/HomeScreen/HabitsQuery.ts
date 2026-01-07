import { graphql } from 'relay-runtime'

export const HabitsQuery = graphql`
  query HabitsQuery($timezone: String!) {
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
