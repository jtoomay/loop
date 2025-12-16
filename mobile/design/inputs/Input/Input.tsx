import {
  FONT_STYLES,
  FONT_WEIGHTS,
  FONTS,
  INPUT_BORDER_RADIUS,
  INPUT_PADDING_X_DEFAULT,
  INPUT_PADDING_Y_DEFAULT,
  SPACING_MULTIPLIER,
} from '@/design/common/constants'
import {
  BorderRadiusProps,
  Colors,
  DimensionsProps,
  FontProps,
  MarginProps,
  SpacingProps,
  ThemeColors,
} from '@/design/common/vars.type'
import { colors } from '@/design/context/ThemeContext/theme'
import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { memo, useMemo } from 'react'
import { TextInput, TextInputProps, TextStyle } from 'react-native'

export type InputComponentProps = TextInputProps &
  SpacingProps &
  MarginProps &
  DimensionsProps &
  BorderRadiusProps &
  FontProps & {
    bg?: ThemeColors | Colors
    textColor?: ThemeColors | Colors
  }

export const Input = memo(function Input({
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
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  bg,
  textColor,
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
  font: fontProp,
  fontSize,
  style: styleProp,
  placeholderTextColor: placeholderTextColorProp,
  ...props
}: InputComponentProps) {
  const theme = useThemeContext()
  const backgroundColor = useMemo(() => {
    if (!bg) return theme.bgAlt
    if (bg in theme) {
      return theme[bg as ThemeColors]
    }
    if (bg in colors) {
      return colors[bg as Colors]
    }
    return theme.bgAlt
  }, [bg, theme])

  const color = useMemo(() => {
    if (!textColor) return theme.fg
    if (textColor in theme) {
      return theme[textColor as ThemeColors]
    }
    if (textColor in colors) {
      return colors[textColor as Colors]
    }
    return theme.fg
  }, [textColor, theme])

  const placeholderTextColor = useMemo(() => {
    if (placeholderTextColorProp) return placeholderTextColorProp
    return theme.fgMuted
  }, [placeholderTextColorProp, theme])

  const font = useMemo(
    () => (fontProp ? FONTS[fontProp] : FONTS.base),
    [fontProp],
  )

  const style: TextStyle = useMemo(() => {
    // Apply defaults if not explicitly provided
    const effectivePaddingX =
      paddingX ?? (padding ? undefined : INPUT_PADDING_X_DEFAULT)
    const effectivePaddingY =
      paddingY ?? (padding ? undefined : INPUT_PADDING_Y_DEFAULT)
    const effectiveBorderRadius =
      borderRadius ??
      (borderTopLeftRadius ||
      borderTopRightRadius ||
      borderBottomLeftRadius ||
      borderBottomRightRadius
        ? undefined
        : INPUT_BORDER_RADIUS)

    const s: TextStyle = {
      ...font,
      fontSize: fontSize ?? font.fontSize,
      lineHeight,
      textAlign,
      padding:
        typeof padding === 'number' ? padding * SPACING_MULTIPLIER : undefined,
      paddingHorizontal:
        typeof effectivePaddingX === 'number'
          ? effectivePaddingX * SPACING_MULTIPLIER
          : undefined,
      paddingVertical:
        typeof effectivePaddingY === 'number'
          ? effectivePaddingY * SPACING_MULTIPLIER
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
      width,
      height,
      borderRadius: effectiveBorderRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      backgroundColor,
      color,
      borderWidth: 1,
      borderColor: theme.bgMuted,
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
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    backgroundColor,
    color,
    theme,
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

  return (
    <TextInput
      {...props}
      style={style}
      placeholderTextColor={placeholderTextColor}
    />
  )
})
