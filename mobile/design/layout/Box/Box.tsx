import { SPACING_MULTIPLIER } from '@/design/common/constants'
import {
  BackgroundColorProps,
  BorderRadiusProps,
  Colors,
  DimensionsProps,
  FlexProps,
  MarginProps,
  SpacingProps,
  ThemeColors,
} from '@/design/common/vars.type'
import { colors } from '@/design/context/ThemeContext/theme'
import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { useMemo } from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'

export type BoxProps = ViewProps & SpacingProps & MarginProps & FlexProps & BackgroundColorProps & DimensionsProps & BorderRadiusProps

export function Box({
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
  style: styleProp,
  children,
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
    return {
      padding: padding ? padding * SPACING_MULTIPLIER : undefined,
      paddingX: paddingX ? paddingX * SPACING_MULTIPLIER : undefined,
      paddingY: paddingY ? paddingY * SPACING_MULTIPLIER : undefined,
      paddingTop: paddingTop ? paddingTop * SPACING_MULTIPLIER : undefined,
      paddingBottom: paddingBottom ? paddingBottom * SPACING_MULTIPLIER : undefined,
      paddingLeft: paddingLeft ? paddingLeft * SPACING_MULTIPLIER : undefined,
      paddingRight: paddingRight ? paddingRight * SPACING_MULTIPLIER : undefined,
      margin: margin ? margin * SPACING_MULTIPLIER : undefined,
      marginX: marginX ? marginX * SPACING_MULTIPLIER : undefined,
      marginY: marginY ? marginY * SPACING_MULTIPLIER : undefined,
      marginTop: marginTop ? marginTop * SPACING_MULTIPLIER : undefined,
      marginBottom: marginBottom ? marginBottom * SPACING_MULTIPLIER : undefined,
      marginLeft: marginLeft ? marginLeft * SPACING_MULTIPLIER : undefined,
      marginRight: marginRight ? marginRight * SPACING_MULTIPLIER : undefined,
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
      ...(styleProp ? (styleProp as ViewStyle) : {}),
    } as ViewStyle
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
    flex,
    flexWrap,
    flexGrow,
    flexShrink,
    flexBasis,
    gap,
    backgroundColor,
    width,
    height,
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    styleProp,
  ])

  return (
    <View {...props} style={style}>
      {children}
    </View>
  )
}
