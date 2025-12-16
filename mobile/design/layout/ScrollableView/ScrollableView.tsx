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
import { ScrollView, ScrollViewProps, ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'

type BaseScrollableViewProps = SpacingProps &
  MarginProps &
  FlexProps &
  BackgroundColorProps &
  DimensionsProps &
  PositionProps &
  BorderRadiusProps & {
    fillSpace?: boolean
  }

type AnimatedScrollViewProps = ComponentProps<typeof Animated.ScrollView>
type AnimatedOnlyProps = Omit<AnimatedScrollViewProps, keyof ScrollViewProps>

export type ScrollableViewProps =
  | (BaseScrollableViewProps &
      ScrollViewProps & { animated?: never } & {
        [K in keyof AnimatedOnlyProps]?: never
      })
  | (BaseScrollableViewProps &
      Omit<ScrollViewProps, keyof AnimatedOnlyProps> &
      AnimatedScrollViewProps & { animated: true })

export const ScrollableView = memo(function ScrollableView({
  fillSpace,
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
  contentContainerStyle: contentContainerStyleProp,
  children,
  animated,
  ...props
}: ScrollableViewProps) {
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
      backgroundColor,
      width: width ?? '100%',
      height: height ?? '100%',
      borderRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
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

  const contentContainerStyle: ViewStyle = useMemo(() => {
    return {
      flex: fillSpace ? 1 : flex,
      flexDirection,
      justifyContent,
      alignItems,
      alignContent,
      alignSelf,
      flexWrap,
      flexGrow,
      flexShrink,
      flexBasis,
      gap: gap ? gap * SPACING_MULTIPLIER : undefined,
      ...(contentContainerStyleProp
        ? (contentContainerStyleProp as ViewStyle)
        : {}),
    }
  }, [
    contentContainerStyleProp,
    fillSpace,
    gap,
    flex,
    flexDirection,
    justifyContent,
    alignItems,
    alignContent,
    alignSelf,
    flexWrap,
    flexGrow,
    flexShrink,
    flexBasis,
  ])

  if (animated) {
    return (
      <Animated.ScrollView
        {...(props as ComponentProps<typeof Animated.ScrollView>)}
        style={style}
        contentContainerStyle={contentContainerStyle}
      >
        {children}
      </Animated.ScrollView>
    )
  }

  return (
    <ScrollView
      {...(props as ScrollViewProps)}
      style={style}
      contentContainerStyle={contentContainerStyle}
    >
      {children}
    </ScrollView>
  )
})
