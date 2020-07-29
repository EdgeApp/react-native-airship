import * as React from 'react'
import { Animated, Text, TextStyle, ViewStyle } from 'react-native'

import { AirshipBridge } from '../Airship'
import { unpackEdges } from '../utils'

export interface AirshipToastProps {
  bridge: AirshipBridge<undefined>
  children?: React.ReactNode

  // A message to show inside the toast.
  // This will come before any other children.
  message?: string

  // Determines how long the dropdown remains visible,
  // or 0 to disable auto-hide. Defaults to 3000ms.
  autoHideMs?: number

  // The component color. Defaults to grey.
  backgroundColor?: string

  // The radius to use on the corners.
  borderRadius?: number

  // How long the entry animation should be. Defaults to 300ms.
  fadeInMs?: number

  // How long the exit animation should be. Defaults to 500ms.
  fadeOutMs?: number

  // The minimum gap between the component and the screen edges.
  // Takes 0-4 numbers (top, right, bottom, left),
  // using the same logic as the web `margin` property.
  margin?: number | number[]

  // The maximum width the component will be.
  maxWidth?: number

  // The opacity the component should fade to. Defaults to 0.9.
  opacity?: number

  // Internal padding to place inside the component.
  // Takes 0-4 numbers (top, right, bottom, left),
  // using the same logic as the web `padding` property.
  padding?: number | number[]

  // The color to use for the text. Defaults to black.
  textColor?: string

  // The size of the text.
  textSize?: number
}

/**
 * A semi-transparent message overlay.
 */
export function AirshipToast(props: AirshipToastProps): JSX.Element {
  const { textSize = 14 } = props
  const {
    autoHideMs = 3000,
    backgroundColor = 'white',
    borderRadius = 1.5 * textSize,
    bridge,
    children,
    fadeInMs = 300,
    fadeOutMs = 1000,
    maxWidth = 512,
    opacity: finalOpacity = 0.9,
    message,
    textColor = 'black'
  } = props
  const margin = unpackEdges(props.margin ?? 2 * textSize)
  const padding = unpackEdges(props.padding ?? textSize)

  // Create the animation:
  const opacity = React.useRef(new Animated.Value(0)).current
  React.useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined

    // Animate in:
    Animated.timing(opacity, {
      toValue: finalOpacity,
      duration: fadeInMs,
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
      Animated.timing(opacity, {
        toValue: 0,
        duration: fadeOutMs,
        useNativeDriver: true
      }).start(() => bridge.remove())
    })

    return () => {
      if (timeout != null) clearTimeout(timeout)
    }
  })

  const bodyStyle: ViewStyle = {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor,
    borderRadius,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: margin.bottom,
    marginLeft: margin.left,
    marginRight: margin.right,
    marginTop: margin.top,
    maxWidth,
    opacity: opacity as any,
    paddingBottom: padding.bottom,
    paddingLeft: padding.left,
    paddingRight: padding.right,
    paddingTop: padding.top
  }

  const textStyle: TextStyle = {
    color: textColor,
    flexShrink: 1,
    fontSize: textSize,
    textAlign: 'center'
  }

  return (
    <Animated.View style={bodyStyle}>
      {message != null ? <Text style={textStyle}>{message}</Text> : null}
      {children}
    </Animated.View>
  )
}
