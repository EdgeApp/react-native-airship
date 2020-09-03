#!/bin/sh
# Copies the latest react-native-airship code changes into the demo folder

npm run prepare
rm -r ./AirshipDemo/node_modules/react-native-airship/lib/
cp -r package.json lib ./AirshipDemo/node_modules/react-native-airship/
