import { ReactNode, useMemo } from 'react'
import { useColorScheme } from 'react-native'
import { ThemeContext } from './ThemeContext'
import { darkTheme, lightTheme } from './theme'

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useTheme()
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

function useTheme() {
  const colorScheme = useColorScheme()
  return useMemo(() => {
    return colorScheme === 'dark' ? darkTheme : lightTheme
  }, [colorScheme])
}

export type ThemeContextType = ReturnType<typeof useTheme>
