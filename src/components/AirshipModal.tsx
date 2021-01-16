import * as React from 'react'
import {
  Animated,
  BackHandler,
  Dimensions,
  TouchableWithoutFeedback,
  ViewStyle
} from 'react-native'

import { AirshipBridge } from '../types'
import { fixSides, sidesToMargin, sidesToPadding } from '../util/sides'

export interface AirshipModalProps<T = unknown> {
  bridge: AirshipBridge<T>
  children?: React.ReactNode

  // Called when the user taps outside the modal or clicks the back button:
  onCancel: () => void

  // True to have the modal float in the center of the screen,
  // or false for a bottom modal. Defaults to false.
  center?: boolean

  // The component color. Defaults to white.
  backgroundColor?: string

  // The radius to use on the corners. Defaults to 10.
  borderRadius?: number

  // The flex direction for the contents.
  flexDirection?: ViewStyle['flexDirection']

  // How to justify the contents along the flex direction.
  justifyContent?: ViewStyle['justifyContent']

  // The minimum gap between the component and the screen edges.
  // Takes 0-4 numbers (top, right, bottom, left),
  // using the same logic as the web `margin` property. Defaults to 0.
  margin?: number | number[]

  // The maximum height the component will be.
  // Defaults to no limit.
  maxHeight?: number

  // The maximum width the component will be.
  // Defaults to 512.
  maxWidth?: number

  // Internal padding to place inside the component.
  // Takes 0-4 numbers (top, right, bottom, left),
  // using the same logic as the web `padding` property. Defaults to 0.
  padding?: number | number[]

  // How long the entry animation should be. Defaults to 300ms.
  slideInMs?: number

  // How long the exit animation should be. Defaults to 300ms.
  slideOutMs?: number

  // The color of the window underlay,
  // or a React element for a custom background.
  // Defaults to rgba(0, 0, 0, 0.75).
  underlay?: string | React.ReactElement
}

const safeAreaGap = 64

/**
 * A modal that slides a modal up from the bottom of the screen
 * and dims the rest of the app.
 */
export function AirshipModal<T>(props: AirshipModalProps<T>): JSX.Element {
  const {
    bridge,
    children,
    onCancel,
    backgroundColor = 'white',
    borderRadius = 10,
    center = false,
    flexDirection,
    justifyContent,
    maxHeight,
    maxWidth = 512,
    slideInMs = 300,
    slideOutMs = 300,
    underlay = 'rgba(0, 0, 0, 0.75)'
  } = props
  const margin = sidesToMargin(fixSides(props.margin, 0))
  const padding = sidesToPadding(fixSides(props.padding, 0))
  React.useEffect(() => bridge.on('clear', onCancel), [bridge, onCancel])

  // Create the animations:
  const offset = React.useRef(
    new Animated.Value(Dimensions.get('window').height)
  ).current
  const opacity = React.useRef(new Animated.Value(0)).current
  React.useEffect(() => {
    // Animate in:
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: slideInMs,
        useNativeDriver: true
      }),
      Animated.timing(offset, {
        toValue: 0,
        duration: slideInMs,
        useNativeDriver: true
      })
    ]).start()

    // Animate out:
    bridge.on('result', () => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: slideOutMs,
          useNativeDriver: true
        }),
        Animated.timing(offset, {
          toValue: Dimensions.get('window').height,
          duration: slideOutMs,
          useNativeDriver: true
        })
      ]).start(bridge.remove)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Set up the back-button handler:
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        onCancel()
        return true
      }
    )
    return () => backHandler.remove()
  }, [onCancel])

  const underlayStyle: ViewStyle = {
    backgroundColor: typeof underlay === 'string' ? underlay : 'transparent',
    bottom: 0,
    left: 0,
    opacity: opacity as any,
    position: 'absolute',
    right: 0,
    top: 0
  }

  const bodyCommon: ViewStyle = {
    ...margin,
    ...padding,
    alignSelf: center ? 'center' : 'flex-end',
    backgroundColor,
    flexDirection,
    flexShrink: 1,
    justifyContent,
    maxHeight,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    transform: [{ translateY: offset as any }],
    width: maxWidth // This works because flexShrink is set
  }
  const bodyStyle = center
    ? {
        ...bodyCommon,
        borderRadius
      }
    : {
        ...bodyCommon,
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
        marginBottom: -safeAreaGap,
        paddingBottom: padding.paddingBottom + safeAreaGap
      }

  return (
    <>
      <TouchableWithoutFeedback onPress={() => onCancel()}>
        <Animated.View style={underlayStyle}>
          {typeof underlay !== 'string' ? underlay : undefined}
        </Animated.View>
      </TouchableWithoutFeedback>
      <Animated.View style={bodyStyle}>{children}</Animated.View>
    </>
  )
}
