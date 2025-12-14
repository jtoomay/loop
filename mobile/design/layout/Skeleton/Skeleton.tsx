import { BorderRadiusProps, DimensionsProps } from '@/design/common/vars.type'
import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useMemo, useRef } from 'react'
import { Animated, DimensionValue, StyleSheet, View, ViewStyle } from 'react-native'
import { Box, BoxProps } from '../Box/Box'

export type SkeletonShape = 'rectangle' | 'circle'

export type SkeletonProps = Omit<BoxProps, 'width' | 'height' | 'borderRadius'> &
  DimensionsProps &
  BorderRadiusProps & {
    shape?: SkeletonShape
    width: DimensionValue
    height: DimensionValue
  }

const gradStart = { x: -1, y: 0.5 }
const gradEnd = { x: 2, y: 0.5 }
const gradLocations: [number, number, number] = [0.3, 0.5, 0.7]

export function Skeleton({
  shape = 'rectangle',
  width,
  height,
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  ...boxProps
}: SkeletonProps) {
  const theme = useThemeContext()
  const shimmerPosition = useRef(new Animated.Value(-1))

  // Calculate shimmer colors based on theme
  const shimmerColors = useMemo((): [string, string, string] => {
    const baseColor = theme.bgMuted
    const highlightColor = theme.bgAlt
    return [baseColor, highlightColor, baseColor]
  }, [theme])

  // Calculate border radius based on shape
  const calculatedBorderRadius = useMemo(() => {
    if (borderRadius !== undefined) return borderRadius
    if (borderTopLeftRadius || borderTopRightRadius || borderBottomLeftRadius || borderBottomRightRadius) {
      return undefined
    }
    return shape === 'circle' ? 9999 : undefined
  }, [shape, borderRadius, borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius])

  // Calculate dimensions for circle
  const { finalWidth, finalHeight } = useMemo(() => {
    if (shape === 'circle') {
      const size = typeof width === 'number' ? width : typeof height === 'number' ? height : 40
      return { finalWidth: size, finalHeight: size }
    }
    return { finalWidth: width, finalHeight: height }
  }, [shape, width, height])

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerPosition.current, {
        toValue: 1,
        duration: 1300,
        useNativeDriver: true,
        isInteraction: false,
      }),
      {
        iterations: -1, // Infinite loop
      }
    )

    shimmerAnimation.start()

    return () => shimmerAnimation.stop()
  }, [])

  const outputRange = useMemo(() => {
    const size = typeof finalWidth === 'number' ? finalWidth : 400
    return [-size, size]
  }, [finalWidth])

  const containerStyle: ViewStyle = useMemo(
    () => ({
      width: finalWidth,
      height: finalHeight,
      overflow: 'hidden',
      backgroundColor: shimmerColors[0],
      borderRadius: calculatedBorderRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
    }),
    [
      finalWidth,
      finalHeight,
      shimmerColors,
      calculatedBorderRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
    ]
  )

  return (
    <Box width={finalWidth} height={finalHeight} {...boxProps}>
      <View style={containerStyle}>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [
                {
                  translateX: shimmerPosition.current.interpolate({
                    inputRange: [-1, 1],
                    outputRange,
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient colors={shimmerColors} start={gradStart} end={gradEnd} locations={gradLocations} style={styles.gradient} />
        </Animated.View>
      </View>
    </Box>
  )
}

const styles = StyleSheet.create({
  shimmer: {
    flex: 1,
    width: '100%',
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
})
