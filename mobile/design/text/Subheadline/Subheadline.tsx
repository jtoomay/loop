import { memo } from 'react'
import { TextBase, TextBaseProps } from '../TextBase/TextBase'

type SubHeadlineProps = TextBaseProps

export const SubHeadline = memo(function SubHeadline({ children, ...props }: SubHeadlineProps) {
  return (
    <TextBase font="subheadline" {...props}>
      {children}
    </TextBase>
  )
})
