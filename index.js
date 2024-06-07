/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './navigation/app'
import {MainScreen} from './screens';
import messaging from '@react-native-firebase/messaging';
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

AppRegistry.registerHeadlessTask(appName, () => {
    console.log("background")
});
AppRegistry.registerComponent(appName, () => () => <App></App>);

