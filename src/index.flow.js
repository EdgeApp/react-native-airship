// @flow

import * as React from 'react'
import { type ViewStyle } from 'react-native'

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

interface Props {
  children?: React.Node;
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
declare export class Airship extends React.Component<Props> {
  static show<T>(render: AirshipRender<T>): Promise<T>;
}

/**
 * Constructs an Airship component.
 */
declare export function makeAirship(): typeof Airship

/**
 * A drop-down alert.
 */
export interface AirshipDropdownProps {
  bridge: AirshipBridge<void>;
  children: React.Node;
  onPress?: () => void;

  autoHideMs?: number;
  backgroundColor?: string;
  borderRadius?: number;
  flexDirection?: $PropertyType<ViewStyle, 'flexDirection'>;
  justifyContent?: $PropertyType<ViewStyle, 'justifyContent'>;
  margin?: number | number[];
  maxHeight?: number;
  maxWidth?: number;
  padding?: number | number[];
  slideInMs?: number;
  slideOutMs?: number;
}
declare export class AirshipDropdown extends React.Component<AirshipDropdownProps> {}

/**
 * A slide-up modal which dims the rest of the screen.
 */
export interface AirshipModalProps<T = mixed> {
  bridge: AirshipBridge<T>;
  children: React.Node;
  onCancel: () => void;
  center?: boolean;

  backgroundColor?: string;
  borderRadius?: number;
  flexDirection?: $PropertyType<ViewStyle, 'flexDirection'>;
  justifyContent?: $PropertyType<ViewStyle, 'justifyContent'>;
  margin?: number | number[];
  maxHeight?: number;
  maxWidth?: number;
  padding?: number | number[];
  slideInMs?: number;
  slideOutMs?: number;
  underlay?: string | React.Element<any>;
}
declare export class AirshipModal extends React.Component<
  AirshipModalProps<mixed>
> {}

/**
 * Emulates the Android Toast component in a cross-platform way.
 */
export interface AirshipToastProps {
  bridge: AirshipBridge<void>;
  children?: React.Node;
  message?: string;

  autoHideMs?: number;
  backgroundColor?: string;
  borderRadius?: number;
  fadeInMs?: number;
  fadeOutMs?: number;
  margin?: number | number[];
  maxWidth?: number;
  opacity: number;
  padding?: number | number[];
  textColor: string;
  textSize: number;
}
declare export class AirshipToast extends React.Component<AirshipToastProps> {}
