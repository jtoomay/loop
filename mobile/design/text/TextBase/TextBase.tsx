import { FONT_STYLES, FONT_WEIGHTS, FONTS, SPACING_MULTIPLIER } from '@/design/common/constants'
import { Colors, FontProps, MarginProps, PositionProps, SpacingProps, TextColorProps, ThemeColors } from '@/design/common/vars.type'
import { colors } from '@/design/context/ThemeContext/theme'
import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { ComponentProps, memo, useMemo } from 'react'
import { Text, TextProps, TextStyle } from 'react-native'
import Animated from 'react-native-reanimated'

type BaseTextBaseProps = FontProps & TextColorProps & PositionProps & MarginProps & SpacingProps

type AnimatedTextProps = ComponentProps<typeof Animated.Text>
type AnimatedOnlyProps = Omit<AnimatedTextProps, keyof TextProps>

export type TextBaseProps =
  | (BaseTextBaseProps & TextProps & { animated?: never } & { [K in keyof AnimatedOnlyProps]?: never })
  | (BaseTextBaseProps & Omit<TextProps, keyof AnimatedOnlyProps> & AnimatedTextProps & { animated: true })

export const TextBase = memo(function TextBase({
  bold,
  italic,
  medium,
  light,
  underline,
  uppercase,
  lowercase,
  capitalize,
  textAlign,
  lineHeight,
  color: colorProp,
  font: fontProp,
  fontSize,
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
  margin,
  marginX,
  marginY,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  padding,
  paddingX,
  paddingY,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  style: styleProp,
  children,
  animated,
  ...props
}: TextBaseProps) {
  const theme = useThemeContext()
  const color = useMemo(() => {
    if (!colorProp) return theme.fg
    if (colorProp in theme) {
      return theme[colorProp as ThemeColors]
    }
    if (colorProp in colors) {
      return colors[colorProp as Colors]
    }
    return theme.fg
  }, [colorProp, theme])

  const font = useMemo(() => (fontProp ? FONTS[fontProp] : FONTS.base), [fontProp])

  const style: TextStyle = useMemo(() => {
    const s: TextStyle = {
      ...font,
      fontSize: fontSize ?? font.fontSize,
      lineHeight,
      textAlign,
      color,
      margin: margin === 'auto' ? 'auto' : typeof margin === 'number' ? margin * SPACING_MULTIPLIER : undefined,
      marginHorizontal: marginX === 'auto' ? 'auto' : typeof marginX === 'number' ? marginX * SPACING_MULTIPLIER : undefined,
      marginVertical: marginY === 'auto' ? 'auto' : typeof marginY === 'number' ? marginY * SPACING_MULTIPLIER : undefined,
      marginTop: marginTop === 'auto' ? 'auto' : typeof marginTop === 'number' ? marginTop * SPACING_MULTIPLIER : undefined,
      marginBottom: marginBottom === 'auto' ? 'auto' : typeof marginBottom === 'number' ? marginBottom * SPACING_MULTIPLIER : undefined,
      marginStart: marginLeft === 'auto' ? 'auto' : typeof marginLeft === 'number' ? marginLeft * SPACING_MULTIPLIER : undefined,
      marginEnd: marginRight === 'auto' ? 'auto' : typeof marginRight === 'number' ? marginRight * SPACING_MULTIPLIER : undefined,
      padding: typeof padding === 'number' ? padding * SPACING_MULTIPLIER : undefined,
      paddingHorizontal: typeof paddingX === 'number' ? paddingX * SPACING_MULTIPLIER : undefined,
      paddingVertical: typeof paddingY === 'number' ? paddingY * SPACING_MULTIPLIER : undefined,
      paddingTop: typeof paddingTop === 'number' ? paddingTop * SPACING_MULTIPLIER : undefined,
      paddingBottom: typeof paddingBottom === 'number' ? paddingBottom * SPACING_MULTIPLIER : undefined,
      paddingStart: typeof paddingLeft === 'number' ? paddingLeft * SPACING_MULTIPLIER : undefined,
      paddingEnd: typeof paddingRight === 'number' ? paddingRight * SPACING_MULTIPLIER : undefined,
      position,
      top: typeof top === 'number' ? top * SPACING_MULTIPLIER : topRaw ?? undefined,
      right: typeof right === 'number' ? right * SPACING_MULTIPLIER : rightRaw ?? undefined,
      bottom: typeof bottom === 'number' ? bottom * SPACING_MULTIPLIER : bottomRaw ?? undefined,
      left: typeof left === 'number' ? left * SPACING_MULTIPLIER : leftRaw ?? undefined,
      zIndex,
      ...(styleProp ? (styleProp as TextStyle) : {}),
    }

    if (bold) {
      s.fontWeight = FONT_WEIGHTS.bold
    }

    if (medium) {
      s.fontWeight = FONT_WEIGHTS.medium
    }

    if (light) {
      s.fontWeight = FONT_WEIGHTS.light
    }

    if (italic) {
      s.fontStyle = FONT_STYLES.italic
    }

    if (underline) {
      s.textDecorationLine = 'underline'
    }

    if (uppercase) {
      s.textTransform = 'uppercase'
    }

    if (lowercase) {
      s.textTransform = 'lowercase'
    }

    if (capitalize) {
      s.textTransform = 'capitalize'
    }

    return s
  }, [
    font,
    fontSize,
    lineHeight,
    textAlign,
    color,
    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
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
    bold,
    medium,
    light,
    italic,
    underline,
    uppercase,
    lowercase,
    capitalize,
  ])

  if (animated) {
    return (
      <Animated.Text {...(props as ComponentProps<typeof Animated.Text>)} style={style}>
        {children}
      </Animated.Text>
    )
  }

  return (
    <Text {...(props as TextProps)} style={style}>
      {children}
    </Text>
  )
})
