import * as React from 'react'
import { Dimensions, Platform, ScaledSize } from 'react-native'
import { getInset } from 'react-native-safe-area-view'

export interface SafeAreaGap {
  bottom: number
  left: number
  right: number
  top: number
}

export interface LayoutMetrics {
  layout: { height: number; width: number }
  safeAreaInsets: SafeAreaGap
}

interface Props {
  // Expects a single child, which is a function
  // that accepts the current layout and returns an element.
  children: (layout: LayoutMetrics) => JSX.Element
}

/**
 * In the future, React Native will provide this component itself:
 * https://github.com/facebook/react-native/pull/20999
 *
 * For now, we emulate the proposed API using the community
 * react-native-safe-area-view.
 *
 * On Android, the height will not subtract the soft menu bar.
 * Do not rely on the height being correct! Use flexbox to do layout
 * wherever possible, rather than relying on dimensions.
 */
export function LayoutContext(props: Props): JSX.Element {
  const [size, setSize] = React.useState(Dimensions.get('window'))
  React.useEffect(() => {
    function onChange(change: { window: ScaledSize }): void {
      setSize(change.window)
    }
    Dimensions.addEventListener('change', onChange)
    return () => Dimensions.removeEventListener('change', onChange)
  }, [])

  const isLandscape = size.height < size.width
  const metrics: LayoutMetrics = {
    layout: size,
    safeAreaInsets: {
      bottom: isIos ? getInset('bottom', isLandscape) : 0,
      left: isIos ? getInset('left', isLandscape) : 0,
      right: isIos ? getInset('right', isLandscape) : 0,
      top: isIos ? getInset('top', isLandscape) : 0
    }
  }

  return props.children(metrics)
}

const isIos = Platform.OS === 'ios'
