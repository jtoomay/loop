import { useThemeContext } from '@/design/context/ThemeContext/useThemeContext'
import Ionicons, { IoniconsIconName } from '@react-native-vector-icons/ionicons'
import { memo, useMemo } from 'react'
import { TouchableOpacity, ViewStyle } from 'react-native'

type HeaderButtonProps = {
  icon: IoniconsIconName
  onPress: () => void
  side: 'left' | 'right'
  size?: number
  color?: string
}

export const HeaderButton = memo(function HeaderButton({ icon, onPress, size = 24, color, side }: HeaderButtonProps) {
  const theme = useThemeContext()

  const style: ViewStyle = useMemo(() => {
    return {
      paddingLeft: side === 'left' ? 8 : undefined,
      paddingRight: side === 'right' ? 8 : undefined,
    }
  }, [side])

  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Ionicons name={icon} size={size} color={color ?? theme.fg} />
    </TouchableOpacity>
  )
})
