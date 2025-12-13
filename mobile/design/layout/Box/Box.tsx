import { SPACING_MULTIPLIER } from '@/design/common/constants'
import { BackgroundColorProps, FlexProps, MarginProps, SpacingProps } from '@/design/common/vars.type'
import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { useMemo } from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'

export type BoxProps = ViewProps & SpacingProps & MarginProps & FlexProps & BackgroundColorProps

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
  flexWrap,
  flexGrow,
  flexShrink,
  flexBasis,
  gap,
  bg,
  style: styleProp,
  children,
  ...props
}: BoxProps) {
  const theme = useThemeContext()
  const backgroundColor = bg ? theme[bg] : undefined
  const style = useMemo(() => {
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
      gap: gap ? gap * SPACING_MULTIPLIER : undefined,
      backgroundColor,
      ...(styleProp ? (styleProp as ViewStyle) : {}),
    }
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
    gap,
    backgroundColor,
    styleProp,
  ])

  return (
    <View {...props} style={style}>
      {children}
    </View>
  )
}
