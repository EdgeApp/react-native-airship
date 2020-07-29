import * as React from 'react'
import { Keyboard, TextInput, TouchableOpacity, View } from 'react-native'
import { cacheStyles } from 'react-native-patina'

import { ThemedText } from './ThemedText'
import { Theme, useTheme } from './ThemeProvider'

interface Props {
  value: string
  onChangeText: (text: string) => void
}

export function ThemedTextInput(props: Props): JSX.Element {
  const { value, onChangeText } = props
  const theme = useTheme()
  const styles = getStyles(theme)

  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={() => Keyboard.dismiss()}>
        <ThemedText>Hide keyboard</ThemedText>
      </TouchableOpacity>
    </View>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  input: {
    backgroundColor: theme.textInput,
    borderColor: theme.textInputBorder,
    borderRadius: theme.rem(0.5),
    borderWidth: theme.rem(0.1),
    color: theme.textInputText,
    flex: 1,
    fontSize: theme.rem(1),
    marginBottom: theme.rem(1),
    marginLeft: theme.rem(1),
    marginTop: theme.rem(1),
    padding: theme.rem(0.5)
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
}))
