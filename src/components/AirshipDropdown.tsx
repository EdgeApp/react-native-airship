import * as React from 'react'
import {
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ViewStyle
} from 'react-native'

import { AirshipBridge } from '../types'
import { unpackEdges } from '../util/edges'

export interface AirshipDropdownProps {
  bridge: AirshipBridge<undefined>
  children?: React.ReactNode

  // Called when the user taps anywhere in the dropdown.
  // Defaults to hiding the dropdown.
  onPress?: () => void

  // Determines how long the dropdown remains visible,
  // or 0 to disable auto-hide. Defaults to 5000ms.
  autoHideMs?: number

  // The component color. Defaults to white.
  backgroundColor?: string

  // The radius to use on the bottom corners. Defaults to 4.
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
  // Defaults to 25% of the longest screen dimension.
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

  // How long the exit animation should be. Defaults to 500ms.
  slideOutMs?: number
}

const safeAreaGap = 64

/**
 * A notification that slides down from the top of the screen.
 */
export function AirshipDropdown(props: AirshipDropdownProps): JSX.Element {
  const {
    bridge,
    children,
    onPress = () => bridge.resolve(undefined),
    autoHideMs = 5000,
    backgroundColor = 'white',
    borderRadius = 4,
    flexDirection,
    justifyContent,
    maxHeight = defaultMaxHeight(),
    maxWidth = 512,
    slideInMs = 300,
    slideOutMs = 500
  } = props
  const margin = unpackEdges(props.margin)
  const padding = unpackEdges(props.padding)
  const hiddenOffset = -(maxHeight + margin.bottom)

  // Create the animation:
  const offset = React.useRef(new Animated.Value(hiddenOffset)).current
  React.useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined

    // Animate in:
    Animated.timing(offset, {
      toValue: 0,
      duration: slideInMs,
      useNativeDriver: true
    }).start(() => {
      // Start the auto-hide timer:
      if (autoHideMs > 0) {
        timeout = setTimeout(() => {
          timeout = undefined
          bridge.resolve(undefined)
        }, autoHideMs)
      }
    })

    // Animate out:
    bridge.onResult(() => {
      Animated.timing(offset, {
        toValue: hiddenOffset,
        duration: slideOutMs,
        useNativeDriver: true
      }).start(() => bridge.remove())
    })

    return () => {
      if (timeout != null) clearTimeout(timeout)
    }
  }, [])

  const bodyStyle: ViewStyle = {
    alignSelf: 'flex-start',
    backgroundColor,
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
    flexDirection,
    flexShrink: 1,
    justifyContent,
    marginBottom: margin.bottom,
    marginLeft: margin.left,
    marginRight: margin.right,
    marginTop: -safeAreaGap,
    maxHeight,
    paddingBottom: padding.bottom,
    paddingLeft: padding.left,
    paddingRight: padding.right,
    paddingTop: padding.top + safeAreaGap,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    transform: [{ translateY: offset as any }],
    width: maxWidth // This works because flexShrink is set
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View style={bodyStyle}>{children}</Animated.View>
    </TouchableWithoutFeedback>
  )
}

function defaultMaxHeight(): number {
  const { width, height } = Dimensions.get('screen')
  return 0.25 * Math.max(width, height)
}
