import * as React from 'react'

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
export interface Airship extends React.ComponentClass<AirshipProps> {
  show<T>(render: AirshipRender<T>): Promise<T>
}
