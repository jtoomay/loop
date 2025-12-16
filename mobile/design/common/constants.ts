export const SPACING_MULTIPLIER = 6 as const

export const BUTTON_PADDING_COMPACT = 3 as const
export const BUTTON_PADDING_DEFAULT = 4 as const

export const INPUT_PADDING_X_DEFAULT = 3 as const
export const INPUT_PADDING_Y_DEFAULT = 2 as const
export const INPUT_BORDER_RADIUS = 10 as const

export const FONT_SIZES = {
  base: 16,
  label: 14,
  caption: 12,
  button: 16,
  headline: 36,
  subheadline: 20,
} as const

export const FONT_WEIGHTS = {
  light: '300',
  regular: '400',
  medium: '500',
  bold: '700',
} as const

export const FONT_STYLES = {
  normal: 'normal',
  italic: 'italic',
} as const

export const FONTS = {
  base: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.regular,
    fontStyle: FONT_STYLES.normal,
  },
  label: {
    fontSize: FONT_SIZES.label,
    fontWeight: FONT_WEIGHTS.medium,
    fontStyle: FONT_STYLES.normal,
  },
  caption: {
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.light,
    fontStyle: FONT_STYLES.normal,
  },
  button: {
    fontSize: FONT_SIZES.button,
    fontWeight: FONT_WEIGHTS.medium,
    fontStyle: FONT_STYLES.normal,
  },
  headline: {
    fontSize: FONT_SIZES.headline,
    fontWeight: FONT_WEIGHTS.medium,
    fontStyle: FONT_STYLES.normal,
  },
  subheadline: {
    fontSize: FONT_SIZES.subheadline,
    fontWeight: FONT_WEIGHTS.regular,
    fontStyle: FONT_STYLES.normal,
  },
} as const
