import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import Ionicons, { IoniconsIconName } from '@react-native-vector-icons/ionicons'
import { memo, useMemo } from 'react'

type IconProps = {
  name: IoniconsIconName
  size?: number
  color?: string
}

export const Icon = memo(function Icon({
  name,
  size = 24,
  color: colorProp,
}: IconProps) {
  const theme = useThemeContext()
  const color = useMemo(() => {
    if (colorProp) return colorProp
    return theme.fg
  }, [colorProp, theme])
  return <Ionicons name={name} size={size} color={color} />
})
