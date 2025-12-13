import { TextBase, TextBaseProps } from '../TextBase/TextBase'

type ButtonTextProps = TextBaseProps

export function ButtonText({ children, ...props }: ButtonTextProps) {
  return (
    <TextBase font="button" {...props}>
      {children}
    </TextBase>
  )
}
