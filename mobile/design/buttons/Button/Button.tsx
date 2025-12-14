import { BUTTON_PADDING_COMPACT, BUTTON_PADDING_DEFAULT, SPACING_MULTIPLIER } from '@/design/common/constants'
import { ButtonVariantProps, DimensionsProps, MarginProps, SpacingProps, ThemeColors } from '@/design/common/vars.type'
import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { ButtonText } from '@/design/text'
import { memo, ReactNode, useMemo } from 'react'
import { TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'

export type ButtonProps = TouchableOpacityProps &
  SpacingProps &
  MarginProps &
  DimensionsProps &
  ButtonVariantProps & {
    children: string | ReactNode
  }

export const Button = memo(function Button({
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
  variant = 'primary',
  compact = false,
  inline,
  width,
  height,
  children,
  style: styleProp,
  ...props
}: ButtonProps) {
  const theme = useThemeContext()

  const { backgroundColor, textColor }: { backgroundColor: string; textColor: ThemeColors } = useMemo(() => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.primary,
          textColor: 'fg',
        }
      case 'secondary':
        return {
          backgroundColor: theme.secondary,
          textColor: 'fg',
        }
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          textColor: 'primary',
        }
      default:
        return {
          backgroundColor: theme.primary,
          textColor: 'fg',
        }
    }
  }, [variant, theme])

  const basePadding = variant === 'ghost' ? 0 : compact ? BUTTON_PADDING_COMPACT : BUTTON_PADDING_DEFAULT

  const style: ViewStyle = useMemo(() => {
    // If padding is explicitly set, use it; otherwise use basePadding (affected by compact)
    const effectivePadding = padding ?? basePadding
    // If paddingX/Y are explicitly set, use them; otherwise if padding is set, don't set them; otherwise use basePadding
    const effectivePaddingX = paddingX ?? (padding ? undefined : basePadding)
    const effectivePaddingY = paddingY ?? (padding ? undefined : basePadding)

    return {
      padding: padding ? padding * SPACING_MULTIPLIER : effectivePadding * SPACING_MULTIPLIER,
      paddingHorizontal: paddingX ? paddingX * SPACING_MULTIPLIER : effectivePaddingX ? effectivePaddingX * SPACING_MULTIPLIER : undefined,
      paddingVertical: paddingY ? paddingY * SPACING_MULTIPLIER : effectivePaddingY ? effectivePaddingY * SPACING_MULTIPLIER : undefined,
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
      backgroundColor,
      borderRadius: 9999, // Pill shape
      alignItems: 'center',
      justifyContent: 'center',
      width: width ?? (inline ? undefined : '100%'),
      height,
      ...(styleProp ? (styleProp as ViewStyle) : {}),
    } as ViewStyle
  }, [
    padding,
    basePadding,
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
    inline,
    width,
    height,
    backgroundColor,
    styleProp,
  ])

  const content = useMemo(() => {
    if (typeof children === 'string') {
      return <ButtonText color={textColor}>{children}</ButtonText>
    }
    return children
  }, [children, textColor])

  return (
    <TouchableOpacity {...props} style={style}>
      {content}
    </TouchableOpacity>
  )
})
