# react-native-airship Demo App

This app shows off the react-native-airship built-in components.

To launch the demo, first run `yarn install` in this folder to set up the dependences, and then run either `yarn android` or `yarn ios`.

If you want to edit the Airship library while using this demo, run the `copy-airship.sh` script located in this folder to copy your changes into `node_modules`.

## Theming

Most applications have unique color schemes. If you want to customize the Airship components to match your color scheme, it is simplest to make some lightweight wrappers around the built-in components. These wrappers pass in the right default colors, so you can use the wrapped components througout your app without worrying about appearances.

See [ThemedModal](./src/ThemedModal.tsx) for an example of what theming a component might look like.

This demo includes both light & dark themes based on the Solarized color scheme, and it uses the [react-native-patina](https://www.npmjs.com/package/react-native-patina) library to switch between them. This is just a demo, so feel free to use whatever theming approach you like.
