# AirshipToast

The AirshipToast emulates the Android Toast component in a cross-platform way.

<img alt="Screen shot" src="./toast.png" width="300" />

The toast accepts a `bridge` property, which allows it to animate away & remove itself once the `Airship.show` promise resolves.

The toast ignores touch events (they pass right through), but it does auto-hide after a short timeout. You can use the `autoHideMs` prop to change the timeout (or disable it).

Since the toast requires an `Airship` to be useful, a good approach is to wrap the toast in a short helper function:

```javascript
import { AirshipToast, makeAirship } from 'react-native-airship'

export const Airship = makeAirship()

export function showToast(message) {
  Airship.show(bridge => <AirshipToast bridge={bridge} message={message} />)
}
```

Now your app can easily call `showToast` from anywhere.

## Advanced Example

Here is a more advanced example that shows a spinner as long as a promise is pending:

```typescript
export function showActivity<T>(
  message: string,
  activity: Promise<T>
): Promise<T> {
  Airship.show(bridge => {
    // Hide the toast when the activity completes:
    activity.then(
      () => bridge.resolve(),
      () => bridge.resolve()
    )
    return (
      <AirshipToast bridge={bridge} autoHideMs={0} message={message}>
        <ActivityIndicator />
      </AirshipToast>
    )
  })
  return activity
}
```

This is useful when a user-triggered action might take a long time, like fetching data from the network:

```javascript
const response = await showActivity(
  'Loading',
  fetch('https://google.com/robots.txt')
)
```

## Reference

Here are the properties the component accepts. Only the `bridge` property is mandatory. The defaults are designed to emulate the native Android toast.

```typescript
export interface AirshipToastProps {
  bridge: AirshipBridge<undefined>
  children?: React.ReactNode

  // A message to show inside the toast.
  // This will come before any other children.
  message?: string

  // Determines how long the dropdown remains visible,
  // or 0 to disable auto-hide. Defaults to 3000ms.
  autoHideMs?: number

  // The component background color.
  backgroundColor?: string

  // The radius to use on the corners.
  borderRadius?: number

  // How long the entry animation should be. Defaults to 300ms.
  fadeInMs?: number

  // How long the exit animation should be. Defaults to 500ms.
  fadeOutMs?: number

  // The minimum gap between the component and the screen edges.
  // Takes 0-4 numbers (top, right, bottom, left),
  // using the same logic as the web `margin` property.
  margin?: number | number[]

  // The maximum width the component will be.
  maxWidth?: number

  // The opacity the component should fade to.
  opacity?: number

  // Internal padding to place inside the component.
  // Takes 0-4 numbers (top, right, bottom, left),
  // using the same logic as the web `padding` property.
  padding?: number | number[]

  // The color to use for the text.
  textColor?: string

  // The size of the text.
  textSize?: number
}
```
