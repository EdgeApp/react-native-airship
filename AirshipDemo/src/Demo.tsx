import * as React from 'react'
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { makeAirship } from 'react-native-airship'
import {
  AirshipDropdown,
  AirshipModal,
  AirshipToast
} from 'react-native-airship/demos'

import { theme } from './theme'

const Airship = makeAirship()

interface State {
  width: number
}

export class Demo extends React.Component<{}, State> {
  handleCenterModal = (): void => {
    Airship.show(bridge => (
      <AirshipModal
        bridge={bridge}
        center
        onCancel={() => bridge.resolve(false)}
      >
        <View style={{ padding: theme.rem(1) }}>
          <Text style={styles.modalHeader}>A Modal</Text>
          <Text style={styles.modalText}>
            The Airship modal slides in from the bottom of the screen.
          </Text>
          <Button onPress={() => bridge.resolve(true)}>Sounds good</Button>
        </View>
      </AirshipModal>
    )).catch(() => undefined)
  }

  handleBottomModal = (): void => {
    Airship.show(bridge => (
      <AirshipModal bridge={bridge} onCancel={() => bridge.resolve(false)}>
        <View style={{ padding: theme.rem(1) }}>
          <Text style={styles.modalHeader}>A Modal</Text>
          <Text style={styles.modalText}>
            The Airship modal slides in from the bottom of the screen.
          </Text>
          <Button onPress={() => bridge.resolve(true)}>Sure</Button>
        </View>
      </AirshipModal>
    )).catch(() => undefined)
  }

  handleDropdown = (): void => {
    Airship.show(bridge => (
      <AirshipDropdown bridge={bridge} backgroundColor={theme.modal}>
        <Text style={styles.modalText}>Alert: This is a dropdown.</Text>
      </AirshipDropdown>
    )).catch(() => undefined)
  }

  handleToast = (): void => {
    Airship.show(bridge => (
      <AirshipToast bridge={bridge} message="Toast is happening..." />
    )).catch(() => undefined)
  }

  render(): JSX.Element {
    return (
      <Airship>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.container}>
          <Text style={styles.header}>Airship Demo</Text>
          <Button onPress={this.handleCenterModal}>Center Modal</Button>
          <Button onPress={this.handleBottomModal}>Bottom Modal</Button>
          <Button onPress={this.handleDropdown}>Dropdown</Button>
          <Button onPress={this.handleToast}>Toast</Button>
        </SafeAreaView>
      </Airship>
    )
  }
}

function Button(props: {
  onPress: () => void
  children: string | React.ReactNode
}): JSX.Element {
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

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.bakground,
    padding: theme.rem(1)
  },
  text: {
    color: theme.text,
    fontSize: theme.rem(1)
  },
  header: {
    alignSelf: 'center',
    color: theme.header,
    fontSize: theme.rem(1.2),
    margin: theme.rem(1),
    marginBottom: 0
  },

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
  },

  modalHeader: {
    alignSelf: 'center',
    color: theme.modalHeader,
    fontSize: theme.rem(1.2),
    margin: theme.rem(1),
    marginBottom: 0
  },
  modalText: {
    alignSelf: 'center',
    color: theme.modalText,
    fontSize: theme.rem(1),
    margin: theme.rem(1),
    textAlign: 'left'
  }
})
