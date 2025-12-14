import { memo } from 'react'
import { TextBase, TextBaseProps } from '../TextBase/TextBase'

type HeadlineProps = TextBaseProps

export const Headline = memo(function Headline({ children, ...props }: HeadlineProps) {
  return (
    <TextBase font="headline" {...props}>
      {children}
    </TextBase>
  )
})
