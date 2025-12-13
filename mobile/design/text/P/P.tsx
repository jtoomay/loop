import { TextBase, TextBaseProps } from '../TextBase/TextBase'

type PProps = TextBaseProps

export function P({ children, ...props }: PProps) {
  return (
    <TextBase font="base" {...props}>
      {children}
    </TextBase>
  )
}
