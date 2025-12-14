import { SPACING_MULTIPLIER } from '@/design/common/constants'
import { DimensionsProps, MarginProps } from '@/design/common/vars.type'
import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { memo, useMemo } from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'

export type DividerProps = ViewProps &
  MarginProps &
  DimensionsProps & {
    direction?: 'horizontal' | 'vertical'
    color?: string
  }

export const Divider = memo(function Divider({
  direction = 'horizontal',
  color: colorProp,
  width,
  height,
  margin,
  marginX,
  marginY,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  style: styleProp,
  ...props
}: DividerProps) {
  const theme = useThemeContext()
  const color = colorProp ?? theme.bgMuted

  const style: ViewStyle = useMemo(() => {
    const isHorizontal = direction === 'horizontal'
    return {
      width: width ?? (isHorizontal ? '100%' : 1),
      height: height ?? (isHorizontal ? 1 : '100%'),
      backgroundColor: color,
      margin: margin === 'auto' ? 'auto' : margin ? margin * SPACING_MULTIPLIER : undefined,
      marginHorizontal: marginX === 'auto' ? 'auto' : marginX ? marginX * SPACING_MULTIPLIER : undefined,
      marginVertical: marginY === 'auto' ? 'auto' : marginY ? marginY * SPACING_MULTIPLIER : undefined,
      marginTop: marginTop === 'auto' ? 'auto' : marginTop ? marginTop * SPACING_MULTIPLIER : undefined,
      marginBottom: marginBottom === 'auto' ? 'auto' : marginBottom ? marginBottom * SPACING_MULTIPLIER : undefined,
      marginLeft: marginLeft === 'auto' ? 'auto' : marginLeft ? marginLeft * SPACING_MULTIPLIER : undefined,
      marginRight: marginRight === 'auto' ? 'auto' : marginRight ? marginRight * SPACING_MULTIPLIER : undefined,
      ...(styleProp ? (styleProp as ViewStyle) : {}),
    } as ViewStyle
  }, [direction, width, height, color, margin, marginX, marginY, marginTop, marginBottom, marginLeft, marginRight, styleProp])

  return <View {...props} style={style} />
})
