import * as React from 'react'
import { OnEvents } from 'yavent'

export interface AirshipEvents {
  result: void
  clear: void
}

/**
 * Control panel for managing a component inside an airship.
 */
export interface AirshipBridge<T> {
  // Use these to pass values to the outside world:
  readonly resolve: (value: T | PromiseLike<T>) => void
  readonly reject: (error: Error) => void

  // Unmounts the component:
  readonly remove: () => void

  // Subscribes to events.
  // Use `on('result', callback)` to subscribe to
  // the promise being resolved or rejected.
  // Use `on('clear', callback)` to subscribe to
  // the `Airship.clear` method being called.
  readonly on: OnEvents<AirshipEvents>

  // Runs a callback when the result promise settles.
  // Deprecated in favor of `on('result')`.
  readonly onResult: (callback: () => unknown) => void
}

/**
 * Renders a component to place inside the airship.
 */
export type AirshipRender<T> = (bridge: AirshipBridge<T>) => React.ReactNode

/**
 * Props the Airship container component accepts.
 */
export interface AirshipProps {
  children?: React.ReactNode
  avoidAndroidKeyboard?: boolean
  statusBarTranslucent?: boolean
}

/**
 * The Airship itself is a component you should mount after your main
 * scene or router.
 *
 * It has a static method anyone can call to display components.
 * The method returns a promise, which the component can use to pass values
 * to the outside world.
 */
export interface Airship extends React.FunctionComponent<AirshipProps> {
  clear(): void
  show<T>(render: AirshipRender<T>): Promise<T>
}
