import * as React from 'react'
import { Text } from 'react-native'
import { AirshipDropdown, AirshipDropdownProps } from 'react-native-airship'
import { cacheStyles } from 'react-native-patina'

import { Theme, useTheme } from './theming/ThemeProvider'

export function ThemedDropdown(props: AirshipDropdownProps): JSX.Element {
  const { children } = props
  const theme = useTheme()
  const styles = getStyles(theme)

  return (
    <AirshipDropdown
      backgroundColor={theme.dropdown}
      borderRadius={theme.rem(1)}
      margin={theme.rem(0.5)}
      {...props}
    >
      <Text style={styles.dropdownText}>{children}</Text>
    </AirshipDropdown>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  dropdownText: {
    alignSelf: 'center',
    color: theme.dropdownText,
    flexShrink: 1,
    fontSize: theme.rem(1),
    margin: theme.rem(1)
  }
}))
