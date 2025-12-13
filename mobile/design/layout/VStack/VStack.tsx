import { useMemo } from 'react'
import { ViewStyle } from 'react-native'
import { Box, BoxProps } from '../Box/Box'

export type VStackProps = Omit<BoxProps, 'flexDirection'> & {
  reverse?: boolean
}

export function VStack({ style: styleProps, reverse, children, ...props }: VStackProps) {
  const style: ViewStyle = useMemo(() => {
    return {
      flexDirection: reverse ? 'column-reverse' : 'column',
      ...(styleProps ? (styleProps as ViewStyle) : {}),
    }
  }, [reverse, styleProps])

  return (
    <Box width="100%" {...props} style={style}>
      {children}
    </Box>
  )
}
