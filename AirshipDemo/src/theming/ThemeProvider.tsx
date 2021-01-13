import { Appearance } from 'react-native'
import { makeThemeContext, setCacheSize } from 'react-native-patina'

import { darkTheme, lightTheme } from './themes'

// Make room for two themes:
setCacheSize(2)

export interface Theme {
  rem: (size: number) => number
  background: string
  text: string
  header: string

  button: string
  buttonText: string

  dropdown: string
  dropdownText: string

  textInput: string
  textInputBorder: string
  textInputText: string

  toast: string
  toastText: string
}

export interface ThemeProps {
  theme: Theme
}

export const {
  changeTheme,
  ThemeProvider,
  useTheme,
  withTheme
} = makeThemeContext(
  Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme
)
