import { TextBase, TextBaseProps } from '../TextBase/TextBase'

type LabelProps = TextBaseProps

export function Label({ children, ...props }: LabelProps) {
  return (
    <TextBase font="label" {...props}>
      {children}
    </TextBase>
  )
}
