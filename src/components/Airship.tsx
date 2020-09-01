import * as React from 'react'

import { Airship, AirshipBridge, AirshipProps, AirshipRender } from '../types'
import { Wrapper } from './Wrapper'

/**
 * Constructs an Airship component.
 */
export function makeAirship(): Airship {
  // Static state shared by all mounted containers:
  let nextKey: number = 0
  let allChildren: Array<{ key: string; element: React.ReactNode }> = []
  let allContainers: AirshipContainer[] = []

  function updateContainers(): void {
    for (const container of allContainers) container.forceUpdate()
  }

  class AirshipContainer extends React.Component<AirshipProps> {
    constructor(props: AirshipProps) {
      super(props)
      allContainers.push(this)
    }

    componentWillUnmount(): void {
      allContainers = allContainers.filter(item => item !== this)
    }

    render(): React.ReactNode {
      const wrappedChildren = allChildren.map(child => (
        <Wrapper
          key={child.key}
          statusBarTranslucent={this.props.statusBarTranslucent}
          avoidAndroidKeyboard={this.props.avoidAndroidKeyboard}
        >
          {child.element}
        </Wrapper>
      ))
      return [this.props.children, ...wrappedChildren]
    }

    static show<T>(render: AirshipRender<T>): Promise<T> {
      // Assemble the bridge:
      const key = `airship${nextKey++}`
      const bridge: AirshipBridge<T> = {
        onResult(callback) {
          promise.then(callback, callback)
        },
        remove() {
          allChildren = allChildren.filter(child => child.key !== key)
          updateContainers()
        },
        resolve() {
          // Will be replaced
        },
        reject() {
          // Will be replaced
        }
      }
      const promise: Promise<T> = new Promise((resolve, reject) => {
        bridge.resolve = resolve
        bridge.reject = reject
      })

      // Save the child element in the shared state:
      allChildren.push({ key, element: render(bridge) })
      updateContainers()
      return promise
    }
  }

  return AirshipContainer
}
