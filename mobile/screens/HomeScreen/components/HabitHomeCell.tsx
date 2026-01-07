import { Box, HStack, VStack } from '@/design/layout'
import { Label, P, SubHeadline } from '@/design/text'
import { HabitsQuery$data } from '@/gql/HabitsQuery.graphql'
import formatTo12HourTime from '@/utils/formatTo12HourTime'

export default function HabitHomeCell({
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
      <HStack gap={3} alignItems='center' flex={1}>
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

type HabitHomeCellProps = HabitsQuery$data['habits'][0]
