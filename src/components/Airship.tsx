import * as React from 'react'
import { Event, makeEvent } from 'yavent'

import { Airship, AirshipBridge, AirshipProps, AirshipRender } from '../types'
import { Wrapper } from './Wrapper'

interface Guest {
  key: string
  element: React.ReactNode
}

/**
 * Constructs an Airship component.
 */
export function makeAirship(): Airship {
  // Static state shared by all mounted containers:
  const [onGuestsChange, emitGuestsChange]: Event<Guest[]> = makeEvent()
  let guests: Guest[] = []
  let nextKey: number = 0

  const AirshipHost: React.FunctionComponent<AirshipProps> = props => {
    const { children, avoidAndroidKeyboard, statusBarTranslucent } = props
    const [ourGuests, setGuests] = React.useState(guests)
    React.useEffect(() => onGuestsChange(setGuests), [])

    return (
      <>
        {children}
        {ourGuests.map(guest => (
          <Wrapper
            key={guest.key}
            avoidAndroidKeyboard={avoidAndroidKeyboard}
            statusBarTranslucent={statusBarTranslucent}
          >
            {guest.element}
          </Wrapper>
        ))}
      </>
    )
  }

  function show<T>(render: AirshipRender<T>): Promise<T> {
    const key = `airship${nextKey++}`

    function remove(): void {
      guests = guests.filter(guest => guest.key !== key)
      emitGuestsChange(guests)
    }

    // Assemble the bridge:
    let bridge!: AirshipBridge<T>
    const promise: Promise<T> = new Promise((resolve, reject) => {
      bridge = {
        onResult: callback => promise.then(callback, callback),
        reject,
        remove,
        resolve
      }
    })

    // Save the guest element in the shared state:
    guests = [...guests, { key, element: render(bridge) }]
    emitGuestsChange(guests)
    return promise
  }

  return Object.assign(AirshipHost, { show })
}
