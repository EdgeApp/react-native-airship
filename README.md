# react-native-airship

The airship floats above your React Native application, providing a place for modals, alerts, menus, toasts, and anything else to appear on top of your normal UI.

<img alt="Glass sheet hovering above phone" src="./docs/isometric.png" width="400" />

To place an item on the airship, call the `Airship.show` method:

```javascript
const answer = await Airship.show(bridge => (
  <YesNoModal bridge={bridge} question="Do you like questions?" />
))
```

The `Airship.show` method returns a promise, so you can simply `await` the user's feedback. This is much simpler than the typical approach of setting up a router and writing custom state handling.

Besides the generic `Airship` container, this library comes with a handful of ready-to-use UI components:

- [AirshipDropdown](./docs/dropdown.md) - A drop-down alert.
- [AirshipModal](./docs/modal.md) - A slide-up modal which dims the rest of the screen.
- [AirshipToast](./docs/toast.md) - Emulates the Android Toast component in a cross-platform way.

If these don't do what you want, you can easily [write your own components](./docs/custom-components.md) to work with Airship.

## Setup

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
import { Airship } from './your-app.js'

Airship.show(bridge => <AirshipToast bridge={bridge} message="Hey!" />)
```

The top-level `Airship` component may need two additional properties on Android. If you have set your status bar to translucent, set the `statusBarTranslucent` property on the Airship to continue avoiding the top of the screen. Similarly, if you have changed `android:windowSoftInputMode` to `adjustPan` in your AndroidManifest.xml, you can use the Airship `avoidAndroidKeyboard` property to bring back the original keyboard-avoiding behavior (although this is optional - the Android OS provides reasonable default behavior without it).

## Demo

This repository includes a [demo application](./AirshipDemo/) you can use to try out the Airship. You will need to run `yarn install` or `npm install` separately in that folder to set up the demo, and then run either `react-native run-android` or `react-native run-ios` to start the demo.
