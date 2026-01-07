import { SPACING_MULTIPLIER } from '@/design/common/constants'
import {
  BackgroundColorProps,
  BorderProps,
  BorderRadiusProps,
  Colors,
  DimensionsProps,
  FlexProps,
  GenericProps,
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

type BaseBoxProps = SpacingProps &
  MarginProps &
  FlexProps &
  BackgroundColorProps &
  DimensionsProps &
  PositionProps &
  BorderRadiusProps &
  BorderProps &
  GenericProps

type AnimatedViewProps = ComponentProps<typeof Animated.View>
type AnimatedOnlyProps = Omit<AnimatedViewProps, keyof ViewProps>

export type BoxProps =
  | (BaseBoxProps &
      ViewProps & { animated?: never } & {
        [K in keyof AnimatedOnlyProps]?: never
      })
  | (BaseBoxProps &
      Omit<ViewProps, keyof AnimatedOnlyProps> &
      AnimatedViewProps & { animated: true })

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
  minHeight,
  minWidth,
  maxHeight,
  maxWidth,
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  borderWidth,
  borderColor: themedBorderColor,
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
  overflow,
  overflowX,
  overflowY,
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
  const borderColor = useMemo(() => {
    if (!themedBorderColor) return undefined
    if (themedBorderColor in theme) {
      return theme[themedBorderColor as ThemeColors]
    }
    if (themedBorderColor in colors) {
      return colors[themedBorderColor as Colors]
    }
    return undefined
  }, [themedBorderColor, theme])
  const style: ViewStyle = useMemo(() => {
    const s: ViewStyle = {
      padding:
        typeof padding === 'number' ? padding * SPACING_MULTIPLIER : undefined,
      paddingHorizontal:
        typeof paddingX === 'number'
          ? paddingX * SPACING_MULTIPLIER
          : undefined,
      paddingVertical:
        typeof paddingY === 'number'
          ? paddingY * SPACING_MULTIPLIER
          : undefined,
      paddingTop:
        typeof paddingTop === 'number'
          ? paddingTop * SPACING_MULTIPLIER
          : undefined,
      paddingBottom:
        typeof paddingBottom === 'number'
          ? paddingBottom * SPACING_MULTIPLIER
          : undefined,
      paddingStart:
        typeof paddingLeft === 'number'
          ? paddingLeft * SPACING_MULTIPLIER
          : undefined,
      paddingEnd:
        typeof paddingRight === 'number'
          ? paddingRight * SPACING_MULTIPLIER
          : undefined,
      margin:
        margin === 'auto'
          ? 'auto'
          : typeof margin === 'number'
          ? margin * SPACING_MULTIPLIER
          : undefined,
      marginHorizontal:
        marginX === 'auto'
          ? 'auto'
          : typeof marginX === 'number'
          ? marginX * SPACING_MULTIPLIER
          : undefined,
      marginVertical:
        marginY === 'auto'
          ? 'auto'
          : typeof marginY === 'number'
          ? marginY * SPACING_MULTIPLIER
          : undefined,
      marginTop:
        marginTop === 'auto'
          ? 'auto'
          : typeof marginTop === 'number'
          ? marginTop * SPACING_MULTIPLIER
          : undefined,
      marginBottom:
        marginBottom === 'auto'
          ? 'auto'
          : typeof marginBottom === 'number'
          ? marginBottom * SPACING_MULTIPLIER
          : undefined,
      marginStart:
        marginLeft === 'auto'
          ? 'auto'
          : typeof marginLeft === 'number'
          ? marginLeft * SPACING_MULTIPLIER
          : undefined,
      marginEnd:
        marginRight === 'auto'
          ? 'auto'
          : typeof marginRight === 'number'
          ? marginRight * SPACING_MULTIPLIER
          : undefined,
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
      minHeight,
      minWidth,
      maxHeight,
      maxWidth,
      borderRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      borderWidth,
      borderColor,
      position,
      top:
        typeof top === 'number'
          ? top * SPACING_MULTIPLIER
          : topRaw ?? undefined,
      right:
        typeof right === 'number'
          ? right * SPACING_MULTIPLIER
          : rightRaw ?? undefined,
      bottom:
        typeof bottom === 'number'
          ? bottom * SPACING_MULTIPLIER
          : bottomRaw ?? undefined,
      left:
        typeof left === 'number'
          ? left * SPACING_MULTIPLIER
          : leftRaw ?? undefined,
      zIndex,
      overflow,
      overflowX,
      overflowY,
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
    minHeight,
    minWidth,
    maxHeight,
    maxWidth,
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderWidth,
    borderColor,
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
    overflow,
    overflowX,
    overflowY,
    styleProp,
  ])

  if (animated) {
    return (
      <Animated.View
        {...(props as ComponentProps<typeof Animated.View>)}
        style={style}
      >
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
