import * as React from 'react'
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { SafeAreaConsumer } from 'react-native-safe-area-context'

import { AirshipBridge } from '../Airship'

const fadeInTime = 300
const fadeOutTime = 1000
const visibleTime = 3000

interface Props {
  bridge: AirshipBridge<void>

  // The message to show in the toast:
  message?: string

  // If set, the toast will stay up for the lifetime of the promise,
  // and will include a spinner.
  activity?: Promise<unknown>
}

/**
 * A semi-transparent message overlay.
 */
export class AirshipToast extends React.Component<Props> {
  opacity: Animated.Value

  constructor(props: Props) {
    super(props)
    this.opacity = new Animated.Value(0)
  }

  componentDidMount(): void {
    const { activity, bridge } = this.props

    // Animate in:
    Animated.timing(this.opacity, {
      toValue: 0.9,
      duration: fadeInTime,
      useNativeDriver: true
    }).start()

    // Animate out:
    const hide = (): void => {
      bridge.resolve()
      Animated.timing(this.opacity, {
        toValue: 0,
        duration: fadeOutTime,
        useNativeDriver: true
      }).start(() => bridge.remove())
    }
    if (activity != null) {
      activity.then(hide, hide)
    } else {
      setTimeout(hide, fadeInTime + visibleTime)
    }
  }

  render(): React.ReactNode {
    return (
      <SafeAreaConsumer>
        {insets => {
          if (insets == null) insets = { bottom: 0, left: 0, right: 0, top: 0 }

          return (
            <View pointerEvents="none" style={[styles.screen, insets]}>
              <Animated.View style={[styles.body, { opacity: this.opacity }]}>
                {this.renderContent()}
              </Animated.View>
            </View>
          )
        }}
      </SafeAreaConsumer>
    )
  }

  renderContent(): React.ReactNode {
    const { activity, message } = this.props
    if (activity == null) return <Text style={styles.text}>{message}</Text>

    return (
      <>
        <Text style={[styles.text, { marginRight: unit }]}>{message}</Text>
        <ActivityIndicator />
      </>
    )
  }
}

const unit = 14

const styles = StyleSheet.create({
  body: {
    // Layout:
    maxWidth: 32 * unit,
    marginBottom: 4 * unit,
    marginHorizontal: unit,

    // Visuals:
    backgroundColor: '#D9E3ED',
    borderRadius: (3 / 2) * unit,

    // Children:
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: unit
  },

  screen: {
    // Layout:
    position: 'absolute',

    // Children:
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'center'
  },

  text: {
    color: 'black',
    flexShrink: 1,
    fontSize: unit,
    textAlign: 'center'
  }
})
