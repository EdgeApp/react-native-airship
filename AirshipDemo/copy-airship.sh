(cd ..; yarn prepare)
rm -r ./node_modules/react-native-airship/lib/

cp -rv ../demos.d.ts ../demos.js ../package.json ../lib ./node_modules/react-native-airship/
