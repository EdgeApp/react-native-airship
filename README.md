# react-native-airship

The airship floats above your React Native application, providing a place for modals, alerts, menus, toasts, and anything else to appear on top of your normal UI.

<img alt="Glass sheet hovering above phone" src="./docs/isometric.png" width="400" />

Unlike React Native's built-in `Modal` component, the airship doesn't block the user from interacting with the application below. The airship has also a simple, promised-based API that lets it easily host multiple children at once. To place an item on the airship, call the `Airship.show` method:

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

There is also an `Airship.clear` method that can quickly remove everything mounted on the Airship (useful when logging out, for instance).

## Demo

This repository includes a [demo application](./AirshipDemo/) you can use to try out the Airship. You will need to run `yarn install` or `npm install` separately in that folder to set up the demo, and then run either `react-native run-android` or `react-native run-ios` to start the demo.
