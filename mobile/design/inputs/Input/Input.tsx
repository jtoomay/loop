import { INPUT_BORDER_RADIUS, INPUT_PADDING_DEFAULT, SPACING_MULTIPLIER } from '@/design/common/constants'
import { BorderRadiusProps, Colors, DimensionsProps, MarginProps, SpacingProps, ThemeColors } from '@/design/common/vars.type'
import { colors } from '@/design/context/ThemeContext/theme'
import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { useMemo } from 'react'
import { TextInput, TextInputProps, TextStyle } from 'react-native'

export type InputComponentProps = TextInputProps &
  SpacingProps &
  MarginProps &
  DimensionsProps &
  BorderRadiusProps & {
    bg?: ThemeColors | Colors
    textColor?: ThemeColors | Colors
  }

export function Input({
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
  style: styleProp,
  placeholderTextColor: placeholderTextColorProp,
  ...props
}: InputComponentProps) {
  const theme = useThemeContext()
  const backgroundColor = useMemo(() => {
    if (!bg) return theme.inputBg
    if (bg in theme) {
      return theme[bg as ThemeColors]
    }
    if (bg in colors) {
      return colors[bg as Colors]
    }
    return theme.inputBg
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

  const style: TextStyle = useMemo(() => {
    // Apply defaults if not explicitly provided
    const effectivePaddingX = paddingX ?? (padding ? undefined : INPUT_PADDING_DEFAULT)
    const effectivePaddingY = paddingY ?? (padding ? undefined : INPUT_PADDING_DEFAULT)
    const effectivePadding = padding ?? (paddingX || paddingY ? undefined : INPUT_PADDING_DEFAULT)
    const effectiveBorderRadius =
      borderRadius ??
      (borderTopLeftRadius || borderTopRightRadius || borderBottomLeftRadius || borderBottomRightRadius ? undefined : INPUT_BORDER_RADIUS)
    const effectiveHeight = height ?? 48 // Nice default height

    return {
      padding: effectivePadding ? effectivePadding * SPACING_MULTIPLIER : undefined,
      paddingHorizontal: effectivePaddingX ? effectivePaddingX * SPACING_MULTIPLIER : undefined,
      paddingVertical: effectivePaddingY ? effectivePaddingY * SPACING_MULTIPLIER : undefined,
      paddingTop: paddingTop ? paddingTop * SPACING_MULTIPLIER : undefined,
      paddingBottom: paddingBottom ? paddingBottom * SPACING_MULTIPLIER : undefined,
      paddingLeft: paddingLeft ? paddingLeft * SPACING_MULTIPLIER : undefined,
      paddingRight: paddingRight ? paddingRight * SPACING_MULTIPLIER : undefined,
      margin: margin === 'auto' ? 'auto' : margin ? margin * SPACING_MULTIPLIER : undefined,
      marginHorizontal: marginX === 'auto' ? 'auto' : marginX ? marginX * SPACING_MULTIPLIER : undefined,
      marginVertical: marginY === 'auto' ? 'auto' : marginY ? marginY * SPACING_MULTIPLIER : undefined,
      marginTop: marginTop === 'auto' ? 'auto' : marginTop ? marginTop * SPACING_MULTIPLIER : undefined,
      marginBottom: marginBottom === 'auto' ? 'auto' : marginBottom ? marginBottom * SPACING_MULTIPLIER : undefined,
      marginLeft: marginLeft === 'auto' ? 'auto' : marginLeft ? marginLeft * SPACING_MULTIPLIER : undefined,
      marginRight: marginRight === 'auto' ? 'auto' : marginRight ? marginRight * SPACING_MULTIPLIER : undefined,
      width: width ?? '100%',
      height: effectiveHeight,
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
    } as TextStyle
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
  ])

  return <TextInput {...props} style={style} placeholderTextColor={placeholderTextColor} />
}
