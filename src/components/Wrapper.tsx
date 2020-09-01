import * as React from 'react'
import { Animated, Platform, StatusBar, StyleSheet } from 'react-native'

import { KeyboardTracker } from './KeyboardTracker'
import { LayoutContext } from './LayoutContext'

interface Props {
  children: React.ReactNode
  statusBarTranslucent?: boolean
  avoidAndroidKeyboard?: boolean
}

export function Wrapper(props: Props): JSX.Element {
  const {
    children,
    avoidAndroidKeyboard = false,
    statusBarTranslucent = false
  } = props

  return (
    <LayoutContext>
      {metrics => {
        const { safeAreaInsets } = metrics
        const downValue = safeAreaInsets.bottom
        const upValue = (keyboardHeight: number): number =>
          Math.max(keyboardHeight, downValue)

        return (
          <KeyboardTracker downValue={downValue} upValue={upValue}>
            {keyboardAnimation => {
              let paddingBottom: number = keyboardAnimation as any
              let paddingTop = safeAreaInsets.top

              if (Platform.OS === 'android') {
                if (!avoidAndroidKeyboard) {
                  paddingBottom = safeAreaInsets.bottom
                }
                if (statusBarTranslucent && StatusBar.currentHeight != null) {
                  paddingTop = safeAreaInsets.top + StatusBar.currentHeight
                }
              }

              return (
                <Animated.View
                  pointerEvents="box-none"
                  style={[
                    styles.screen,
                    {
                      paddingBottom,
                      paddingLeft: safeAreaInsets.left,
                      paddingRight: safeAreaInsets.right,
                      paddingTop
                    }
                  ]}
                >
                  {children}
                </Animated.View>
              )
            }}
          </KeyboardTracker>
        )
      }}
    </LayoutContext>
  )
}

const styles = StyleSheet.create({
  screen: {
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  }
})
