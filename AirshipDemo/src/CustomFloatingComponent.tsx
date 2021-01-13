import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { AirshipBridge } from 'react-native-airship'

interface Props {
  bridge: AirshipBridge<void>
}

/**
 * An example of how easy it is to build floating UI elements using Airship.
 */
export function CustomFloatingComponent(props: Props): JSX.Element {
  const { bridge } = props
  React.useEffect(() => bridge.on('clear', bridge.resolve), [bridge])
  React.useEffect(() => bridge.on('result', bridge.remove), [bridge])

  return (
    <TouchableOpacity onPress={() => bridge.resolve()}>
      <Text style={styles.text}>Tap to dismiss</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  text: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 10,
    color: 'black',
    fontSize: 12,
    margin: 10,
    padding: 10,
    textAlign: 'center'
  }
})
