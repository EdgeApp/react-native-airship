import * as React from 'react'
import {
  Appearance,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  View
} from 'react-native'
import { makeAirship } from 'react-native-airship'
import { cacheStyles } from 'react-native-patina'

import { CustomFloatingComponent } from './CustomFloatingComponent'
import { TextInputModal } from './TextInputModal'
import { ThemedDropdown } from './ThemedDropdown'
import { ThemedToast } from './ThemedToast'
import { ThemedButton } from './theming/ThemedButton'
import { ThemedText } from './theming/ThemedText'
import { changeTheme, Theme, ThemeProvider } from './theming/ThemeProvider'
import { darkTheme, lightTheme } from './theming/themes'

const Airship = makeAirship()

/**
 * The demo app. This has a main scroll view with a handful of buttons
 * for launching different Airship components.
 */
export const Demo = (props: {}): JSX.Element => {
  // Switch states:
  const [dark, setDark] = React.useState(Appearance.getColorScheme() === 'dark')
  const [translucent, setTranslucent] = React.useState(true)

  // Theming:
  const theme = dark ? darkTheme : lightTheme
  React.useEffect(() => changeTheme(theme), [theme])
  const styles = getStyles(theme)
  const marginTop =
    translucent && StatusBar.currentHeight != null ? StatusBar.currentHeight : 0

  return (
    <ThemeProvider>
      <Airship>
        <StatusBar
          backgroundColor="#00000000"
          barStyle={dark && translucent ? 'light-content' : 'dark-content'}
          translucent={translucent}
        />
        <SafeAreaView style={styles.screen}>
          <ScrollView
            style={{ flex: 1, marginTop }}
            contentContainerStyle={styles.scrollContents}
          >
            <ThemedText header>Airship Demo</ThemedText>
            <ThemedText>
              Press some buttons to launch the demo components
            </ThemedText>
            <ThemedButton onPress={handleModal}>Modal</ThemedButton>
            <ThemedButton onPress={handleCenterModal}>
              Centered modal
            </ThemedButton>
            <ThemedButton onPress={handleDropdown}>Dropdown</ThemedButton>
            <ThemedButton onPress={handleToast}>Toast</ThemedButton>
            <ThemedButton onPress={handleCustom}>Custom component</ThemedButton>
            <ThemedButton onPress={handleClear}>Clear all</ThemedButton>
            <View style={styles.row}>
              <ThemedText>Dark mode</ThemedText>
              <Switch
                onValueChange={setDark}
                style={{ margin: theme.rem(1) }}
                value={dark}
              />
            </View>
            {Platform.OS === 'android' ? (
              <View style={styles.row}>
                <ThemedText>Translucent status bar</ThemedText>
                <Switch
                  onValueChange={setTranslucent}
                  style={{ margin: theme.rem(1) }}
                  value={translucent}
                />
              </View>
            ) : null}
          </ScrollView>
        </SafeAreaView>
      </Airship>
    </ThemeProvider>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.background
  },
  scrollView: {
    flex: 1
  },
  scrollContents: {
    padding: theme.rem(1)
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
}))

// Callbacks for demo components:

function handleModal(): void {
  Airship.show(bridge => {
    return <TextInputModal bridge={bridge} />
  }).catch(ignoreError)
}

function handleCenterModal(): void {
  Airship.show(bridge => {
    return <TextInputModal bridge={bridge} center />
  }).catch(ignoreError)
}

function handleDropdown(): void {
  Airship.show(bridge => {
    return (
      <ThemedDropdown bridge={bridge}>Alert: This is a dropdown</ThemedDropdown>
    )
  }).catch(ignoreError)
}

function handleToast(): void {
  Airship.show(bridge => {
    return <ThemedToast bridge={bridge} message="Toast is happening..." />
  }).catch(ignoreError)
}

function handleCustom(): void {
  Airship.show(bridge => {
    return <CustomFloatingComponent bridge={bridge} />
  }).catch(ignoreError)
}

function handleClear(): void {
  Airship.clear()
}

const ignoreError = (): void => undefined
