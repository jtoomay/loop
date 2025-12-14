import { memo } from 'react'
import { TextBase, TextBaseProps } from '../TextBase/TextBase'

type LabelProps = TextBaseProps

export const Label = memo(function Label({ children, ...props }: LabelProps) {
  return (
    <TextBase font="label" {...props}>
      {children}
    </TextBase>
  )
})
