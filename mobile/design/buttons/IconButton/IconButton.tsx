import { SPACING_MULTIPLIER } from '@/design/common/constants'
import {
  BackgroundColorProps,
  BorderRadiusProps,
  Colors,
  DimensionsProps,
  MarginProps,
  PositionProps,
  SpacingProps,
  TextColorProps,
  ThemeColors,
} from '@/design/common/vars.type'
import { colors } from '@/design/context/ThemeContext/theme'
import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { Icon } from '@/design/media'
import { IoniconsIconName } from '@react-native-vector-icons/ionicons'
import { memo, useMemo } from 'react'
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native'

export type IconButtonProps = TouchableOpacityProps &
  SpacingProps &
  MarginProps &
  DimensionsProps &
  TextColorProps &
  BorderRadiusProps &
  BackgroundColorProps &
  PositionProps & {
    name: IoniconsIconName
    size?: number
    iconColor?: string
  }

export const IconButton = memo(function IconButton({
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
  width,
  height,
  color,
  bg,
  borderRadius,
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
  name,
  size = 32,
  iconColor,
  style: styleProp,
  ...props
}: IconButtonProps) {
  const theme = useThemeContext()

  const backgroundColor = useMemo(() => {
    if (!bg) return 'transparent'
    if (bg in theme) {
      return theme[bg as ThemeColors]
    }
    if (bg in colors) {
      return colors[bg as Colors]
    }
    return 'transparent'
  }, [bg, theme])

  const iconColorResolved = useMemo(() => {
    if (iconColor) return iconColor
    if (color) {
      if (color in theme) {
        return theme[color as ThemeColors]
      }
      if (color in colors) {
        return colors[color as Colors]
      }
    }
    return theme.fg
  }, [iconColor, color, theme])

  const style: ViewStyle = useMemo(() => {
    return {
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
      paddingLeft:
        typeof paddingLeft === 'number'
          ? paddingLeft * SPACING_MULTIPLIER
          : undefined,
      paddingRight:
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
      marginLeft:
        marginLeft === 'auto'
          ? 'auto'
          : typeof marginLeft === 'number'
          ? marginLeft * SPACING_MULTIPLIER
          : undefined,
      marginRight:
        marginRight === 'auto'
          ? 'auto'
          : typeof marginRight === 'number'
          ? marginRight * SPACING_MULTIPLIER
          : undefined,
      backgroundColor,
      borderRadius: borderRadius ?? 9999, // Pill shape
      alignItems: 'center',
      justifyContent: 'center',
      width: width ?? size,
      height: height ?? size,
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
    backgroundColor,
    borderRadius,
    width,
    height,
    size,
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

  return (
    <TouchableOpacity {...props} style={style} accessibilityRole='button'>
      <Icon name={name} size={size} color={iconColorResolved} />
    </TouchableOpacity>
  )
})
