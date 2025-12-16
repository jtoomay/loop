import { DimensionValue } from 'react-native'

export type ThemeVars = {
  Spacing: Spacing
  Colors: ThemeColors | Colors
  Font: Font
}

type Spacing =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 32

export type SpacingProps = {
  padding?: ThemeVars['Spacing']
  paddingX?: ThemeVars['Spacing']
  paddingY?: ThemeVars['Spacing']
  paddingTop?: ThemeVars['Spacing']
  paddingBottom?: ThemeVars['Spacing']
  paddingLeft?: ThemeVars['Spacing']
  paddingRight?: ThemeVars['Spacing']
}

export type MarginProps = {
  margin?: ThemeVars['Spacing'] | 'auto'
  marginX?: ThemeVars['Spacing'] | 'auto'
  marginY?: ThemeVars['Spacing'] | 'auto'
  marginTop?: ThemeVars['Spacing'] | 'auto'
  marginBottom?: ThemeVars['Spacing'] | 'auto'
  marginLeft?: ThemeVars['Spacing'] | 'auto'
  marginRight?: ThemeVars['Spacing'] | 'auto'
}

export type PositionProps = {
  position?: 'absolute' | 'relative' | 'fixed' | 'sticky'
  top?: ThemeVars['Spacing']
  right?: ThemeVars['Spacing']
  bottom?: ThemeVars['Spacing']
  left?: ThemeVars['Spacing']
  topRaw?: number
  rightRaw?: number
  bottomRaw?: number
  leftRaw?: number
  zIndex?: number
}

export type FlexProps = {
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  alignContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'stretch'
    | 'space-between'
    | 'space-around'
  alignSelf?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  flex?: number
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  flexGrow?: number
  flexShrink?: number
  flexBasis?: number
  gap?: ThemeVars['Spacing']
}

export type ThemeColors =
  | 'bg'
  | 'bgAlt'
  | 'bgMuted'
  | 'fg'
  | 'fgAlt'
  | 'fgMuted'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'border'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

export type Colors =
  | 'gray0'
  | 'gray5'
  | 'gray10'
  | 'gray20'
  | 'gray40'
  | 'gray60'
  | 'gray80'
  | 'gray90'
  | 'gray95'
  | 'gray100'
  | 'blue5'
  | 'blue20'
  | 'blue40'
  | 'blue60'
  | 'blue80'
  | 'blue100'
  | 'green5'
  | 'green20'
  | 'green40'
  | 'green60'
  | 'green80'
  | 'green100'
  | 'yellow5'
  | 'yellow20'
  | 'yellow40'
  | 'yellow60'
  | 'yellow80'
  | 'yellow100'
  | 'orange5'
  | 'orange20'
  | 'orange40'
  | 'orange60'
  | 'orange80'
  | 'orange100'
  | 'red5'
  | 'red20'
  | 'red40'
  | 'red60'
  | 'red80'
  | 'red100'
  | 'purple5'
  | 'purple20'
  | 'purple40'
  | 'purple60'
  | 'purple80'
  | 'purple100'
  | 'pink5'
  | 'pink20'
  | 'pink40'
  | 'pink60'
  | 'pink80'
  | 'pink100'
  | 'brown5'
  | 'brown20'
  | 'brown40'
  | 'brown60'
  | 'brown80'
  | 'brown100'

export type BackgroundColorProps = {
  bg?: ThemeVars['Colors']
}

export type DimensionsProps = {
  width?: DimensionValue
  height?: DimensionValue
}

export type BorderRadiusProps = {
  borderRadius?: number
  borderTopLeftRadius?: number
  borderTopRightRadius?: number
  borderBottomLeftRadius?: number
  borderBottomRightRadius?: number
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonVariantProps = {
  variant?: ButtonVariant
  compact?: boolean
  inline?: boolean
  icon?: boolean
}

export type TextColorProps = {
  color?: ThemeVars['Colors']
}

type Font = 'base' | 'label' | 'caption' | 'button' | 'headline' | 'subheadline'

export type FontProps = {
  font?: ThemeVars['Font']
  fontSize?: number
  lineHeight?: number
  italic?: boolean
  underline?: boolean
  textAlign?: 'left' | 'center' | 'right' | 'justify'
} & (
  | { bold: true; medium?: never; light?: never }
  | { medium: true; bold?: never; light?: never }
  | { light: true; bold?: never; medium?: never }
  | { bold?: never; medium?: never; light?: never }
) &
  (
    | { uppercase: true; lowercase?: never; capitalize?: never }
    | { lowercase: true; uppercase?: never; capitalize?: never }
    | { capitalize: true; uppercase?: never; lowercase?: never }
    | { uppercase?: never; lowercase?: never; capitalize?: never }
  )
