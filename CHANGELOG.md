# react-native-airship

## 0.2.7 (2021-07-29)

### Added

- New optional `overflow` prop for `AirshipModal`.

## 0.2.6 (2021-07-15)

- feature: Add optional shadow properties to the `AirshipModal`:
  - `shadowOffset`
  - `shadowOpacity`
  - `shadowRadius`

## 0.2.5 (2021-04-15)

- fix: Make the `Airship` Flow type work like the Typescript version.

## 0.2.4 (2021-03-25)

- fix: Do not crash when calling `Airship.clear` recursively.

## 0.2.3 (2021-01-23)

- fix: Measure the screen by mounting a test component and seeing where it lands, avoiding the need for various properties to control the layout. If the status bar is translucent, or if they keyboard is `adjustPan` mode on Android, we can automatically determine that now and do the right thing.
- removed: `avoidAndroidKeyboard` prop on the top-level `Airship`.
- removed: `statusBarTranslucent` prop on the top-level `Airship`.

## 0.2.2 (2020-09-03)

- feature: Add an `Airship.clear` method, which calls any callbacks registered with `bridge.on('clear')`.
- feature: Add a `bridge.on('result')` method to replace `bridge.onResult`.
- fix: Add some missing Flow type definitions.
- fix: Make the Typescript definitions work better with strict mode.
- deprecated: `bridge.onResult`

## 0.2.1 (2020-08-11)

- Fix various Flow & documentation issues from the previous release.

## 0.2.0(2020-08-07)

With this version, the demo components become an official part of the library. The old `react-native-airship/demos` entry point has gone away, so you can import `AirshipDropdown`, `AirshipModal`, and `AirshipToast` directly from `react-native-airship` now.

Since the demo components are meant to be directly usable, they now accept many more properties for controlling their appearance & behavior.

The `activity` property on the `AirshipToast` has also gone away. See the [documentation](./docs/toast.md) for another way to achieve this same result.

The `styleOverride` property on the `AirshipModal` has also gone away. Use the new appearance properties to make changes now.

## 0.1.4 (2020-07-31)

- Update the readme file with a cool image.

## 0.1.3 (2020-07-28)

- Fix the Flow types for compatibility with older versions.

## 0.1.2 (2019-11-27)

- Port the demos to `react-native-safe-area-context`.
- Add a temporary `styleOverride` prop to the modal while we figure out which customizations we want to support.

## 0.1.1 (2019-11-22)

- Fix a packaging glitch that made the demos unusable.

## 0.1.0 (2019-11-21)

- Initial release, extracted from edge-react-gui.
