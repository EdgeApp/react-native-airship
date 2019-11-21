// @flow

import * as React from 'react'

/**
 * Control panel for managing a component inside an airship.
 */
export type AirshipBridge<T> = {
  // Use these to pass values to the outside world:
  resolve(value: T): void,
  reject(error: Error): void,

  // Unmounts the component:
  remove(): void,

  // Runs a callback when the result promise settles.
  // Useful for starting exit animations:
  onResult(callback: () => mixed): void
}

/**
 * Renders a component to place inside the airship.
 */
type AirshipRender<T> = (bridge: AirshipBridge<T>) => React.Node

/**
 * The airship itself is a component you should mount after your main
 * scene or router.
 *
 * It has a static method anyone can call to display components.
 * The method returns a promise, which the component can use to pass values
 * to the outside world.
 */
type Airship = React.ComponentType<{}> & {
  show<T>(render: AirshipRender<T>): Promise<T>
}

/**
 * Constructs an Airship component.
 */
declare export function makeAirship(): Airship
