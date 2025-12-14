import { memo } from 'react'
import { TextBase, TextBaseProps } from '../TextBase/TextBase'

type ButtonTextProps = TextBaseProps

export const ButtonText = memo(function ButtonText({ children, ...props }: ButtonTextProps) {
  return (
    <TextBase font="button" {...props}>
      {children}
    </TextBase>
  )
})
