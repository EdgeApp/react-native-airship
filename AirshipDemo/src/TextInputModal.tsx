import * as React from 'react'
import { AirshipBridge } from 'react-native-airship'

import { ThemedModal } from './ThemedModal'
import { ThemedButton } from './theming/ThemedButton'
import { ThemedText } from './theming/ThemedText'
import { ThemedTextInput } from './theming/ThemedTextInput'

interface Props {
  bridge: AirshipBridge<string | undefined>
  center?: boolean
}

/**
 * This is an example of how to use the AirshipModal component
 * as a building-block of a larger modal component.
 * This one allows the user to enter some text,
 * which it returns as a promise.
 */
export function TextInputModal(props: Props): JSX.Element {
  const { bridge, center = false } = props
  const [text, setText] = React.useState('text input')

  return (
    <ThemedModal
      bridge={bridge}
      center={center}
      onCancel={() => bridge.resolve(undefined)}
    >
      <ThemedText header>A Modal</ThemedText>
      <ThemedText>
        The Airship modal slides in from the bottom of the screen. It can have
        any contents you like.
      </ThemedText>
      <ThemedTextInput value={text} onChangeText={setText} />
      <ThemedButton onPress={() => bridge.resolve(text)}>
        Sounds good
      </ThemedButton>
    </ThemedModal>
  )
}
