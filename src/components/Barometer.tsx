import * as React from 'react'
import {
  Dimensions,
  EmitterSubscription,
  Keyboard,
  KeyboardEventListener,
  Platform,
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native'

import {
  addSides,
  mapSides,
  Offset,
  Padding,
  SideList,
  sidesToOffset,
  sidesToPadding,
  subtractSides
} from '../util/sides'

export interface BarometerLayout {
  offset: Offset
  padding: Padding
}

interface Props {
  children?: React.ReactNode
  onLayout?: (layout: BarometerLayout) => void
}

const emptySides: SideList = [0, 0, 0, 0]

/**
 * Measures various things about the Airship environment,
 * so we know how to position our children.
 *
 * This component mounts a view with absolute positioning,
 * and then measures that view relative to the window.
 * If a side is inset from the window edge, we use a negative offset
 * to expand it outward. If a side extends beyond the window edge,
 * we use padding to push the content inward.
 *
 * On iOS, we also mount a child inside a SafeAreaView, to measure
 * the safe area insets. We add these to the padding.
 *
 * Finally, we keep track of the keyboard, adding extra padding &
 * scheduling animations as needed.
 */
export function Barometer(props: Props): JSX.Element {
  const { children, onLayout = () => {} } = props

  // Mutable state:
  const keyboardHeight = React.useRef<number>(0)
  const lastLayoutJson = React.useRef<string>('')
  const view = React.useRef<SafeAreaView | View>(null)
  const childView = React.useRef<View>(null)

  // Handle layout changes:
  const handleLayout = React.useCallback((): void => {
    // Measure the view in the window:
    const viewPromise = new Promise<SideList>(resolve => {
      if (view.current == null) return resolve(emptySides)
      view.current.measureInWindow((x, y, width, height) => {
        const window = Dimensions.get('window')
        resolve([y, window.width - width - x, window.height - height - y, x])
      })
    })

    // Measure the child view in the window:
    const childPromise = new Promise<SideList>(resolve => {
      if (childView.current == null) return resolve(viewPromise)
      childView.current.measureInWindow((x, y, width, height) => {
        const window = Dimensions.get('window')
        resolve([y, window.width - width - x, window.height - height - y, x])
      })
    })

    // Measure the gap between the bottom of the screen and the view:
    const bottomPromise = new Promise<number>(resolve => {
      if (view.current == null) return 0
      view.current.measure((x, y, width, height, screenX, screenY) => {
        const screen = Dimensions.get('screen')
        resolve(screen.height - height - screenY)
      })
    })

    // Combine the results, then call the callback:
    Promise.all([viewPromise, childPromise, bottomPromise])
      .then(([viewOffset, childOffset, bottomGap]) => {
        // Cancel out any offset, so we cover the full window:
        const offset = mapSides(viewOffset, side => -Math.max(side, 0))

        // If the offset is negative, issue positive padding,
        // plus any safe area:
        const safePadding = subtractSides(childOffset, viewOffset)
        const padding = addSides(
          safePadding,
          mapSides(viewOffset, side => Math.abs(side))
        )

        // Use the keyboard padding, if needed:
        const keyboardPadding = Math.max(
          keyboardHeight.current - bottomGap - offset[2],
          0
        )
        padding[2] = Math.max(padding[2], keyboardPadding)

        // Send an update if we have changes:
        const string = JSON.stringify([offset, padding])
        if (string !== lastLayoutJson.current) {
          lastLayoutJson.current = string
          onLayout({
            offset: sidesToOffset(offset),
            padding: sidesToPadding(padding)
          })

          // Force a second trigger because React Native can fail to invoke
          // onLayout for some edge cases.
          setTimeout(handleLayout, 2000)
        }
      })
      .catch(() => {})
  }, [onLayout])

  // Subscribe to keyboard changes:
  React.useEffect(() => {
    const handleKeyboard: KeyboardEventListener = event => {
      const screen = Dimensions.get('screen')
      keyboardHeight.current = Math.min(
        // These two give different results sometimes, so pick the smaller one:
        screen.height - event.endCoordinates.screenY,
        event.endCoordinates.height
      )
      if (event.duration > 0) {
        Keyboard.scheduleLayoutAnimation(event)
      }
      handleLayout()
    }
    const listeners: EmitterSubscription[] = []
    if (Platform.OS === 'android') {
      listeners.push(Keyboard.addListener('keyboardDidShow', handleKeyboard))
      listeners.push(Keyboard.addListener('keyboardDidHide', handleKeyboard))
    } else {
      listeners.push(
        Keyboard.addListener('keyboardWillChangeFrame', handleKeyboard)
      )
    }
    return () => listeners.forEach(listener => listener.remove())
  }, [handleLayout])

  if (Platform.OS === 'android') {
    return (
      <View
        ref={view}
        onLayout={handleLayout}
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        testID="AirshipBarometer"
      >
        {children}
      </View>
    )
  }

  return (
    <SafeAreaView
      ref={view}
      onLayout={handleLayout}
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      testID="AirshipBarometer"
    >
      <View ref={childView} style={{ flex: 1 }} testID="AirshipBarometerChild">
        {children}
      </View>
    </SafeAreaView>
  )
}
