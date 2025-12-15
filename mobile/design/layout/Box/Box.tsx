import { SPACING_MULTIPLIER } from '@/design/common/constants'
import {
  BackgroundColorProps,
  BorderRadiusProps,
  Colors,
  DimensionsProps,
  FlexProps,
  MarginProps,
  PositionProps,
  SpacingProps,
  ThemeColors,
} from '@/design/common/vars.type'
import { colors } from '@/design/context/ThemeContext/theme'
import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { ComponentProps, memo, useMemo } from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'

type BaseBoxProps = SpacingProps & MarginProps & FlexProps & BackgroundColorProps & DimensionsProps & PositionProps & BorderRadiusProps

type AnimatedViewProps = ComponentProps<typeof Animated.View>
type AnimatedOnlyProps = Omit<AnimatedViewProps, keyof ViewProps>

export type BoxProps =
  | (BaseBoxProps & ViewProps & { animated?: never } & { [K in keyof AnimatedOnlyProps]?: never })
  | (BaseBoxProps & Omit<ViewProps, keyof AnimatedOnlyProps> & AnimatedViewProps & { animated: true })

export const Box = memo(function Box({
  padding,
  paddingX,
  paddingY,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  margin,
  marginX,
  marginY,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  flexDirection,
  justifyContent,
  alignItems,
  alignContent,
  alignSelf,
  flex,
  flexWrap,
  flexGrow,
  flexShrink,
  flexBasis,
  gap,
  bg,
  width,
  height,
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  position,
  top,
  right,
  bottom,
  left,
  topRaw,
  rightRaw,
  bottomRaw,
  leftRaw,
  zIndex,
  style: styleProp,
  children,
  animated,
  ...props
}: BoxProps) {
  const theme = useThemeContext()
  const backgroundColor = useMemo(() => {
    if (!bg) return undefined
    if (bg in theme) {
      return theme[bg as ThemeColors]
    }
    if (bg in colors) {
      return colors[bg as Colors]
    }
    return undefined
  }, [bg, theme])
  const style: ViewStyle = useMemo(() => {
    const s: ViewStyle = {
      padding: padding ? padding * SPACING_MULTIPLIER : undefined,
      paddingHorizontal: paddingX ? paddingX * SPACING_MULTIPLIER : undefined,
      paddingVertical: paddingY ? paddingY * SPACING_MULTIPLIER : undefined,
      paddingTop: paddingTop ? paddingTop * SPACING_MULTIPLIER : undefined,
      paddingBottom: paddingBottom ? paddingBottom * SPACING_MULTIPLIER : undefined,
      paddingStart: paddingLeft ? paddingLeft * SPACING_MULTIPLIER : undefined,
      paddingEnd: paddingRight ? paddingRight * SPACING_MULTIPLIER : undefined,
      margin: margin === 'auto' ? 'auto' : margin ? margin * SPACING_MULTIPLIER : undefined,
      marginHorizontal: marginX === 'auto' ? 'auto' : marginX ? marginX * SPACING_MULTIPLIER : undefined,
      marginVertical: marginY === 'auto' ? 'auto' : marginY ? marginY * SPACING_MULTIPLIER : undefined,
      marginTop: marginTop === 'auto' ? 'auto' : marginTop ? marginTop * SPACING_MULTIPLIER : undefined,
      marginBottom: marginBottom === 'auto' ? 'auto' : marginBottom ? marginBottom * SPACING_MULTIPLIER : undefined,
      marginStart: marginLeft === 'auto' ? 'auto' : marginLeft ? marginLeft * SPACING_MULTIPLIER : undefined,
      marginEnd: marginRight === 'auto' ? 'auto' : marginRight ? marginRight * SPACING_MULTIPLIER : undefined,
      flexDirection,
      justifyContent,
      alignItems,
      alignContent,
      alignSelf,
      flexWrap,
      flexGrow,
      flexShrink,
      flexBasis,
      flex,
      gap: gap ? gap * SPACING_MULTIPLIER : undefined,
      backgroundColor,
      width,
      height,
      borderRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      position,
      top: top ? top * SPACING_MULTIPLIER : topRaw ?? undefined,
      right: right ? right * SPACING_MULTIPLIER : rightRaw ?? undefined,
      bottom: bottom ? bottom * SPACING_MULTIPLIER : bottomRaw ?? undefined,
      left: left ? left * SPACING_MULTIPLIER : leftRaw ?? undefined,
      zIndex,
      ...(styleProp ? (styleProp as ViewStyle) : {}),
    }
    return s
  }, [
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    flexDirection,
    justifyContent,
    alignItems,
    alignContent,
    alignSelf,
    flexWrap,
    flexGrow,
    flexShrink,
    flexBasis,
    flex,
    gap,
    backgroundColor,
    width,
    height,
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    position,
    top,
    topRaw,
    right,
    rightRaw,
    bottom,
    bottomRaw,
    left,
    leftRaw,
    zIndex,
    styleProp,
  ])

  if (animated) {
    return (
      <Animated.View {...(props as ComponentProps<typeof Animated.View>)} style={style}>
        {children}
      </Animated.View>
    )
  }

  return (
    <View {...(props as ViewProps)} style={style}>
      {children}
    </View>
  )
})
