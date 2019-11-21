import * as React from 'react'
import { Dimensions, LayoutRectangle, Platform, StatusBar } from 'react-native'
import { getInset } from 'react-native-safe-area-view'

export interface SafeAreaGap {
  bottom: number
  left: number
  right: number
  top: number
}

export interface LayoutMetrics {
  layout: LayoutRectangle
  safeAreaInsets: SafeAreaGap
}

interface Props {
  // Expects a single child, which is a function
  // that accepts the current layout and returns an element.
  children: (layout: LayoutMetrics) => React.ReactNode
}

interface State {
  height: number
  width: number
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
export class LayoutContext extends React.Component<Props, State> {
  private readonly update: (changes: {
    window: { height: number; width: number }
  }) => unknown

  constructor(props: Props) {
    super(props)
    this.state = Dimensions.get('window')
    this.update = ({ window }) => this.setState(window)
    Dimensions.addEventListener('change', this.update)
  }

  componentWillUnmount(): void {
    Dimensions.removeEventListener('change', this.update)
  }

  render(): React.ReactNode {
    const { height, width } = this.state
    const isLandscape = height < width

    const metrics: LayoutMetrics = {
      layout: { x: 0, y: 0, height, width },
      safeAreaInsets: {
        bottom: isIos ? getInset('bottom', isLandscape) : 0,
        left: isIos ? getInset('left', isLandscape) : 0,
        right: isIos ? getInset('right', isLandscape) : 0,
        top: isIos ? getInset('top', isLandscape) : statusBarHeight()
      }
    }

    return this.props.children(metrics)
  }
}

function statusBarHeight(): number {
  if (typeof StatusBar.currentHeight === 'undefined') return 0
  return StatusBar.currentHeight
}

const isIos = Platform.OS === 'ios'
