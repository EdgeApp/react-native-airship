import * as React from 'react'
import { Text } from 'react-native'
import { cacheStyles } from 'react-native-patina'

import { Theme, useTheme } from './ThemeProvider'

interface Props {
  children: React.ReactNode
  header?: boolean
}

export function ThemedText(props: Props): JSX.Element {
  const { children, header = false } = props
  const theme = useTheme()
  const styles = getStyles(theme)

  return <Text style={header ? styles.header : styles.text}>{children}</Text>
}

const getStyles = cacheStyles((theme: Theme) => ({
  header: {
    alignSelf: 'center',
    color: theme.header,
    fontSize: theme.rem(1.2),
    margin: theme.rem(1),
    marginBottom: 0
  },
  text: {
    color: theme.text,
    fontSize: theme.rem(1),
    margin: theme.rem(1)
  }
}))
