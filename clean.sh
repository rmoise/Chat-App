rm -rf node_modules
watchman watch-del-all
rm -rf $TMPDIR/react-native-packager-cache-*
rm -rf $TMPDIR/metro-bundler-cache-*
npm cache clean --force
npm install
cd ios/
pod disintegrate
rm Podfile.lock
pod install
cd ..
npx react-native start --reset-cache
<br>