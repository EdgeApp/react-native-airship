#!/bin/sh

(cd ..; yarn prepare)
rm -r ./node_modules/react-native-airship/lib/
cp -r ../package.json ../lib ./node_modules/react-native-airship/
