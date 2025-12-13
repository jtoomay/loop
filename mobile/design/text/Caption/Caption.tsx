import { TextBase, TextBaseProps } from '../TextBase/TextBase'

type CaptionProps = TextBaseProps

export function Caption({ children, ...props }: CaptionProps) {
  return (
    <TextBase font="caption" {...props}>
      {children}
    </TextBase>
  )
}
