import { SPACING_MULTIPLIER } from '@/design/common/constants'
import {
  BackgroundColorProps,
  Colors,
  DimensionsProps,
  MarginProps,
  SpacingProps,
  ThemeColors,
} from '@/design/common/vars.type'
import { colors } from '@/design/context/ThemeContext/theme'
import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import { HStack, VStack } from '@/design/layout'
import { Caption, Label } from '@/design/text'
import { memo, ReactNode, useMemo } from 'react'
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native'

export type ListButtonProps = TouchableOpacityProps &
  SpacingProps &
  MarginProps &
  DimensionsProps &
  BackgroundColorProps & {
    start?: ReactNode
    title: string
    description?: string
    detail?: ReactNode
  }

export const ListButton = memo(function ListButton({
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
  bg,
  start,
  title,
  description,
  detail,
  style: styleProp,
  ...props
}: ListButtonProps) {
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
      paddingHorizontal: paddingX ? paddingX * SPACING_MULTIPLIER : undefined,
      paddingVertical: paddingY ? paddingY * SPACING_MULTIPLIER : undefined,
      paddingTop: paddingTop ? paddingTop * SPACING_MULTIPLIER : undefined,
      paddingBottom: paddingBottom
        ? paddingBottom * SPACING_MULTIPLIER
        : undefined,
      paddingLeft: paddingLeft ? paddingLeft * SPACING_MULTIPLIER : undefined,
      paddingRight: paddingRight
        ? paddingRight * SPACING_MULTIPLIER
        : undefined,
      margin:
        margin === 'auto'
          ? 'auto'
          : margin
          ? margin * SPACING_MULTIPLIER
          : undefined,
      marginHorizontal:
        marginX === 'auto'
          ? 'auto'
          : marginX
          ? marginX * SPACING_MULTIPLIER
          : undefined,
      marginVertical:
        marginY === 'auto'
          ? 'auto'
          : marginY
          ? marginY * SPACING_MULTIPLIER
          : undefined,
      marginTop:
        marginTop === 'auto'
          ? 'auto'
          : marginTop
          ? marginTop * SPACING_MULTIPLIER
          : undefined,
      marginBottom:
        marginBottom === 'auto'
          ? 'auto'
          : marginBottom
          ? marginBottom * SPACING_MULTIPLIER
          : undefined,
      marginLeft:
        marginLeft === 'auto'
          ? 'auto'
          : marginLeft
          ? marginLeft * SPACING_MULTIPLIER
          : undefined,
      marginRight:
        marginRight === 'auto'
          ? 'auto'
          : marginRight
          ? marginRight * SPACING_MULTIPLIER
          : undefined,
      backgroundColor,
      width,
      height,
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
    backgroundColor,
    width,
    height,
    styleProp,
  ])

  return (
    <TouchableOpacity {...props} style={style} accessibilityRole='button'>
      <HStack alignItems='center' gap={3}>
        {start && <HStack>{start}</HStack>}
        <VStack flex={1} gap={1}>
          <Label>{title}</Label>
          {description && <Caption color='fgMuted'>{description}</Caption>}
        </VStack>
        {detail && <HStack>{detail}</HStack>}
      </HStack>
    </TouchableOpacity>
  )
})
