#!/bin/sh
# Copies the latest react-native-airship code changes into the demo folder

if [ ! -d ./AirshipDemo/node_modules/react-native-airship/ ]; then
  echo 'Please run yarn inside the AirshipDemo folder first'
  exit 1
fi

npm run prepare

rm -r ./AirshipDemo/node_modules/react-native-airship/lib/
cp -r package.json lib ./AirshipDemo/node_modules/react-native-airship/
