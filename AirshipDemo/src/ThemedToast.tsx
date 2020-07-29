import * as React from 'react'
import { AirshipToast, AirshipToastProps } from 'react-native-airship'

import { useTheme } from './theming/ThemeProvider'

export function ThemedToast(props: AirshipToastProps): JSX.Element {
  const theme = useTheme()

  return (
    <AirshipToast
      backgroundColor={theme.toast}
      opacity={0.81}
      textColor={theme.toastText}
      {...props}
    />
  )
}
