import { memo, useMemo } from 'react'
import { ViewStyle } from 'react-native'
import { Box, BoxProps } from '../Box/Box'

export type HStackProps = Omit<BoxProps, 'flexDirection'> & {
  reverse?: boolean
}

export const HStack = memo(function HStack({ style: styleProps, reverse, children, ...props }: HStackProps) {
  const style: ViewStyle = useMemo(() => {
    return {
      flexDirection: reverse ? 'row-reverse' : 'row',
      ...(styleProps ? (styleProps as ViewStyle) : {}),
    }
  }, [reverse, styleProps])

  return (
    <Box {...props} style={style}>
      {children}
    </Box>
  )
})
