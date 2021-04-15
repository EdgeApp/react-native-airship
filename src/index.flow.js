// @flow

import * as React from 'react'
import { type OnEvents, type Unsubscribe } from 'yavent'

export type { Unsubscribe }

type AirshipEvents = {
  result: void,
  clear: void
}

/**
 * Control panel for managing a component inside an airship.
 */
export type AirshipBridge<T> = {
  // Use these to pass values to the outside world:
  +resolve: (value: T | Promise<T>) => void,
  +reject: (error: Error) => void,

  // Unmounts the component:
  +remove: () => void,

  // Subscribes to events.
  // Use `on('result', callback)` to subscribe to
  // the promise being resolved or rejected.
  // Use `on('clear', callback)` to subscribe to
  // the `Airship.clear` method being called.
  +on: OnEvents<AirshipEvents>,

  // Runs a callback when the result promise settles.
  // Deprecated in favor of `on('result')`.
  +onResult: (callback: () => mixed) => void
}

/**
 * Renders a component to place inside the airship.
 */
type AirshipRender<T> = (bridge: AirshipBridge<T>) => React.Node

/**
 * Props the Airship container component accepts.
 */
export interface AirshipProps {
  children?: React.Node;
}

/**
 * The airship itself is a component you should mount after your main
 * scene or router.
 *
 * It has a static method anyone can call to display components.
 * The method returns a promise, which the component can use to pass values
 * to the outside world.
 */
declare class AirshipClass extends React.Component<AirshipProps> {
  static clear(): void;
  static show<T>(render: AirshipRender<T>): Promise<T>;
}

export type Airship = typeof AirshipClass

/**
 * Constructs an Airship component.
 */
declare export function makeAirship(): Airship

type FlexDirection = 'column-reverse' | 'column' | 'row-reverse' | 'row'
type JustifyContent =
  | 'center'
  | 'flex-end'
  | 'flex-start'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'

/**
 * A drop-down alert.
 */
export type AirshipDropdownProps = {
  bridge: AirshipBridge<void>,
  children?: React.Node,
  onPress?: () => void,

  autoHideMs?: number,
  backgroundColor?: string,
  borderRadius?: number,
  flexDirection?: FlexDirection,
  justifyContent?: JustifyContent,
  margin?: number | number[],
  maxHeight?: number,
  maxWidth?: number,
  padding?: number | number[],
  slideInMs?: number,
  slideOutMs?: number
}
declare export class AirshipDropdown
  extends React.Component<AirshipDropdownProps> {}

/**
 * A slide-up modal which dims the rest of the screen.
 */
export type AirshipModalProps<T> = {
  bridge: AirshipBridge<T>,
  children?: React.Node,
  onCancel: () => void,
  center?: boolean,

  backgroundColor?: string,
  borderRadius?: number,
  flexDirection?: FlexDirection,
  justifyContent?: JustifyContent,
  margin?: number | number[],
  maxHeight?: number,
  maxWidth?: number,
  padding?: number | number[],
  slideInMs?: number,
  slideOutMs?: number,
  underlay?: string | React.Element<any>
}
declare export class AirshipModal<T>
  extends React.Component<AirshipModalProps<T>> {}

/**
 * Emulates the Android Toast component in a cross-platform way.
 */
export type AirshipToastProps = {
  bridge: AirshipBridge<void>,
  children?: React.Node,
  message?: string,

  autoHideMs?: number,
  backgroundColor?: string,
  borderRadius?: number,
  fadeInMs?: number,
  fadeOutMs?: number,
  margin?: number | number[],
  maxWidth?: number,
  opacity?: number,
  padding?: number | number[],
  textColor?: string,
  textSize?: number
}
declare export class AirshipToast extends React.Component<AirshipToastProps> {}
