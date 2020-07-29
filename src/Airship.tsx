import * as React from 'react'

import { Wrapper } from './wrapper/Wrapper'

/**
 * Control panel for managing a component inside an airship.
 */
export interface AirshipBridge<T> {
  // Use these to pass values to the outside world:
  resolve(value: T | PromiseLike<T>): void
  reject(error: Error): void

  // Unmounts the component:
  remove(): void

  // Runs a callback when the result promise settles.
  // Useful for starting exit animations:
  onResult(callback: () => unknown): void
}

interface Props {
  children?: React.ReactNode
  avoidAndroidKeyboard?: boolean
  statusBarTranslucent?: boolean
}

/**
 * Renders a component to place inside the airship.
 */
type AirshipRender<T> = (bridge: AirshipBridge<T>) => React.ReactNode

/**
 * The airship itself is a component you should mount after your main
 * scene or router.
 *
 * It has a static method anyone can call to display components.
 * The method returns a promise, which the component can use to pass values
 * to the outside world.
 */
export interface Airship extends React.ComponentClass<Props> {
  show<T>(render: AirshipRender<T>): Promise<T>
}

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

  class AirshipContainer extends React.Component<Props> {
    constructor(props: Props) {
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
