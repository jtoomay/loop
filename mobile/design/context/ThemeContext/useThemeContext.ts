import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'

export function useThemeContext() {
  const theme = useContext(ThemeContext)

  if (!theme) throw new Error('useThemeContext() context must be called inside a provider')

  return theme
}
