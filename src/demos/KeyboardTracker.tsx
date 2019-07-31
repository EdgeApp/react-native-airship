import * as React from 'react'
import { Animated, Keyboard, KeyboardEvent, Platform } from 'react-native'

interface Props {
  children: (animation: Animated.Value, layout: number) => React.ReactNode
  downValue?: number
  upValue?: number | ((keyboardHeight: number) => number)
}

/**
 * Tracks the currect keyboard state,
 * and updates an animated value as the keyboard moves up or down.
 *
 * The animation moves smoothly between a "down value" and an "up value".
 * You provide these endpoints as props, so they can accomodate things
 * like notches or weird layouts. If your layout changes (like when the
 * device rotates), just pass new values for `upValue` or `downValue`,
 * and the animated value will adjust to match. If `upValue` depends on
 * the keyboard height, just pass a function instead of number.
 *
 * This component also provides a "layout value" to your component.
 * The layout value changes to the final `upValue` right before
 * the keyboard starts sliding up, and goes back to `downValue`
 * after the keyboard finishes disappearing. This gives you a chance
 * to make layout updates in preparation for the animation, like adding
 * extra space to the bottom of your component so a gap doesn't appear.
 */
export class KeyboardTracker extends React.Component<Props> {
  private readonly animation: Animated.Value
  private animationGoal: number
  private nextDuration: number
  private readonly sub: KeyboardSubscriber

  constructor(props: Props) {
    super(props)

    if (globalKeyboardSubscriber == null) {
      globalKeyboardSubscriber = new KeyboardSubscriber()
    }
    this.sub = globalKeyboardSubscriber
    this.sub.register(this)
    this.animationGoal = this.calculateGoal()
    this.animation = new Animated.Value(this.animationGoal)
    this.nextDuration = 0
  }

  private calculateGoal(): number {
    const { downValue = 0, upValue = (height: number) => height } = this.props
    const { keyboardHeight, keyboardHiding } = this.sub

    if (keyboardHiding) return downValue
    return typeof upValue === 'function' ? upValue(keyboardHeight) : upValue
  }

  setNextDuration(duration: number): void {
    this.nextDuration = duration
  }

  triggerAnimation(): void {
    const nextGoal = this.calculateGoal()
    if (nextGoal !== this.animationGoal) {
      if (this.nextDuration !== 0) {
        Animated.timing(this.animation, {
          toValue: nextGoal,
          duration: this.nextDuration
        }).start()
      } else {
        this.animation.setValue(nextGoal)
      }
      this.animationGoal = nextGoal
      this.nextDuration = 0
    }
  }

  updateLayout(): void {
    if (this.props.children.length > 1) this.forceUpdate()
    else this.triggerAnimation()
  }

  componentWillUnmount(): void {
    this.sub.unregister(this)
  }

  componentDidUpdate(): void {
    this.triggerAnimation()
  }

  render(): React.ReactNode {
    const { children } = this.props
    return children(this.animation, this.calculateGoal())
  }
}

/**
 * All KeyboardTracker instances share the same subscription singleton.
 */
class KeyboardSubscriber {
  private trackers: KeyboardTracker[]

  // Hiding means we are either down or moving down:
  keyboardHiding: boolean
  keyboardHeight: number

  constructor() {
    this.trackers = []
    this.keyboardHeight = 0
    this.keyboardHiding = true

    // Subscribe to the keyboard:
    if (Platform.OS === 'android') {
      Keyboard.addListener('keyboardDidHide', (event: KeyboardEvent) => {
        this.keyboardHiding = true
        this.keyboardHeight = 0
        this._updateLayouts()
      })
      Keyboard.addListener('keyboardDidShow', (event: KeyboardEvent) => {
        this.keyboardHiding = false
        this.keyboardHeight = event.endCoordinates.height
        this._updateLayouts()
      })
    } else {
      Keyboard.addListener('keyboardDidHide', (event: KeyboardEvent) => {
        this.keyboardHeight = 0
        this._updateLayouts()
      })
      Keyboard.addListener('keyboardWillHide', (event: KeyboardEvent) => {
        this.keyboardHiding = true
        this._setDurations(event.duration)
        this._triggerAnimations()
      })
      Keyboard.addListener('keyboardWillShow', (event: KeyboardEvent) => {
        this.keyboardHiding = false
        this.keyboardHeight = event.endCoordinates.height
        this._setDurations(event.duration)
        this._updateLayouts()
      })
    }
  }

  register(tracker: KeyboardTracker): void {
    this.trackers.push(tracker)
  }

  unregister(tracker: KeyboardTracker): void {
    this.trackers = this.trackers.filter(item => item !== tracker)
  }

  private _setDurations(duration: number): void {
    for (const tracker of this.trackers) {
      tracker.setNextDuration(duration)
    }
  }

  private _triggerAnimations(): void {
    for (const tracker of this.trackers) {
      tracker.triggerAnimation()
    }
  }

  private _updateLayouts(): void {
    for (const tracker of this.trackers) {
      tracker.updateLayout()
    }
  }
}

let globalKeyboardSubscriber: KeyboardSubscriber | null = null
