import { TextBase, TextBaseProps } from '../TextBase/TextBase'

type SubHeadlineProps = TextBaseProps

export function SubHeadline({ children, ...props }: SubHeadlineProps) {
  return (
    <TextBase font="subheadline" {...props}>
      {children}
    </TextBase>
  )
}
