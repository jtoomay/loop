import { FONT_STYLES, FONT_WEIGHTS, FONTS } from '@/design/common/constants'
import { Colors, FontProps, TextColorProps, ThemeColors } from '@/design/common/vars.type'
import { colors } from '@/design/context/ThemeContext/theme'
import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { ComponentProps, memo, useMemo } from 'react'
import { Text, TextProps, TextStyle } from 'react-native'
import Animated from 'react-native-reanimated'

type BaseTextBaseProps = FontProps & TextColorProps

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
  }, [color, font, fontSize, lineHeight, textAlign, bold, medium, light, italic, underline, uppercase, lowercase, capitalize, styleProp])

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
