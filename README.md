# react-native-airship

The airship floats above your React Native application, providing a place for modals, alerts, menus, toasts, and anything else to appear on top of your normal UI.

The Airship uses promises to represent component lifetimes, so you can `await` the user's feedback from whatever modal / menu / alert you are showing inside the airship.

To place an item on the airship, just call the `Airship.show` method:

```javascript
const answer = await Airship.show(bridge => (
  <YesNoModal
    onYes={() => {
      bridge.resolve(true) // Resolves the promise
      bridge.remove() // Un-mounts the component
    }}
    onNo={() => {
      bridge.resolve(false)
      bridge.remove()
    }}
  />
))
```

The UI element can control its own lifetime, as well as the returned promise, using methods on the `bridge` object.

## Usage

Install `react-native-airship` using either NPM or yarn:

```sh
yarn add react-native-airship
# or:
npm i -s react-native-airship
```

Next, create an Airship instance and place it outside your main scene or router:

```javascript
// your-app.js:
import { makeAirship } from 'react-native-airship'

export const Airship = makeAirship()

export const App = () => (
  <Airship>
    <YourMainScene />
  </Airship>
)
```

Now, anybody in your application can use this `Airship` instance to show things on top of the app:

```javascript
import { Airship } from `./your-app.js`

Airship.show(...);
```

## Bridge Methods

Calling `Airship.show` is similar to calling `new Promise` - you receive some methods that you can use to control the resulting promise. The methods are placed on a `bridge` object, which makes them convenient to pass around as props, for example. The `bridge` object has the following methods:

- `bridge.resolve` - Resolves the component lifetime promise.
- `bridge.reject` - Rejects the component lifetime promise.
- `bridge.remove` - Removes the component from the Airship.
- `bridge.onResult(callback)` - Invokes the callback when the component lifetime promise settles (either resolved or rejected).

A typical use-case is to use `bridge.onResult` to start some sort of fade-out animation. That way, calling either `bridge.resolve` or `bridge.reject` will not only settle the promise, but will also begin hiding the component. Once the animation completes, call `bridge.remove` to finally un-mount the component.

## Demos

There are several demo components in this repository. You can `import { ... } from 'react-native-airship/demos'` to use them directly. Since these components are just demos, they don't support a lot of customization. You are welcome to use them as starting point for writing your own components:

- AirshipDropdown - A drop-down alert.
- AirshipModal - A white modal box. Dims the rest of the screen, so tapping outside will dismiss the modal.
- AirshipToast - Emulates the Android Toast component in a cross-platform way.

The demo components use `react-native-safe-area-view` to avoid the edges of the screen. You will need to install this library and link its native dependencies to use the demos.
