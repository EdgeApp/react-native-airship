import * as React from 'react'
import {
  Animated,
  BackHandler,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle
} from 'react-native'

import { AirshipBridge } from '../Airship'
import { KeyboardTracker } from './KeyboardTracker'
import { LayoutContext, SafeAreaGap } from './LayoutContext'

type ChildFunction = (gap: SafeAreaGap) => React.ReactNode

interface Props {
  children: React.ReactNode | ChildFunction
  bridge: AirshipBridge<unknown>

  // True to have the modal float in the center of the screen,
  // or false for a bottom modal:
  center?: boolean

  // Called when the user taps outside the modal or clicks the back button:
  onCancel: () => unknown
}

/**
 * A modal that slides a modal up from the bottom of the screen
 * and dims the rest of the app.
 */
export class AirshipModal extends React.Component<Props> {
  private backHandler: { remove(): unknown } | void = undefined
  private readonly opacity: Animated.Value
  private readonly offset: Animated.Value

  constructor(props: Props) {
    super(props)
    this.opacity = new Animated.Value(0)
    this.offset = new Animated.Value(Dimensions.get('window').height)
  }

  componentDidMount(): void {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.onCancel()
      return true
    })

    // Animate in:
    Animated.parallel([
      Animated.timing(this.opacity, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(this.offset, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start()

    // Animate out:
    this.props.bridge.onResult(() =>
      Animated.parallel([
        Animated.timing(this.opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(this.offset, {
          toValue: Dimensions.get('window').height,
          duration: 300,
          useNativeDriver: true
        })
      ]).start(this.props.bridge.remove)
    )
  }

  componentWillUnmount(): void {
    if (this.backHandler != null) this.backHandler.remove()
  }

  render(): React.ReactNode {
    return (
      <LayoutContext>
        {metrics => {
          const { layout, safeAreaInsets } = metrics
          const downValue = safeAreaInsets.bottom
          function upValue(keyboardHeight: number): number {
            return Math.max(keyboardHeight, downValue)
          }

          return (
            <KeyboardTracker downValue={downValue} upValue={upValue}>
              {(keyboardAnimation, keyboardLayout) =>
                this.renderModal(
                  layout.height,
                  safeAreaInsets,
                  keyboardAnimation,
                  keyboardLayout
                )
              }
            </KeyboardTracker>
          )
        }}
      </LayoutContext>
    )
  }

  /**
   * Draws the actual visual elements, given the current layout information:
   */
  private renderModal(
    height: number,
    gap: SafeAreaGap,
    keyboardAnimation: Animated.Value,
    keyboardLayout: number
  ): React.ReactNode {
    const { children, center = false } = this.props

    // Set up the dynamic CSS values:
    const screenPadding = {
      paddingBottom: keyboardAnimation,
      paddingLeft: gap.left,
      paddingRight: gap.right,
      paddingTop: gap.top
    }
    const transform = [{ translateY: this.offset }]
    const bodyStyle = center
      ? [styles.centerBody, { transform }]
      : [
          styles.bottomBody,
          {
            marginBottom: -keyboardLayout,
            maxHeight: keyboardLayout + 0.75 * (height - gap.bottom - gap.top),
            paddingBottom: keyboardLayout,
            transform
          }
        ]

    const finalChildren = isChildFunction(children)
      ? children({
          bottom: center ? 0 : keyboardLayout,
          left: 0,
          right: 0,
          top: 0
        })
      : children

    return (
      <Animated.View style={[styles.screen, screenPadding]}>
        <TouchableWithoutFeedback onPress={() => this.props.onCancel()}>
          <Animated.View style={[styles.darkness, { opacity: this.opacity }]} />
        </TouchableWithoutFeedback>
        <Animated.View style={bodyStyle}>{finalChildren}</Animated.View>
      </Animated.View>
    )
  }
}

function isChildFunction(
  children: React.ReactNode | ChildFunction
): children is ChildFunction {
  return typeof children === 'function'
}

const borderRadius = 4
const commonBody: ViewStyle = {
  // Layout:
  flexShrink: 1,
  width: 500, // Max width, since we can shrink

  // Visuals:
  backgroundColor: 'white',
  shadowOpacity: 1,
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowRadius: 4,

  // Children:
  alignItems: 'stretch',
  flexDirection: 'column',
  justifyContent: 'flex-start'
}

const styles = StyleSheet.create({
  bottomBody: {
    ...commonBody,

    // Layout:
    alignSelf: 'flex-end',

    // Visuals:
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius
  },

  centerBody: {
    ...commonBody,

    // Layout:
    alignSelf: 'center',
    marginHorizontal: 12,

    // Visuals:
    borderRadius: borderRadius
  },

  darkness: {
    // Layout:
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,

    // Visuals:
    backgroundColor: 'black'
  },

  screen: {
    // Layout:
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,

    // Children:
    flexDirection: 'row',
    justifyContent: 'center'
  }
})
