import { HabitsQuery$data } from '@/gql/HabitsQuery.graphql'
import { memo } from 'react'
import { Dimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import HabitHomeCell from './HabitHomeCell'

type Habit = HabitsQuery$data['habits'][0]

interface SwipeableCardProps {
  habit: Habit
  onDispose: (id: string, direction: 'left' | 'right') => void
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25 // 25% of screen to trigger dispose

const SwipeableHabitCard = memo(function SwipeableHabitCard({
  habit,
  onDispose,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const rotate = useSharedValue(0)

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = event.translationX
      translateY.value = event.translationY
      rotate.value = event.translationX / 20 // Nice rotation effect
    })
    .onEnd(event => {
      const shouldDispose = Math.abs(event.translationX) > SWIPE_THRESHOLD

      if (shouldDispose) {
        const direction = event.translationX > 0 ? 'right' : 'left'
        const dest =
          event.translationX > 0 ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5

        translateX.value = withTiming(dest, { duration: 300 })
        translateY.value = withTiming(event.translationY * 1.5, {
          duration: 300,
        })
        rotate.value = withTiming(direction === 'right' ? 45 : -45, {
          duration: 300,
        })

        runOnJS(onDispose)(habit.id, direction)
      } else {
        // Snap back
        translateX.value = withSpring(0)
        translateY.value = withSpring(0)
        rotate.value = withSpring(0)
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }))

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyle]}>
        <HabitHomeCell {...habit} />
      </Animated.View>
    </GestureDetector>
  )
})

export default SwipeableHabitCard
