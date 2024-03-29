import * as React from 'react'
import { OnEvents } from 'yavent'

export interface AirshipEvents {
  result: undefined
  clear: undefined
}

/**
 * Control panel for managing a component inside an airship.
 */
export interface AirshipBridge<T> {
  // Use these to pass values to the outside world:
  resolve: (value: T | PromiseLike<T>) => void
  reject: (error: Error) => void

  // Unmounts the component:
  remove: () => void

  // Subscribes to events.
  // Use `on('result', callback)` to subscribe to
  // the promise being resolved or rejected.
  // Use `on('clear', callback)` to subscribe to
  // the `Airship.clear` method being called.
  on: OnEvents<AirshipEvents>

  // Runs a callback when the result promise settles.
  // Deprecated in favor of `on('result')`.
  onResult: (callback: () => unknown) => void
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
}

/**
 * The Airship itself is a component you should mount around your main
 * scene or router.
 *
 * It has a static method anyone can call to display components.
 * The method returns a promise, which the component can use to pass values
 * to the outside world.
 */
export interface Airship extends React.FunctionComponent<AirshipProps> {
  clear: () => void

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  show: <T = void>(render: AirshipRender<T>) => Promise<T>
}
