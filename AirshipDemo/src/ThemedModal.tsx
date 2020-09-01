import { BlurView } from '@react-native-community/blur'
import * as React from 'react'
import { StyleSheet } from 'react-native'
import { AirshipModal, AirshipModalProps } from 'react-native-airship'

import { useTheme } from './theming/ThemeProvider'

export function ThemedModal<T>(props: AirshipModalProps<T>): JSX.Element {
  const { center = false } = props
  const theme = useTheme()

  return (
    <AirshipModal
      backgroundColor={theme.background}
      borderRadius={theme.rem(1)}
      margin={center ? theme.rem(0.5) : 0}
      padding={theme.rem(1)}
      underlay={<BlurView blurType="dark" style={StyleSheet.absoluteFill} />}
      {...props}
    />
  )
}
