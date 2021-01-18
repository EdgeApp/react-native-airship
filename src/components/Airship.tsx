import * as React from 'react'
import { View } from 'react-native'
import { Event, Events, makeEvent, makeEvents } from 'yavent'

import {
  Airship,
  AirshipBridge,
  AirshipEvents,
  AirshipProps,
  AirshipRender
} from '../types'
import { sidesToOffset, sidesToPadding } from '../util/sides'
import { Barometer, BarometerLayout } from './Barometer'

interface Guest {
  key: string
  element: React.ReactNode
}

const emptyLayout: BarometerLayout = {
  offset: sidesToOffset([0, 0, 0, 0]),
  padding: sidesToPadding([0, 0, 0, 0])
}

/**
 * Constructs an Airship component.
 */
export function makeAirship(): Airship {
  // Static state shared by all mounted containers:
  const [onClear, emitClear]: Event<void> = makeEvent()
  const [onGuestsChange, emitGuestsChange]: Event<Guest[]> = makeEvent()
  let guests: Guest[] = []
  let nextKey: number = 0

  const AirshipHost = (props: AirshipProps): JSX.Element => {
    const { children } = props

    // Watch the common guest list:
    const [ourGuests, setGuests] = React.useState(guests)
    React.useEffect(() => onGuestsChange(setGuests), [])

    // Track layout changes:
    const [layout, setLayout] = React.useState(emptyLayout)

    return (
      <>
        <Barometer onLayout={setLayout} />
        {children}
        {ourGuests.map(guest => (
          <View
            key={guest.key}
            pointerEvents="box-none"
            style={{
              ...layout.offset,
              ...layout.padding,
              flexDirection: 'row',
              justifyContent: 'center',
              position: 'absolute'
            }}
          >
            {guest.element}
          </View>
        ))}
      </>
    )
  }

  function clear(): void {
    emitClear(undefined)
  }

  async function show<T>(render: AirshipRender<T>): Promise<T> {
    const key = `airship${nextKey++}`

    function remove(): void {
      unclear()
      guests = guests.filter(guest => guest.key !== key)
      emitGuestsChange(guests)
    }

    // Assemble the bridge:
    const [on, emit]: Events<AirshipEvents> = makeEvents()
    let bridge!: AirshipBridge<T>
    const promise: Promise<T> = new Promise((resolve, reject) => {
      bridge = {
        on,
        onResult: callback => on('result', callback),
        reject,
        remove,
        resolve
      }
    })

    // Hook up events:
    promise.then(
      () => emit('result', undefined),
      () => emit('result', undefined)
    )
    const unclear = onClear(() => emit('clear', undefined))

    // Save the guest element in the shared state:
    guests = [...guests, { key, element: render(bridge) }]
    emitGuestsChange(guests)
    return promise
  }

  return Object.assign(AirshipHost, { clear, show })
}
