import { memo } from 'react'
import { TextBase, TextBaseProps } from '../TextBase/TextBase'

type CaptionProps = TextBaseProps

export const Caption = memo(function Caption({ children, ...props }: CaptionProps) {
  return (
    <TextBase font="caption" {...props}>
      {children}
    </TextBase>
  )
})
