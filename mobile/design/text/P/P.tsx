import { memo } from 'react'
import { TextBase, TextBaseProps } from '../TextBase/TextBase'

type PProps = TextBaseProps

export const P = memo(function P({ children, ...props }: PProps) {
  return (
    <TextBase font="base" {...props}>
      {children}
    </TextBase>
  )
})
