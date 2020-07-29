import * as React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { cacheStyles } from 'react-native-patina'

import { Theme, useTheme } from './ThemeProvider'

interface Props {
  children: string | React.ReactNode
  onPress: () => void
}

export function ThemedButton(props: Props): JSX.Element {
  const theme = useTheme()
  const styles = getStyles(theme)
  const { children, onPress } = props

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {typeof children === 'string' ? (
        <Text style={styles.buttonText}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  button: {
    alignItems: 'center',
    backgroundColor: theme.button,
    borderRadius: theme.rem(1),
    justifyContent: 'center',
    margin: theme.rem(1),
    padding: theme.rem(1),
    flexDirection: 'row'
  },
  buttonText: {
    color: theme.buttonText,
    fontSize: theme.rem(1)
  }
}))
