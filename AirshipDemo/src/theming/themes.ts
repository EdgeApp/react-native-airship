import { Theme } from './ThemeProvider'

const solarized = {
  base03: '#002b36',
  base02: '#073642',
  base01: '#586e75',
  base00: '#657b83',
  base0: '#839496',
  base1: '#93a1a1',
  base2: '#eee8d5',
  base3: '#fdf6e3',
  yellow: '#b58900',
  orange: '#cb4b16',
  red: '#dc322f',
  magenta: '#d33682',
  violet: '#6c71c4',
  blue: '#268bd2',
  cyan: '#2aa198',
  green: '#859900'
}

export const darkTheme: Theme = {
  rem(size: number): number {
    return Math.round(size * 16)
  },

  background: solarized.base03,
  text: solarized.base0,
  header: solarized.base1,

  button: solarized.base0,
  buttonText: solarized.base03,

  dropdown: solarized.base00,
  dropdownText: solarized.base03,

  textInput: solarized.base02,
  textInputBorder: solarized.base0,
  textInputText: solarized.base0,

  toast: solarized.base3,
  toastText: solarized.base00
}

export const lightTheme: Theme = {
  rem(size: number): number {
    return Math.round(size * 16)
  },

  background: solarized.base3,
  text: solarized.base00,
  header: solarized.base01,

  button: solarized.base2,
  buttonText: solarized.base00,

  dropdown: 'white',
  dropdownText: solarized.base03,

  textInput: solarized.base2,
  textInputBorder: solarized.base00,
  textInputText: solarized.base00,

  toast: solarized.base03,
  toastText: solarized.base1
}
