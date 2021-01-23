# Custom Airship Components

Although the Airship library comes with a handful of built-in components, it is actually super-easy to write your own:

```javascript
function CustomFloatingComponent(props) {
  const { bridge } = props
  React.useEffect(() => bridge.on('clear', bridge.resolve), [])
  React.useEffect(() => bridge.on('result', bridge.remove), [])

  return (
    <TouchableOpacity onPress={() => bridge.resolve()}>
      <Text>Tap to dismiss</Text>
    </TouchableOpacity>
  )
}

Airship.show(bridge => <CustomFloatingComponent bridge={bridge} />)
```

This component is completely functional, although it lacks pretty styling. See [AirshipDemo/src/CustomFloatingComponent.tsx](../AirshipDemo/src/CustomFloatingComponent.tsx) for a styled version.

Calling `Airship.show` is similar to calling `new Promise` - you receive some methods that you can use to control the resulting promise. The methods are placed on a `bridge` object, which makes them convenient to pass around as props.

In this example, tapping the text calls `bridge.resolve` to resolve the promise. Once the promise resolves, the component un-mounts itself in response to the `bridge.on('result')` callback.

## Bridge Methods

The `bridge` object has the following methods:

- `bridge.resolve` - Resolves the promise returned from `Airship.show`.
- `bridge.reject` - Rejects the promise returned from `Airship.show`.
- `bridge.remove` - Removes the component from the Airship.
- `bridge.on('result', callback)` - Invokes the callback when the component lifetime promise settles (either resolved or rejected).
- `bridge.on('clear', callback)` - Invokes the callback whenever `Airship.clear` is called.

A typical use-case is to use `bridge.on('result')` to start some sort of fade-out animation. That way, calling either `bridge.resolve` or `bridge.reject` will not only settle the promise, but will also begin hiding the component. Once the animation completes, call `bridge.remove` to finally un-mount the component.

It is also a good idea to set up a `bridge.on('clear')` callback, so your component can remove itself when somebody calls `Airship.clear`.

The bridge also has a deprecated `onResult` method, which is equivalent to calling `on('result')`. Do not use `onResult` method; it will go away in the next breaking release.

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
