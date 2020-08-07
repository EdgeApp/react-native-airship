# Custom Airship Components

Although the Airship library comes with a handful of built-in components, it is actually super-easy to write your own:

```javascript
Airship.show(bridge => (
  <TouchableOpacity
    onPress={() => {
      bridge.resolve(true)
      bridge.remove()
    }}
  >
    <Text>Tap to dismiss</Text>
  </TouchableOpacity>
))
```

This component is completely functional, although it lacks pretty styling.

Calling `Airship.show` is similar to calling `new Promise` - you receive some methods that you can use to control the resulting promise. The methods are placed on a `bridge` object, which makes them convenient to pass around as props.

In this example, tapping the text calls `bridge.resolve` to resolve the promise, and then calls `bridge.remove` to un-mount the component.

## Bridge Methods

The `bridge` object has the following lifecycle methods:

- `bridge.resolve` - Resolves the promise returned from `Airship.show`.
- `bridge.reject` - Rejects the promise returned from `Airship.show`.
- `bridge.remove` - Removes the component from the Airship.
- `bridge.onResult(callback)` - Invokes a callback when the component lifetime promise settles (either resolved or rejected).

A typical use-case is to use `bridge.onResult` to start some sort of fade-out animation. That way, calling either `bridge.resolve` or `bridge.reject` will not only settle the promise, but will also begin hiding the component. Once the animation completes, call `bridge.remove` to finally un-mount the component.

## Layout

The `Airship` component mounts its children inside a wrapper component. This wrapper component fills the entire screen, and uses padding to avoid the status bar, keyboard, notches, and other obstacles.

The wrapper component also has `flexDirection: 'row'` and `justifyContent: 'center'` set. This will center your floating UI horizontally. You can align your content vertically by setting `alignSelf` to either `flex-start` (top), `center`, or `flex-end` (bottom).

The wrapper component's padding means that your floating UI will automatically avoid all the obstacles (such as notches) around the edges of the screen. On the other hand, this creates a problem if you actually _want_ your floating UI to touch one or more screen edges (such as for a drawer that slides in).

There are two simple approaches to touching the screen edges:

- Negative margin
- Absolute positioning

### Negative Margin

If you want your component to visually touch the screen edges while still keeping its contents in the safe area, just give those edges a negative margin:

```javascript
return <View style={{ marginTop: -64, paddingTop: 64 }}>{...contents}</View>
```

By balancing the negative margin with an equal and opposite padding, the component will stretch outwards towards the edge of the screen while keeping its contents in the safe area. The exact amount of negative margin doesn't matter, as long as it is large enough to reach all the way to the edge (going over is fine). A conservative value like 64 is about 50% larger than the gap on an iPhone X, so it should be safe for most devices.

### Absolute Positioning

You can also use absolute positioning if you simply want to cover the entire screen:

```javascript
return (
  <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0 }}>
    {...contents}
  </View>
)
```

This will touch all four edges of the screen, completely ignoring the safe area. This approach is great for capturing touches or applying darkening outside your main UI. On the other hand, it loses the safe area information, which makes it less useful if you have contents that need to remain readable.

## Android Differences

By default, React Native for Android automatically resizes its content area to avoid the keyboard and status bar. This means that the wrapper component won't have any padding, since the native code handles the obstacles instead. There are two ways to disable this behavior, however.

### Android Status Bar

Calling `StatusBar.setTranslucent()` or rendering a `<StatusBar translucent />` component on Android will allow the content area to reach up underneath the status bar. Once this happens, the application needs to avoid the status bar manually. The good news is that `Airship` knows how to do this, but the bad news is that React Native doesn't have a way to determine the current translucency state. Instead, `Airship` needs a `statusBarTranslucent` prop to enable this mode:

```javascript
return (
  <Airship statusBarTranslucent>
    <StatusBar translucent />
    {...restOfApp}
  </Airship>
)
```

With this in place, the Android status bar will work more like the iOS one.

### Android Keyboard

Another way to change Android's behavior is to go into AndroidManifest.xml and change `android:windowSoftInputMode="adjustResize"` to `android:windowSoftInputMode="adjustPan"`. This will prevent the React Native content area from resizing when the keyboard appears.

If you have this mode enabled, and would like Airship to respond to keyboard events in the same way as it does on iOS, pass the `avoidAndroidKeyboard` property:

```javascript
return <Airship avoidAndroidKeyboard>{...restOfApp}</Airship>
```

This is not a good idea, though, since the Android OS might decide to slide the entire app vertically to keep the cursor in view. Once the Airship makes its layout adjustments, the entire app will slide back, since the keyboard no longer covers the input. This bounce looks terrible, and the only way to avoid it is to carefully place text inputs in locations where the keyboard can't cover them. Some apps work this way, however, so Airship supports this feature.
