import { TextBase, TextBaseProps } from '../TextBase/TextBase'

type HeadlineProps = TextBaseProps

export function Headline({ children, ...props }: HeadlineProps) {
  return (
    <TextBase font="headline" {...props}>
      {children}
    </TextBase>
  )
}
